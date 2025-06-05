import React, { useState } from 'react';
import { SettingsState } from '@/app/dashboard/setting/page';
import ToggleSwitch from '../ui/ToggleSwitch';


interface SecuritySectionProps {
  settings: SettingsState;
  toggleSetting: (settingName: keyof SettingsState) => void;
  showLoading: () => void;
  hideLoading: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}


const SecuritySection: React.FC<SecuritySectionProps> = ({
  settings,
  toggleSetting,
  showLoading,
  hideLoading,
  showToast
}) => {
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    
    setPasswordStrength(Math.min(strength, 100));
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'new') {
      checkPasswordStrength(value);
    }
  };

  const getPasswordStrengthInfo = () => {
    if (passwordStrength < 50) {
      return { color: 'bg-red-500', text: 'Weak', textColor: 'text-red-500' };
    } else if (passwordStrength < 75) {
      return { color: 'bg-yellow-500', text: 'Medium', textColor: 'text-yellow-500' };
    } else {
      return { color: 'bg-green-500', text: 'Strong', textColor: 'text-green-500' };
    }
  };

  const changePassword = () => {
    // Validation
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      showToast('Please fill in all password fields', 'error');
      return;
    }
    
    if (passwordForm.new !== passwordForm.confirm) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    if (passwordForm.new.length < 8 || passwordForm.new.length > 16) {
      showToast('Password must be between 8 and 16 characters', 'error');
      return;
    }
    
    if (passwordStrength < 50) {
      showToast('Please choose a stronger password', 'error');
      return;
    }
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
      hideLoading();
      if (passwordForm.current === 'wrong') {
        showToast('Current password is incorrect', 'error');
      } else {
        showToast('Password changed successfully!', 'success');
        setPasswordForm({ current: '', new: '', confirm: '' });
        setPasswordStrength(0);
      }
    }, 2000);
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <div className="settings-section">
      {/* Password Change Card */}
      <div className="floating-card bg-white rounded-2xl p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-lock text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
            <p className="text-gray-600">Update your account password for better security</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 pr-12 transition-all"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 pr-12 transition-all"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            
            {passwordForm.new && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Password Strength</span>
                  <span className={`font-medium ${strengthInfo.textColor}`}>{strengthInfo.text}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 pr-12 transition-all"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            
            {passwordForm.confirm && (
              <div className="mt-2 text-sm">
                <span className={passwordForm.new === passwordForm.confirm ? 'text-green-600' : 'text-red-600'}>
                  <i className={`fas ${passwordForm.new === passwordForm.confirm ? 'fa-check-circle' : 'fa-times-circle'} mr-1`}></i>
                  {passwordForm.new === passwordForm.confirm ? 'Passwords match' : "Passwords don't match"}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={changePassword}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <i className="fas fa-lock mr-2"></i>
            Update Password
          </button>
        </div>
      </div>

      {/* Security Settings Card */}
      <div className="floating-card bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <i className="fas fa-shield-alt text-green-600"></i>
          Security Preferences
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-mobile-alt text-blue-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.twoFactor}
              onToggle={() => toggleSetting('twoFactor')}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-sign-in-alt text-yellow-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Login Notifications</h4>
                <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.loginNotifications}
              onToggle={() => toggleSetting('loginNotifications')}
            />
          </div>

          <div className="p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-purple-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Session Timeout</h4>
                  <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">{sessionTimeout} minutes</span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>15 min</span>
              <span>2 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;