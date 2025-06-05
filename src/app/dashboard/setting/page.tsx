'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/settings/Sidebar';
import SecuritySection from '@/components/settings/SecuritySection';
import NotificationsSection from '@/components/settings/NotificationsSection';
import PrivacySection from '@/components/settings/PrivacySection';
import ProfileSection from '@/components/settings/ProfileSection';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ToastContainer from '@/components/ui/ToastContainer';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface UserData {
  empcode: string;
  name: string;
  email: string;
  phone: string;
  joiningDate: string;
  designation: string;
}

export interface SettingsState {
  dataSharing: boolean;
  twoFactor: boolean;
  loginNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  securityAlerts: boolean;
  marketingUpdates: boolean;
  analyticsCookies: boolean;
  personalizedRecommendations: boolean;
}

const SettingsPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('profile');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [userData, setUserData] = useState<UserData>({
    empcode: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+91 9876543210',
    joiningDate: '2023-01-15',
    designation: 'Senior Developer'
  });

  const [settings, setSettings] = useState<SettingsState>({
    dataSharing: false,  // Added missing property
    twoFactor: false,
    loginNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: false,
    securityAlerts: true,
    marketingUpdates: false,
    analyticsCookies: false,
    personalizedRecommendations: true
  });

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toggleSetting = (settingName: keyof SettingsState) => {
    setSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
    
    const newValue = !settings[settingName];
    const formattedName = settingName.replace(/([A-Z])/g, ' $1').toLowerCase();
    showToast(`${formattedName} ${newValue ? 'enabled' : 'disabled'}`, 'info');
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'profile':
        return (
          <ProfileSection
            userData={userData}
            setUserData={setUserData}
            showLoading={showLoading}
            hideLoading={hideLoading}
            showToast={showToast}
          />
        );
      case 'security':
        return (
          <SecuritySection
            settings={settings}
            toggleSetting={toggleSetting}
            showLoading={showLoading}
            hideLoading={hideLoading}
            showToast={showToast}
          />
        );
      case 'notifications':
        return (
          <NotificationsSection
            settings={settings}
            toggleSetting={toggleSetting}
          />
        );
    case 'privacy':
  return (
    <PrivacySection
      settings={settings}
      toggleSetting={toggleSetting}
      showToast={showToast}
    />
  );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      <LoadingOverlay isVisible={isLoading} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Settings Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Manage your account preferences and security settings</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="glass-effect rounded-xl px-4 py-2">
                <span className="text-sm text-gray-600">Welcome back,</span>
                <span className="font-semibold text-gray-800 ml-1">{userData.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
          <div className="lg:w-3/4">
            {renderCurrentSection()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;