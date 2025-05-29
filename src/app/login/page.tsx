'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import CryptoJS from 'crypto-js';

// Encryption Service (unchanged)
class AesEncryptionService {
  private secretKey = 'mysecretkey12345';
  private iv = '1234567890abcdef';

  encrypt(plaintext: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  }

  decrypt(ciphertext: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

// Auth Service (unchanged)
class AuthService {
  private employeeCodeKey = 'employeeCode';
  private encryptionService = new AesEncryptionService();

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  setEmployeeCode(code: string): void {
    if (this.isLocalStorageAvailable()) {
      const encryptedCode = this.encryptionService.encrypt(code);
      localStorage.setItem(this.employeeCodeKey, encryptedCode);
    }
  }

  getEmployeeCode(): string {
    if (this.isLocalStorageAvailable()) {
      const encryptedCode = localStorage.getItem(this.employeeCodeKey);
      if (encryptedCode) {
        return this.encryptionService.decrypt(encryptedCode);
      }
      return 'NA';
    }
    return 'NA';
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.employeeCodeKey);
    }
  }
}

// Login Service (unchanged)
class LoginService {
  private encryptionService = new AesEncryptionService();
  private baseUrl = 'http://localhost:3000/api'; // Update with your API URL

  async validateLogin(data: { email: string; password: string }): Promise<any> {
    const encryptedEmail = this.encryptionService.encrypt(data.email);
    const encryptedPassword = this.encryptionService.encrypt(data.password);

    const encodedEmail = encodeURIComponent(encryptedEmail);
    const encodedPassword = encodeURIComponent(encryptedPassword);

    const queryString = `?Email=${encodedEmail}&Password=${encodedPassword}`;
    const fullUrl = `${this.baseUrl}/login${queryString}`;

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Server Error: Unable to process your request.');
    }

    return response.json();
  }
}

// Main Login Component (Updated with dashboard color scheme)
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | ''>('');
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });

  const router = useRouter();
  const loginService = new LoginService();
  const authService = new AuthService();
  const encryptionService = new AesEncryptionService();

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFocus = (name: 'email' | 'password') => {
    setIsFocused(prev => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleBlur = (name: 'email' | 'password') => {
    setIsFocused(prev => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showAlert('Please fill in all required fields correctly.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginService.validateLogin(formData);
      
      if (response.Authorization) {
        try {
          const decryptedEmployeeCode = encryptionService.decrypt(response.EmployeeCode);
          authService.setEmployeeCode(decryptedEmployeeCode);
          
          showAlert('Login successful! Redirecting...', 'success');
          
          setTimeout(() => {
            router.push('/attendance');
          }, 1500);
          
        } catch (error) {
          showAlert('Error processing login response', 'error');
        }
      } else {
        showAlert(response.message || 'Invalid credentials', 'error');
      }
    } catch (error) {
      showAlert('Server Error: Unable to process your request.', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '20px 20px',
        }}>
        </div>
      </div>
      
      {/* Alert Message */}
      {alertMessage && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-xl opacity-0 animate-fade-in ${
            alertType === 'success' 
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {alertType === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            {alertMessage}
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="relative w-full max-w-md p-1 animate-fade-in">
        {/* Decorative Border Gradient */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur-sm opacity-75"></div>
        
        {/* Main Card */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">EMS</span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 -right-4 w-3 h-3 rounded-full bg-purple-400 animate-pulse-slow"></div>
              <div className="absolute -bottom-2 left-8 w-2 h-2 rounded-full bg-blue-400 animate-pulse-slow-2"></div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Employee Portal</h1>
            <p className="text-slate-500 mt-2">Sign in to access your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1">
              <div className={`relative border-b-2 transition-all duration-300 ${
                errors.email 
                  ? 'border-red-400' 
                  : isFocused.email || formData.email 
                    ? 'border-purple-500' 
                    : 'border-slate-300'
              }`}>
                <Mail 
                  className={`absolute top-1/2 -translate-y-1/2 left-0 w-5 h-5 transition-colors duration-300 ${
                    errors.email 
                      ? 'text-red-400' 
                      : isFocused.email || formData.email
                        ? 'text-purple-500'
                        : 'text-slate-400'
                  }`} 
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  className="w-full bg-transparent py-4 pl-8 pr-4 outline-none text-slate-800 placeholder-transparent transition-all duration-300"
                  placeholder="Email Address"
                />
                <label 
                  htmlFor="email" 
                  className={`absolute left-8 transition-all duration-300 text-slate-500 ${
                    isFocused.email || formData.email
                      ? '-top-6 text-xs font-medium'
                      : 'top-1/2 -translate-y-1/2'
                  }`}
                >
                  Email Address
                </label>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 animate-fade-in pl-8 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className={`relative border-b-2 transition-all duration-300 ${
                errors.password 
                  ? 'border-red-400' 
                  : isFocused.password || formData.password 
                    ? 'border-purple-500' 
                    : 'border-slate-300'
              }`}>
                <Lock 
                  className={`absolute top-1/2 -translate-y-1/2 left-0 w-5 h-5 transition-colors duration-300 ${
                    errors.password 
                      ? 'text-red-400' 
                      : isFocused.password || formData.password
                        ? 'text-purple-500'
                        : 'text-slate-400'
                  }`}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  className="w-full bg-transparent py-4 pl-8 pr-10 outline-none text-slate-800 placeholder-transparent transition-all duration-300"
                  placeholder="Password"
                />
                <label 
                  htmlFor="password" 
                  className={`absolute left-8 transition-all duration-300 text-slate-500 ${
                    isFocused.password || formData.password
                      ? '-top-6 text-xs font-medium'
                      : 'top-1/2 -translate-y-1/2'
                  }`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-1 text-slate-400 hover:text-purple-500 transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 animate-fade-in pl-8 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 focus:outline-none accent-purple-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-slate-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-purple-500 hover:text-purple-700 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <a href="#" className="font-semibold text-purple-500 hover:text-purple-700 transition-colors">
                Contact Administrator
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes pulse-slow-2 {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          65% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slow-2 {
          animation: pulse-slow-2 5s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}