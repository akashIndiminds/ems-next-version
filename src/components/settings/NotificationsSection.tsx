import React from 'react';
import { SettingsState } from '@/app/dashboard/setting/page';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

interface NotificationsSectionProps {
  settings: SettingsState;
  toggleSetting: (settingName: keyof SettingsState) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  settings,
  toggleSetting
}) => {
  return (
    <div className="settings-section">
      <div className="floating-card bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-bell text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notification Preferences</h2>
            <p className="text-gray-600">Choose how you want to receive updates and alerts</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-envelope text-blue-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.emailNotifications}
              onToggle={() => toggleSetting('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-sms text-green-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.smsNotifications}
              onToggle={() => toggleSetting('smsNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-bell text-purple-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive push notifications in browser</p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.pushNotifications}
              onToggle={() => toggleSetting('pushNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-orange-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Weekly Reports</h4>
                <p className="text-sm text-gray-600">Receive weekly summary reports</p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.weeklyReports}
              onToggle={() => toggleSetting('weeklyReports')}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Security Alerts</h4>
                <p className="text-sm text-gray-600">Get notified about security events</p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.securityAlerts}
              onToggle={() => toggleSetting('securityAlerts')}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-bullhorn text-indigo-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Marketing Updates</h4>
                <p className="text-sm text-gray-600">Receive updates about new features and offers</p>
              </div>
            </div>
            <ToggleSwitch
              isActive={settings.marketingUpdates}
              onToggle={() => toggleSetting('marketingUpdates')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;