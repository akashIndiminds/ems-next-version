import React from 'react';
import { SettingsState } from '@/app/dashboard/setting/page';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

interface PrivacySectionProps {
  settings: SettingsState;
  toggleSetting: (settingName: keyof SettingsState) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({
  settings,
  toggleSetting,
  showToast
}) => {
  const handleDownloadData = () => {
    showToast('Data download request submitted. You will receive an email shortly.', 'info');
    // Simulate API call
    setTimeout(() => {
      showToast('Data export completed and sent to your email!', 'success');
    }, 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showToast('Account deletion request submitted. You will receive a confirmation email.', 'info');
    }
  };

  const handleViewActivityLog = () => {
    showToast('Opening activity log...', 'info');
    // This would typically open a modal or redirect to activity log page
  };

  return (
    <div className="settings-section">
      <div className="floating-card bg-white rounded-2xl p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-user-shield text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Privacy Settings</h2>
            <p className="text-gray-600">Control your data privacy and account security</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Data Privacy Card */}
          <div className="gradient-border">
            <div className="gradient-border-content p-6 bg-white rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-database text-blue-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Data Privacy</h3>
              </div>
              <p className="text-gray-600 mb-6">
                We respect your privacy and are committed to protecting your personal information. 
                Your data is encrypted and stored securely with industry-standard protocols.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleDownloadData}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-download"></i>
                  Download My Data
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-6 py-3 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-trash-alt"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log Card */}
          <div className="gradient-border">
            <div className="gradient-border-content p-6 bg-white rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-history text-green-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Activity Log</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Keep track of your recent account activity, login history, and security events 
                to ensure your account remains secure.
              </p>
              <button 
                onClick={handleViewActivityLog}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <i className="fas fa-eye"></i>
                View Activity Log
              </button>
            </div>
          </div>

          {/* Data Preferences Card */}
          <div className="gradient-border">
            <div className="gradient-border-content p-6 bg-white rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-cog text-yellow-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Data Preferences</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Customize how your data is used for analytics and improve your experience 
                while maintaining your privacy preferences.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                  <div>
                    <h4 className="font-semibold text-gray-800">Allow analytics cookies</h4>
                    <p className="text-sm text-gray-600">Help us improve our services with usage analytics</p>
                  </div>
                  <ToggleSwitch
                    isActive={settings.analyticsCookies}
                    onToggle={() => toggleSetting('analyticsCookies')}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                  <div>
                    <h4 className="font-semibold text-gray-800">Personalized recommendations</h4>
                    <p className="text-sm text-gray-600">Receive content tailored to your interests</p>
                  </div>
                  <ToggleSwitch
                    isActive={settings.personalizedRecommendations}
                    onToggle={() => toggleSetting('personalizedRecommendations')}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                  <div>
                    <h4 className="font-semibold text-gray-800">Data sharing with partners</h4>
                    <p className="text-sm text-gray-600">Share anonymized data with trusted partners</p>
                  </div>
                  <ToggleSwitch
                    isActive={settings.dataSharing}
                    onToggle={() => toggleSetting('dataSharing')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Policy Card */}
          <div className="gradient-border">
            <div className="gradient-border-content p-6 bg-white rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-contract text-purple-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Legal Documents</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Review our privacy policy, terms of service, and other legal documents 
                to understand how we handle your data.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 hover:shadow-md transform hover:-translate-y-0.5">
                  <i className="fas fa-file-alt"></i>
                  Privacy Policy
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 hover:shadow-md transform hover:-translate-y-0.5">
                  <i className="fas fa-balance-scale"></i>
                  Terms of Service
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 hover:shadow-md transform hover:-translate-y-0.5">
                  <i className="fas fa-cookie-bite"></i>
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;