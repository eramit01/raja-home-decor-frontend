import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { RootState } from '../store';
import { FiSmartphone, FiArrowRight, FiLock, FiUser } from 'react-icons/fi';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleCheckUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/check-user', { phone });

      if (res.data.exists) {
        // User exists, send OTP for login
        await handleSendOTP();
      } else {
        // New user, go to register step
        setStep('register');
      }
    } catch (err: any) {
      console.error('Check User Error:', err);
      setError(err.response?.data?.message || 'Failed to verify user.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      // Dev helper not needed in production but harmless
      if (response.data && response.data.message && response.data.message.includes('DEV:')) {
        console.log(response.data.message);
      }
      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP Error:', err);
      setError(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/verify-otp', { phone, otp });
      const { user, accessToken, csrfToken } = response.data.data;

      dispatch(setCredentials({
        user: user,
        csrfToken: csrfToken || accessToken,
        accessToken: accessToken
      }));
      toast.success('Logged in successfully!');
    } catch (err: any) {
      console.error('Verify Error:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/register', { phone, name });
      const { user, accessToken, csrfToken } = response.data.data;

      dispatch(setCredentials({
        user: user,
        csrfToken: csrfToken || accessToken,
        accessToken: accessToken
      }));
      toast.success('Registration successful!');
    } catch (err: any) {
      console.error('Register Error:', err);
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-outfit">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 'phone' ? 'Login or Signup' : step === 'register' ? 'Complete Profile' : 'Verify OTP'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 'phone' ? 'Enter your mobile number to get started' :
            step === 'register' ? `Setting up account for +91 ${phone}` :
              `Enter OTP sent to +91 ${phone}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">

          {step === 'phone' && (
            <form className="space-y-6" onSubmit={handleCheckUser}>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSmartphone className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? 'Continue' : 'Continue'} <FiArrowRight className="ml-2 mt-0.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'register' && (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Change Number
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  One Time Password (OTP)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 tracking-[0.5em] text-center font-bold text-lg"
                  />
                </div>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    Change Number?
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <img className="h-5 w-auto" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
