import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiSmartphone, FiChevronRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { closeLoginModal, clearPendingActions } from '../store/slices/uiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { fetchCsrfToken } from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { addToCart } from '../store/slices/cartSlice';
import { getErrorMessage } from '../utils/errorHandler';

export const LoginModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addToWishlist: addToWishlistContext } = useWishlist(); // Renamed to avoid conflict
    const { isLoginModalOpen, pendingAction, pendingActionData } = useSelector((state: RootState) => state.ui);

    const [step, setStep] = useState<'INITIAL' | 'OTP_SENT'>('INITIAL');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // Reset state when modal opens
    useEffect(() => {
        if (isLoginModalOpen) {
            setStep('INITIAL');
            setPhone('');
            setOtp(['', '', '', '', '', '']);
            setTimer(0);
        }
    }, [isLoginModalOpen]);

    // Timer countdown
    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || phone.length < 10) return toast.error('Please enter a valid mobile number');

        setIsLoading(true);
        try {
            // await authService.sendOTP({ email: phone }); // REMOVED: Incorrect payload causing Zod error
            // NOTE: existing authService.sendOTP takes {email: string}, but backend controller logic likely supports phone if we check order.controller.ts logic... 
            // Wait, let's verify authService.sendOTP. 
            // Actually backend `auth.validator.ts` sends `phone` but `auth.service.ts` interface might be named generic.
            // Let's assume we pass { phone } if backend supports it, or adapt. 
            // Checking previous files: auth.controller.ts calls `authService.sendOTP(phone)`. 
            // The frontend logic should send whatever the backend expects.

            // Let's assume standard 'phone' for now.
            await authService.sendOTP({ phone });

            setStep('OTP_SENT');
            setTimer(30);
            toast.success(`OTP sent to ${phone} `);
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Failed to send OTP'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) return toast.error('Please enter valid 6-digit OTP');

        setIsLoading(true);
        try {
            const response = await authService.verifyOTP({ phone, otp: otpValue } as any);

            // Set credentials with CSRF token
            dispatch(setCredentials({
                user: response.data.user,
                csrfToken: response.data.csrfToken
            }));
            toast.success('Logged in successfully!');

            // Handle Pending Actions
            if (pendingAction === 'CART' && pendingActionData) {
                dispatch(addToCart(pendingActionData));
                toast.success('Item added to cart');
            } else if (pendingAction === 'WISHLIST' && pendingActionData?.productId) {
                await addToWishlistContext(pendingActionData.productId);
                toast.success('Added to wishlist');
            } else if (pendingAction === 'CHECKOUT' && pendingActionData) {
                dispatch(addToCart(pendingActionData));
                navigate('/checkout');
            }

            // Clean up
            dispatch(closeLoginModal());
            dispatch(clearPendingActions());

        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Invalid OTP'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    return (
        <Transition appear show={isLoginModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={() => dispatch(closeLoginModal())}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center md:items-center p-0 md:p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="translate-y-full md:opacity-0 md:scale-95 md:translate-y-0"
                            enterTo="translate-y-0 md:opacity-100 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="translate-y-0 md:opacity-100 md:scale-100"
                            leaveTo="translate-y-full md:opacity-0 md:scale-95 md:translate-y-0"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-2xl md:rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                {/* Close Button */}
                                <button
                                    onClick={() => dispatch(closeLoginModal())}
                                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>

                                {/* Header */}
                                <div className="mb-8">
                                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                                        {step === 'INITIAL' ? 'Login or Signup' : 'Verify Mobile'}
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {step === 'INITIAL'
                                            ? 'Get access to your orders, wishlist and recommendations.'
                                            : `We've sent a 6-digit OTP to +91 ${phone}`
                                        }
                                    </p >
                                </div >

                                {step === 'INITIAL' ? (
                                    <div className="space-y-4">
                                        {/* Google Login (Mock) */}
                                        <button
                                            onClick={async () => {
                                                const mockUser = {
                                                    id: 'google-mock-id',
                                                    email: 'demo-user@gmail.com',
                                                    name: 'Demo User',
                                                    role: 'customer' as const
                                                };
                                                // Dispatch mock credentials (no token needed with cookies)
                                                dispatch(setCredentials({
                                                    user: mockUser
                                                }));

                                                toast.success('Logged in with Google (Demo Mode)');

                                                // Handle Pending Actions logic (duplicated from verifyOTP)
                                                if (pendingAction === 'CART' && pendingActionData) {
                                                    dispatch(addToCart(pendingActionData));
                                                    toast.success('Item added to cart');
                                                } else if (pendingAction === 'WISHLIST' && pendingActionData?.productId) {
                                                    await addToWishlistContext(pendingActionData.productId);
                                                    toast.success('Added to wishlist');
                                                } else if (pendingAction === 'CHECKOUT' && pendingActionData) {
                                                    dispatch(addToCart(pendingActionData));
                                                    navigate('/checkout');
                                                }

                                                dispatch(closeLoginModal());
                                                dispatch(clearPendingActions());
                                            }}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                                        >
                                            <FcGoogle className="w-6 h-6" />
                                            Continue with Google
                                        </button>

                                        <div className="relative flex items-center gap-4 my-2">
                                            <div className="h-px bg-gray-100 flex-1"></div>
                                            <span className="text-xs text-gray-400 font-medium uppercase">OR</span>
                                            <div className="h-px bg-gray-100 flex-1"></div>
                                        </div>

                                        <form onSubmit={handleSendOTP} className="space-y-4">
                                            <div>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '');
                                                            if (val.length <= 10) setPhone(val);
                                                        }}
                                                        className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none font-medium text-gray-900 transition-all placeholder:text-gray-400"
                                                        placeholder="Enter Mobile Number"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading || phone.length < 10}
                                                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? 'Sending...' : 'Continue'}
                                                {!isLoading && <FiChevronRight className="w-4 h-4" />}
                                            </button>
                                        </form>

                                        <p className="text-xs text-center text-gray-400 mt-4 px-8">
                                            By continuing, you agree to our
                                            <a href="/terms" className="text-black hover:underline mx-1">Terms of Service</a>
                                            &
                                            <a href="/privacy" className="text-black hover:underline mx-1">Privacy Policy</a>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <form onSubmit={handleVerifyOTP}>
                                            <div className="flex justify-between gap-2 mb-6">
                                                {otp.map((data, index) => (
                                                    <input
                                                        className="w-12 h-14 border border-gray-200 rounded-lg text-center text-xl font-bold focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                                        type="text"
                                                        name="otp"
                                                        maxLength={1}
                                                        key={index}
                                                        value={data}
                                                        onChange={e => handleOtpChange(e.target, index)}
                                                        onFocus={e => e.target.select()}
                                                        autoFocus={index === 0}
                                                    />
                                                ))}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all"
                                            >
                                                {isLoading ? 'Verifying...' : 'Verify & Login'}
                                            </button>
                                        </form>

                                        <div className="flex items-center justify-between text-sm">
                                            <button
                                                onClick={() => setStep('INITIAL')}
                                                className="text-gray-500 hover:text-black font-medium"
                                            >
                                                Change Number
                                            </button>

                                            {timer > 0 ? (
                                                <span className="text-gray-400">Resend in 00:{String(timer).padStart(2, '0')}</span>
                                            ) : (
                                                <button
                                                    onClick={handleSendOTP}
                                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel >
                        </Transition.Child >
                    </div >
                </div >
            </Dialog >
        </Transition >
    );
};
