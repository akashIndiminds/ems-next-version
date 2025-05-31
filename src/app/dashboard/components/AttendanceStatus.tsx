import React from 'react';
import {
  Clock,
  LogOut,
  Timer,
  ClipboardCheck
} from 'lucide-react';

interface AttendanceDetails {
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string | null;
  remarks: string | null;
  workingHours?: string | null;
}

interface AttendanceStatusProps {
  attendanceDetails: AttendanceDetails;
}

const AttendanceStatus: React.FC<AttendanceStatusProps> = ({ attendanceDetails }) => {
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-full shadow-md mb-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          Today's Attendance
        </h2>
        <div className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center">
          <i className="fas fa-calendar-alt mr-1"></i>
          <span>{formatDate()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-1 bg-green-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Check In</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {attendanceDetails.checkInTime || '-- : --'}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            {attendanceDetails.checkInTime ? (
              <>
                <i className="fas fa-check-circle mr-1"></i>
                Marked on time
              </>
            ) : (
              <>
                <i className="fas fa-clock mr-1"></i>
                Not marked yet
              </>
            )}
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-1 bg-orange-500 opacity-50"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Check Out</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {attendanceDetails.checkOutTime || '-- : --'}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <LogOut className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">
            {attendanceDetails.checkOutTime ? (
              <>
                <i className="fas fa-check-circle mr-1"></i>
                Marked at {attendanceDetails.checkOutTime}
              </>
            ) : (
              <>
                <i className="fas fa-clock mr-1"></i>
                Not marked yet
              </>
            )}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-1 bg-blue-500 opacity-50"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Working Hours</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {attendanceDetails.workingHours || '0h 0m'}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Timer className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            <i className="fas fa-sync-alt mr-1"></i>
            {attendanceDetails.checkInTime && !attendanceDetails.checkOutTime 
              ? 'Updating in real-time'
              : 'Final hours for today'}
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-1 bg-indigo-500 opacity-50"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700">Status</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">
                {attendanceDetails.status || 'Pending'}
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-indigo-600 mt-2">
            <i className="fas fa-info-circle mr-1"></i>
            {attendanceDetails.remarks || 'Regular day'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatus;