import React, { useState } from 'react';
import { ChevronDown, Download, Calendar } from 'lucide-react';

const AttendanceTable: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState('May 2025');
  
  // Mock attendance data
  const attendanceData = [
    {
      date: '31 May 2025',
      checkIn: '09:15 AM',
      checkOut: '--:--',
      workingHours: '2h 45m (ongoing)',
      status: 'Present',
      remarks: 'Regular Working Day'
    },
    {
      date: '30 May 2025',
      checkIn: '09:03 AM',
      checkOut: '06:12 PM',
      workingHours: '9h 09m',
      status: 'Present',
      remarks: 'Regular Working Day'
    },
    {
      date: '29 May 2025',
      checkIn: '09:30 AM',
      checkOut: '06:45 PM',
      workingHours: '9h 15m',
      status: 'Present',
      remarks: 'Regular Working Day'
    },
    {
      date: '28 May 2025',
      checkIn: '09:10 AM',
      checkOut: '06:30 PM',
      workingHours: '9h 20m',
      status: 'Present',
      remarks: 'Regular Working Day'
    },
    {
      date: '27 May 2025',
      checkIn: '--:--',
      checkOut: '--:--',
      workingHours: '--:--',
      status: 'Leave',
      remarks: 'Annual Leave'
    },
    {
      date: '26 May 2025',
      checkIn: '09:00 AM',
      checkOut: '01:30 PM',
      workingHours: '4h 30m',
      status: 'Half-day',
      remarks: 'Medical Appointment'
    },
    {
      date: '25 May 2025',
      checkIn: '--:--',
      checkOut: '--:--',
      workingHours: '--:--',
      status: 'Weekend',
      remarks: 'Weekend (Sunday)'
    },
    {
      date: '24 May 2025',
      checkIn: '--:--',
      checkOut: '--:--',
      workingHours: '--:--',
      status: 'Weekend',
      remarks: 'Weekend (Saturday)'
    },
    {
      date: '23 May 2025',
      checkIn: '08:45 AM',
      checkOut: '05:50 PM',
      workingHours: '9h 05m',
      status: 'Present',
      remarks: 'Regular Working Day'
    }
  ];

  const getStatusClass = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Present': 'bg-green-100 text-green-800',
      'Absent': 'bg-red-100 text-red-800',
      'Half-day': 'bg-yellow-100 text-yellow-800',
      'Leave': 'bg-blue-100 text-blue-800',
      'Weekend': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-white/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 md:mb-0">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
          Monthly Attendance History
        </h2>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select 
              className="appearance-none bg-indigo-50 border border-indigo-100 text-indigo-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            >
              <option>May 2025</option>
              <option>April 2025</option>
              <option>March 2025</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm flex items-center w-full sm:w-auto justify-center">
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Date</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Remarks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((record, index) => (
              <tr 
                key={index} 
                className={`transition-colors hover:bg-gray-50 ${index === 0 ? 'bg-indigo-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkIn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkOut}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.workingHours}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          Showing <span className="font-medium">1</span> to <span className="font-medium">9</span> of <span className="font-medium">31</span> entries
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 rounded border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600">
            1
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center sm:justify-end">
        <button 
          onClick={() => window.location.href = '/reports/monthly'}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
        >
          View detailed reports
          <ChevronDown className="w-4 h-4 ml-1 transform rotate-270" />
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;