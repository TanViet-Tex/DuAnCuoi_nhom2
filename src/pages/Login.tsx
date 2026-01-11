import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async () => {
    // Validation
    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Email không hợp lệ!');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Đăng nhập thành công!');
        setTimeout(() => {
          if (email === 'admin@gmail.com') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 800);
      } else {
        toast.error('Email hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      toast.error('Lỗi kết nối tới server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    setLoading(true);
    try {
      const success = await loginWithGoogle(idToken);
      if (success) {
        toast.success('Đăng nhập Google thành công!');
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        toast.error('Lỗi đăng nhập Google. Vui lòng thử lại!');
      }
    } catch (err) {
      toast.error('Lỗi kết nối tới server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Lỗi đăng nhập Google. Vui lòng thử lại!');
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
              disabled={loading}
              style={{ backgroundColor: '#9333ea' }}
              className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all mb-4 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Google Sign in */}
            <div className="mt-4">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </GoogleOAuthProvider>
            </div>

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