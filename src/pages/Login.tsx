import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = () => {
    // Validation
    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Email không hợp lệ!');
      return;
    }

    // Attempt login
    const success = login(email, password);
    
    if (success) {
      toast.success('Đăng nhập thành công!');
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      toast.error('Email hoặc mật khẩu không chính xác!');
    }
  };

  const handleGoogleSignIn = () => {
    toast.info('Tính năng đăng nhập Google đang được phát triển!');
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900' : ''}`}>
      {/* Left side - Login Form */}
      <div className={`w-1/2 flex items-center justify-center p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-md">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back! Please enter your details.</p>

          <div>
            {/* Email Input */}
            <div className="mb-5">
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Remember for 30 days</span>
              </label>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Forgot password
              </a>
            </div>

            {/* Sign in Button */}
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: '#9333ea' }}
              className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all mb-4"
            >
              Sign in
            </button>

            {/* Google Sign in */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            {/* Sign up link */}
            <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className={`w-1/2 flex items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-96 h-96 rounded-full opacity-80 blur-3xl ${
            isDarkMode ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900' : 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600'
          }`}></div>
        </div>
        <div className="relative z-10">
          <div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-80 h-80 rounded-full shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
              isDarkMode ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900' : 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600'
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;