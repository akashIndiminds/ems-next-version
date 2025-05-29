import React from 'react';
import { User, Bell, Calendar, Settings } from 'lucide-react';

interface WelcomeCardProps {
  employeeName: string;
  employeeCode: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ employeeName, employeeCode }) => {
  const currentTime = new Date().getHours();
  
  let greeting = "Welcome";
  if (currentTime < 12) greeting = "Good morning";
  else if (currentTime < 18) greeting = "Good afternoon";
  else greeting = "Good evening";
  
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg mb-8 border border-indigo-100">
      <div className="absolute -right-10 -top-24 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full filter blur-2xl"></div>
      <div className="absolute -left-10 -bottom-24 w-64 h-64 bg-gradient-to-tr from-blue-500/20 to-sky-500/20 rounded-full filter blur-xl"></div>
      
      <div className="relative p-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center space-x-5">
          <div className="hidden md:block">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {employeeName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 mr-3">{greeting}, {employeeName}!</h1>
              <span className="hidden md:inline-flex bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
                Active
              </span>
            </div>
            <div className="mt-1 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Employee ID:</span> <span className="text-indigo-600 font-medium">{employeeCode}</span>
              </p>
              <p className="text-gray-600 hidden md:block">
                <span className="font-medium text-gray-800">Role:</span> <span className="text-indigo-600 font-medium">Full Stack Developer</span>
              </p>
              <p className="text-gray-600 hidden lg:block">
                <span className="font-medium text-gray-800">Department:</span> <span className="text-indigo-600 font-medium">Technology</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex mt-4 md:mt-0">
          <div className="relative hidden md:block">
            <button className="mr-2 p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          
          <div className="flex items-center bg-indigo-50 px-4 py-2 rounded-lg">
            <Calendar className="h-5 w-5 text-indigo-700 mr-2" />
            <span className="text-sm font-medium text-gray-800">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
