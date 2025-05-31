import React from 'react';
import { User } from 'lucide-react';

interface EmployeeDetails {
  employee_code?: string;
  employee_full_name?: string;
  designation?: string;
  department?: string;
}

interface WelcomeSectionProps {
  employeeDetails: EmployeeDetails | null;
  employeeCode: string | null;
  lastCheckIn: string | null;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  employeeDetails,
  employeeCode,
  lastCheckIn
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-white/20 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-4 rounded-xl">
            <User className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
              Welcome back, {employeeDetails?.employee_full_name || 'Employee'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Employee Code: <span className="font-semibold text-indigo-600">{employeeCode}</span>
            </p>
            <div className="flex flex-wrap items-center mt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-500 ml-2">Active Status</span>
              {employeeDetails?.designation && (
                <>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-500">{employeeDetails.designation}</span>
                </>
              )}
              {employeeDetails?.department && (
                <>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-500">{employeeDetails.department}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start lg:items-end w-full lg:w-auto">
          <div className="w-full lg:text-right">
            <button className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center lg:justify-start">
              <i className="fas fa-clock mr-2"></i>
              Mark Attendance
            </button>
          </div>
          {lastCheckIn && (
            <div className="mt-2 bg-green-100 rounded-lg px-3 py-1 text-sm text-green-800 flex items-center">
              <i className="fas fa-check-circle mr-1"></i>
              Last checked in: {lastCheckIn}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;