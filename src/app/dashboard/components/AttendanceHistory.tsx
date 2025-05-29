import React, { useState } from 'react';
import { Calendar, ChevronDown, Download, Search } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  dayOfWeek: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: string;
}

interface AttendanceHistoryProps {
  employeeCode: string;
}

const mockData: AttendanceRecord[] = [
  { date: '2023-05-01', dayOfWeek: 'Monday', checkIn: '09:00 AM', checkOut: '06:00 PM', duration: '8h', status: 'Present' },
  { date: '2023-05-02', dayOfWeek: 'Tuesday', checkIn: '09:15 AM', checkOut: '06:30 PM', duration: '8h 15m', status: 'Present' },
  { date: '2023-05-03', dayOfWeek: 'Wednesday', checkIn: '09:05 AM', checkOut: '06:10 PM', duration: '8h 05m', status: 'Present' },
  { date: '2023-05-04', dayOfWeek: 'Thursday', checkIn: '08:45 AM', checkOut: '05:50 PM', duration: '8h 05m', status: 'Present' },
  { date: '2023-05-05', dayOfWeek: 'Friday', checkIn: '09:30 AM', checkOut: '06:45 PM', duration: '8h 15m', status: 'Present' },
  { date: '2023-05-08', dayOfWeek: 'Monday', checkIn: '09:00 AM', checkOut: '06:15 PM', duration: '8h 15m', status: 'Present' },
  { date: '2023-05-09', dayOfWeek: 'Tuesday', checkIn: '', checkOut: '', duration: '0h', status: 'Absent' },
  { date: '2023-05-10', dayOfWeek: 'Wednesday', checkIn: '09:00 AM', checkOut: '01:30 PM', duration: '4h 30m', status: 'Half-day' },
  { date: '2023-05-11', dayOfWeek: 'Thursday', checkIn: '', checkOut: '', duration: '0h', status: 'Leave' },
  { date: '2023-05-12', dayOfWeek: 'Friday', checkIn: '08:55 AM', checkOut: '06:05 PM', duration: '8h 10m', status: 'Present' },
];

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ employeeCode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('May 2023');
  const [filteredStatus, setFilteredStatus] = useState('All');

  // Filter and sort logic
  let attendanceData = [...mockData];

  if (searchTerm) {
    attendanceData = attendanceData.filter(record =>
      record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.checkIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.checkOut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.dayOfWeek.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filteredStatus !== 'All') {
    attendanceData = attendanceData.filter(record => record.status === filteredStatus);
  }

  if (sortConfig !== null) {
    attendanceData.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof AttendanceRecord];
      const bValue = b[sortConfig.key as keyof AttendanceRecord];
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Half-day':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Leave':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleExport = () => {
    console.log('Exporting attendance data...');
    // Add CSV export logic here if needed
  };

  return (
    <div className="bg-white rounded-2xl shadow-md custom-shadow border border-indigo-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Monthly Attendance History
          </h2>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-indigo-50 border border-indigo-100 text-indigo-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option>May 2023</option>
              <option>April 2023</option>
              <option>March 2023</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-600 pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 text-sm flex items-center transition-all"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter by status:</span>
            <select
              value={filteredStatus}
              onChange={(e) => setFilteredStatus(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Half-day</option>
              <option>Leave</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer rounded-tl-lg"
                  onClick={() => requestSort('date')}
                >
                  Date
                  {sortConfig?.key === 'date' && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('dayOfWeek')}
                >
                  Day
                  {sortConfig?.key === 'dayOfWeek' && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('checkIn')}
                >
                  Check In
                  {sortConfig?.key === 'checkIn' && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('checkOut')}
                >
                  Check Out
                  {sortConfig?.key === 'checkOut' && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('duration')}
                >
                  Working Hours
                  {sortConfig?.key === 'duration' && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer rounded-tr-lg"
                  onClick={() => requestSort('status')}
                >
                  Status
                  {sortConfig?.key === 'status' && (
                    <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((record, index) => (
                <tr key={index} className="table-row-hover">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.dayOfWeek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkIn || '--:--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkOut || '--:--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;