'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Employee {
  Text: string;
  Value: string;
}

interface AttendanceDay {
  date: string;
  status: string | null;
}

interface DailyAttendanceData {
  attendance_details: AttendanceDay[];
}

const DailyReports = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('ITL-KOL-1001');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState<DailyAttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const employeeCodes: Employee[] = [
    { Text: 'John Doe - ITL-KOL-1001', Value: 'ITL-KOL-1001' },
    { Text: 'Jane Smith - ITL-KOL-1002', Value: 'ITL-KOL-1002' },
    { Text: 'Robert Johnson - ITL-KOL-1003', Value: 'ITL-KOL-1003' },
    { Text: 'Emily Davis - ITL-KOL-1004', Value: 'ITL-KOL-1004' },
  ];

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  const years = [2023, 2024, 2025];

  const fetchDailyAttendance = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const details = Array.from({ length: daysInMonth }, (_, i) => ({
        date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
        status: Math.random() > 0.2 ? 'P' : 'A',
      }));
      
      setAttendanceData({ attendance_details: details });
      setIsLoading(false);
    }, 800);
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days: (AttendanceDay | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        status: attendanceData?.attendance_details.find(d => d.date === dateStr)?.status || null,
      });
    }
    
    return days;
  };

  const getAttendanceStats = () => {
    if (!attendanceData) return { present: 0, absent: 0, percentage: 0 };
    
    const present = attendanceData.attendance_details.filter(d => d.status === 'P').length;
    const total = attendanceData.attendance_details.length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, absent, percentage };
  };

  useEffect(() => {
    fetchDailyAttendance();
  }, [selectedEmployee, selectedMonth, selectedYear]);

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link 
                href="/dashboard/reports"
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <i className="fas fa-arrow-left text-lg"></i>
              </Link>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                📅 Daily Attendance
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Track daily attendance with interactive calendar view
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm mb-1">Present Days</p>
                <p className="text-3xl font-bold text-gray-900">{stats.present}</p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium text-sm mb-1">Absent Days</p>
                <p className="text-3xl font-bold text-gray-900">{stats.absent}</p>
              </div>
              <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-times-circle text-red-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm mb-1">Attendance Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.percentage}%</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-percentage text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Filters */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 lg:p-8 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2">Select Employee</label>
                <div className="relative">
                  <select 
                    className="w-full p-4 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    {employeeCodes.map((emp) => (
                      <option key={emp.Value} value={emp.Value}>
                        {emp.Text}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 text-gray-400 pointer-events-none">
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Month</label>
                  <select 
                    className="w-full p-4 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Year</label>
                  <select 
                    className="w-full p-4 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">&nbsp;</label>
                  <button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-4 rounded-xl shadow-lg transition-all duration-200 font-medium"
                    onClick={fetchDailyAttendance}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sync-alt mr-2"></i>
                        Refresh
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="p-6 lg:p-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading attendance data...</p>
                </div>
              </div>
            ) : attendanceData ? (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-2 lg:gap-4 min-w-[700px]">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div 
                      key={day} 
                      className="text-center font-bold py-4 text-gray-600 bg-gray-50 rounded-xl text-sm lg:text-base"
                    >
                      {day.slice(0, 3)}
                    </div>
                  ))}
                  
                  {generateCalendarDays().map((day, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square p-2 lg:p-4 text-center rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        day === null 
                          ? 'bg-transparent' 
                          : day.status === 'P' 
                            ? 'bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 border border-green-200' 
                            : day.status === 'A' 
                              ? 'bg-gradient-to-br from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 border border-red-200' 
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {day?.date ? (
                        <div className="h-full flex flex-col justify-center">
                          <div className="font-bold text-gray-800 text-lg lg:text-xl mb-1">
                            {new Date(day.date).getDate()}
                          </div>
                          {day.status === 'P' ? (
                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              P
                            </div>
                          ) : day.status === 'A' ? (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              A
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i className="fas fa-calendar-alt text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Data Available</h3>
                <p className="text-gray-500">Select filters and click refresh to load attendance data</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 rounded-lg"></div>
              <span className="text-gray-700 font-medium">Present</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-rose-100 border border-red-200 rounded-lg"></div>
              <span className="text-gray-700 font-medium">Absent</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-50 border border-gray-200 rounded-lg"></div>
              <span className="text-gray-700 font-medium">No Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReports;