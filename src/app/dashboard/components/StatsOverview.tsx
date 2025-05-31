import React from 'react';
import { 
  Calendar, 
  Clock, 
  Umbrella, 
  Timer 
} from 'lucide-react';

const StatsOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {/* Present Days Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Present Days</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">18</h3>
            <div className="flex items-center mt-2">
              <span className="text-green-500 text-sm font-medium">+2.5%</span>
              <span className="text-gray-500 text-xs ml-1">vs last month</span>
            </div>
          </div>
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* On-time Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">On-time Rate</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">96%</h3>
            <div className="flex items-center mt-2">
              <span className="text-green-500 text-sm font-medium">+4.2%</span>
              <span className="text-gray-500 text-xs ml-1">vs last month</span>
            </div>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
          </div>
        </div>
      </div>

      {/* Leave Balance Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Leave Balance</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">12</h3>
            <div className="flex items-center mt-2">
              <span className="text-gray-500 text-sm font-medium">
                <i className="fas fa-info-circle mr-1 text-blue-500"></i>
                8 Annual, 4 Sick
              </span>
            </div>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Umbrella className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {/* Work Hours Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-md border border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Monthly Hours</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">158h</h3>
            <div className="flex items-center mt-2">
              <span className="text-blue-500 text-sm font-medium">98.7%</span>
              <span className="text-gray-500 text-xs ml-1">of target</span>
            </div>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Timer className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;