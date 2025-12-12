import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Email validation
  const isEmailValid = email.includes('@') && email.length > 0;
  const showEmailError = emailTouched && !isEmailValid;

  // Phone validation
  const isPhoneValid = /^\d+$/.test(phone) && phone.length > 0;
  const showPhoneError = phoneTouched && (!isPhoneValid || phone.length === 0);

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;

    if (strength <= 2) return { strength, label: 'Yếu', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Trung bình', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Mạnh', color: 'bg-green-500' };
    return { strength, label: 'Rất mạnh', color: 'bg-green-600' };
  };

  const passwordStrength = getPasswordStrength(password);
  const isPasswordStrong = passwordStrength.strength >= 4;
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleRegister = () => {
    // Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!isEmailValid) {
      toast.error('Email không hợp lệ!');
      return;
    }

    if (!isPhoneValid) {
      toast.error('Số điện thoại chỉ được chứa số!');
      return;
    }

    if (!isPasswordStrong) {
      toast.error('Mật khẩu chưa đủ mạnh!');
      return;
    }

    if (!isPasswordMatch) {
      toast.error('Mật khẩu không trùng khớp!');
      return;
    }

    // Attempt registration
    const success = register(fullName, email, phone, password);

    if (success) {
      toast.success('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      toast.error('Email đã được sử dụng!');
    }
  };

  const handleGoogleSignUp = () => {
    toast.info('Tính năng đăng ký Google đang được phát triển!');
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900' : ''}`}>
      {/* Left side - Decorative */}
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

      {/* Right side - Register Form */}
      <div className={`w-1/2 flex items-center justify-center p-8 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-md py-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign up to get started</p>

          <div>
            {/* Full Name Input */}
            <div className="mb-4">
              <label htmlFor="fullName" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tên người dùng
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="Nhập email của bạn"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                  } ${showEmailError ? 'border-red-500' : ''} ${isEmailValid && emailTouched ? 'border-green-500' : ''}`}
                />
                {isEmailValid && emailTouched && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {showEmailError && (
                <p className="text-red-500 text-sm mt-1">Email phải chứa ký tự @</p>
              )}
            </div>

            {/* Phone Input */}
            <div className="mb-4">
              <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Số điện thoại
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setPhoneTouched(true)}
                  placeholder="Nhập số điện thoại"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                  } ${showPhoneError ? 'border-red-500' : ''} ${isPhoneValid && phoneTouched ? 'border-green-500' : ''}`}
                />
                {isPhoneValid && phoneTouched && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {showPhoneError && (
                <p className="text-red-500 text-sm mt-1">
                  {phone.length === 0 ? 'Số điện thoại không được để trống' : 'Số điện thoại chỉ được chứa số'}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="Nhập mật khẩu"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                  } ${isPasswordStrong && passwordTouched ? 'border-green-500' : ''}`}
                />
                {isPasswordStrong && passwordTouched && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full ${
                          level <= passwordStrength.strength ? passwordStrength.color : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className={`text-sm ${
                    passwordStrength.strength <= 2 ? 'text-red-500' : 
                    passwordStrength.strength <= 3 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    Độ mạnh: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmPasswordTouched(true)}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                  } ${confirmPasswordTouched && !isPasswordMatch && confirmPassword.length > 0 ? 'border-red-500' : ''} 
                  ${isPasswordMatch ? 'border-green-500' : ''}`}
                />
                {isPasswordMatch && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {confirmPasswordTouched && !isPasswordMatch && confirmPassword.length > 0 && (
                  <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {confirmPasswordTouched && !isPasswordMatch && confirmPassword.length > 0 && (
                <p className="text-red-500 text-sm mt-1">Mật khẩu không trùng khớp</p>
              )}
            </div>

            {/* Sign up Button */}
            <button
              onClick={handleRegister}
              style={{ backgroundColor: '#9333ea' }}
              className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all mb-4"
            >
              Sign up
            </button>

            {/* Google Sign up */}
            <button
              onClick={handleGoogleSignUp}
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
              Sign up with Google
            </button>

            {/* Sign in link */}
            <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;