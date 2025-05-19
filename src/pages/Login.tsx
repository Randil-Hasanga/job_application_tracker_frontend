import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import illustration from '../assets/log in.png';
import { useNavigate } from 'react-router-dom';
import LoginService from '../services/loginService';

export default function LoginPage() {

    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        const newErrors = { email: '', password: '' };

        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        setLoading(true);

        try {
            const response = await LoginService.login(email, password);
            console.log('Login successful:', response);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        LoginService.googleLogin();
    };

    return (
        <div className="border border-blue-200 min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl border border-blue-200 rounded-xl shadow-lg bg-white p-4 md:p-8 my-6">

                {/* Illustration Section */}
                <div className="hidden md:flex w-full md:w-1/2 pr-0 md:pr-6 flex-col items-center justify-center">
                    <h2 className="text-4xl mb-4 text-center text-blue-800" style={{ fontFamily: "'Montserrat', cursive" }}>Personal Job Application Tracker</h2>
                    <img
                        src={illustration}
                        alt="Login Illustration"
                        className="w-72 h-auto object-cover"
                    />
                </div>



                {/* Login Form Section */}
                <div className="w-full md:w-1/2 mt-6 md:mt-0">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Welcome Back!</h2>

                    {errorMessage && ( // Conditionally render general error message
                        <div className="mb-4 text-red-600 text-sm text-center">
                            {errorMessage}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center">
                        <div className="flex-grow h-px bg-gray-200"></div>
                        <span className="px-3 text-sm text-gray-500">or</span>
                        <div className="flex-grow h-px bg-gray-200"></div>
                    </div>

                    <button
                        className="mt-6 w-full flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                    </button>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don’t have an account?{' '}
                        <button className="text-blue-600 hover:underline" onClick={() => { navigate('/signup') }}>Sign Up</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
