import React, { useState } from 'react';
import { UserData } from '@/app/dashboard/setting/page';
import ToggleSwitch from '../ui/ToggleSwitch';

interface ProfileSectionProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  showLoading: () => void;
  hideLoading: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  userData,
  setUserData,
  showLoading,
  hideLoading,
  showToast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  const toggleEditMode = () => {
    if (isEditing) {
      setFormData(userData); // Reset form data when canceling
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfile = () => {
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
      hideLoading();
      setUserData(formData);
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    }, 2000);
  };

  return (
    <div className="settings-section">
      <div className="floating-card bg-white rounded-2xl p-8 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-circle text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
              <p className="text-gray-600">Update your personal details and contact information</p>
            </div>
          </div>
          
          <button
            onClick={toggleEditMode}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'}`}></i>
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fas fa-id-badge mr-2 text-indigo-600"></i>
                Employee Code
              </label>
              <input
                type="text"
                value={formData.empcode}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-mono"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fas fa-user mr-2 text-indigo-600"></i>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                disabled={!isEditing}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl transition-all ${
                  isEditing
                    ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fas fa-envelope mr-2 text-indigo-600"></i>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled={!isEditing}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl transition-all ${
                  isEditing
                    ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fas fa-phone mr-2 text-indigo-600"></i>
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                disabled={!isEditing}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl transition-all ${
                  isEditing
                    ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fas fa-calendar-alt mr-2 text-indigo-600"></i>
                Joining Date
              </label>
              <input
                type="date"
                value={formData.joiningDate}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fas fa-briefcase mr-2 text-indigo-600"></i>
                Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-8">
            <div className="flex gap-4 justify-end">
              <button
                onClick={toggleEditMode}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
              >
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .floating-card {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        
        .floating-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default ProfileSection;