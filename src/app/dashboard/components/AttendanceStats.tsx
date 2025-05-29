import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText 
} from 'lucide-react';

interface AttendanceDetailsProps {
  attendanceDetails: {
    checkInTime: string | null;
    checkOutTime: string | null;
    status: string | null;
    remarks: string | null;
  };
}

const AttendanceStats: React.FC<AttendanceDetailsProps> = ({ attendanceDetails }) => {
  const getStatusClass = (status: string | null): string => {
    if (!status) return '';
    const statusMap: { [key: string]: string } = {
      'Present': 'bg-green-100 text-green-800 border-green-200',
      'Absent': 'bg-red-100 text-red-800 border-red-200',
      'Half-day': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Leave': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pending': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'Absent':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'Half-day':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'Leave':
        return <Clock className="w-6 h-6 text-blue-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-indigo-100 mb-8 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          Today's Attendance
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
        <div className="p-6 border-r border-b md:border-b-0 border-gray-100">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">CHECK IN</h3>
              <span className="p-1.5 rounded-md bg-green-100">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </span>
            </div>
            
            <div className="flex-grow">
              <p className="text-3xl font-bold text-gray-900">
                {attendanceDetails.checkInTime || '-'}
              </p>
              {attendanceDetails.checkInTime && (
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  On Time
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 lg:border-r border-b md:border-b-0 border-gray-100">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">CHECK OUT</h3>
              <span className="p-1.5 rounded-md bg-orange-100">
                <XCircle className="w-4 h-4 text-orange-600" />
              </span>
            </div>
            
            <div className="flex-grow">
              <p className="text-3xl font-bold text-gray-900">
                {attendanceDetails.checkOutTime || '-'}
              </p>
              {attendanceDetails.checkOutTime && (
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Regular
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-r border-gray-100">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">STATUS</h3>
              <span className="p-1.5 rounded-md bg-indigo-100">
                {getStatusIcon(attendanceDetails.status)}
              </span>
            </div>
            
            <div className="flex-grow">
              <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getStatusClass(attendanceDetails.status)}`}>
                {attendanceDetails.status || 'Pending'}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Updated at 09:45 AM
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">REMARKS</h3>
              <span className="p-1.5 rounded-md bg-gray-100">
                <FileText className="w-4 h-4 text-gray-600" />
              </span>
            </div>
            
            <div className="flex-grow">
              <p className="text-gray-900 font-medium">
                {attendanceDetails.remarks || 'No remarks'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {attendanceDetails.remarks ? 'Added by supervisor' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-indigo-800">Working hours today: <span className="font-semibold">8h 25m</span></p>
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default AttendanceStats;
