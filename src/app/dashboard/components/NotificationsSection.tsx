import React from 'react';
import { 
  Bell, 
  CheckCircle, 
  ThumbsUp, 
  Mail, 
  Award 
} from 'lucide-react';

const NotificationsSection: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-indigo-600" />
          Recent Notifications
        </h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          Mark All as Read
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start p-4 rounded-lg bg-indigo-50 border-l-4 border-indigo-500">
          <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-indigo-900">Attendance Confirmed</h3>
              <span className="text-xs text-indigo-600">Just now</span>
            </div>
            <p className="text-sm text-indigo-800 mt-1">Your check-in has been recorded at 9:15 AM.</p>
          </div>
        </div>

        <div className="flex items-start p-4 rounded-lg bg-white border-l-4 border-green-500">
          <div className="flex-shrink-0 bg-green-100 rounded-lg p-2">
            <ThumbsUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Leave Approved</h3>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">Your leave request for Jun 10-11 has been approved.</p>
          </div>
        </div>

        <div className="flex items-start p-4 rounded-lg bg-white border-l-4 border-blue-500">
          <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">New Announcement</h3>
              <span className="text-xs text-gray-500">Yesterday</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">Team meeting scheduled for tomorrow at 11:00 AM.</p>
          </div>
        </div>

        <div className="flex items-start p-4 rounded-lg bg-white border-l-4 border-purple-500">
          <div className="flex-shrink-0 bg-purple-100 rounded-lg p-2">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Achievement Unlocked</h3>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">Congratulations! You've maintained perfect attendance for 2 months.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;