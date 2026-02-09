import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiChevronRight, FiLock, FiUser } from 'react-icons/fi';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { closeLoginModal, clearPendingActions } from '../store/slices/uiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { addToCart } from '../store/slices/cartSlice';
import { getErrorMessage } from '../utils/errorHandler';

type AuthStep = 'PHONE_INPUT' | 'LOGIN_PASSWORD' | 'REGISTER_DETAILS';

export const LoginModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addToWishlist: addToWishlistContext } = useWishlist();
    const { isLoginModalOpen, pendingAction, pendingActionData } = useSelector((state: RootState) => state.ui);

    const [step, setStep] = useState<AuthStep>('PHONE_INPUT');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isLoginModalOpen) {
            setStep('PHONE_INPUT');
            setPhone('');
            setPassword('');
            setName('');
        }
    }, [isLoginModalOpen]);

    const handleSuccess = async (user: any, csrfToken: string | undefined) => {
        dispatch(setCredentials({
            user: user,
            csrfToken: csrfToken
        }));
        toast.success(`Welcome back, ${user.name || 'User'}!`);

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

        dispatch(closeLoginModal());
        dispatch(clearPendingActions());
    };

    const handleCheckUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || phone.length < 10) return toast.error('Please enter a valid mobile number');

        setIsLoading(true);
        try {
            const response = await authService.checkUser(phone);

            if (response.data.exists && response.data.hasPassword) {
                setStep('LOGIN_PASSWORD');
                if (response.data.name) setName(response.data.name); // Pre-fill name if available for display?
            } else {
                // New user OR existing user without password (migration)
                setStep('REGISTER_DETAILS');
            }
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Failed to verify user'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return toast.error('Please enter your password');

        setIsLoading(true);
        try {
            const response = await authService.login({ phone, password });
            await handleSuccess(response.data.user, response.data.csrfToken);
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Login failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return toast.error('Please enter your name');
        if (!password || password.length < 6) return toast.error('Password must be at least 6 characters');

        setIsLoading(true);
        try {
            const response = await authService.register({ phone, password, name });
            await handleSuccess(response.data.user, response.data.csrfToken);
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Registration failed'));
        } finally {
            setIsLoading(false);
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

                                <button
                                    onClick={() => dispatch(closeLoginModal())}
                                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>

                                <div className="mb-8">
                                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                                        {step === 'PHONE_INPUT' && 'Login or Signup'}
                                        {step === 'LOGIN_PASSWORD' && `Welcome Back, ${name || 'User'}`}
                                        {step === 'REGISTER_DETAILS' && 'Complete Setup'}
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {step === 'PHONE_INPUT' && 'Enter your mobile number to get started'}
                                        {step === 'LOGIN_PASSWORD' && `Enter password for +91 ${phone}`}
                                        {step === 'REGISTER_DETAILS' && `Set a password for +91 ${phone}`}
                                    </p>
                                </div>

                                {step === 'PHONE_INPUT' && (
                                    <div className="space-y-4">


                                        <form onSubmit={handleCheckUser} className="space-y-4">
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 10) setPhone(val);
                                                    }}
                                                    className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none font-medium text-gray-900"
                                                    placeholder="Enter Mobile Number"
                                                    autoFocus
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoading || phone.length < 10}
                                                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? 'Checking...' : 'Continue'}
                                                {!isLoading && <FiChevronRight className="w-4 h-4" />}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {step === 'LOGIN_PASSWORD' && (
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="relative">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                                                placeholder="Enter Password"
                                                autoFocus
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all"
                                        >
                                            {isLoading ? 'Logging in...' : 'Login'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep('PHONE_INPUT');
                                                setPassword('');
                                            }}
                                            className="w-full text-sm text-gray-500 hover:text-black font-medium"
                                        >
                                            Change Number
                                        </button>
                                    </form>
                                )}

                                {step === 'REGISTER_DETAILS' && (
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="relative">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                                                placeholder="Full Name"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="relative">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                                                placeholder="Set Password (min 6 chars)"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all"
                                        >
                                            {isLoading ? 'Creating Account...' : 'Register & Login'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep('PHONE_INPUT');
                                                setPassword('');
                                                setName('');
                                            }}
                                            className="w-full text-sm text-gray-500 hover:text-black font-medium"
                                        >
                                            Change Number
                                        </button>
                                    </form>
                                )}

                                <p className="text-xs text-center text-gray-400 mt-6 px-8">
                                    By continuing, you agree to our
                                    <a href="/terms" className="text-black hover:underline mx-1">Terms of Service</a>
                                    &
                                    <a href="/privacy" className="text-black hover:underline mx-1">Privacy Policy</a>
                                </p>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
