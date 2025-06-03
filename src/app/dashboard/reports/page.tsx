"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Type definitions
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

interface MonthlyReportEntry {
  employee_name: string;
  employee_code: string;
  daily_attendance: Record<string, string>;
  TotalWorkingDays: number;
  TotalTimeWorked: string;
}

const Reports = () => {
  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'overview'>('daily');
  const [isAdmin] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('ITL-KOL-1001');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState<DailyAttendanceData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyReportEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [overviewData, setOverviewData] = useState({
    present: 0,
    absent: 0,
    averageHours: 0
  });

  // Data sources
  const employeeCodes: Employee[] = [
    { Text: 'John Doe - ITL-KOL-1001', Value: 'ITL-KOL-1001' },
    { Text: 'Jane Smith - ITL-KOL-1002', Value: 'ITL-KOL-1002' },
    { Text: 'Robert Johnson - ITL-KOL-1003', Value: 'ITL-KOL-1003' },
    { Text: 'Emily Davis - ITL-KOL-1004', Value: 'ITL-KOL-1004' },
  ];

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString('default', { month: 'short' }),
  }));

  const years = [2023, 2024, 2025];

  // Sidebar toggle
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isSidebarOpen &&
        !target.closest('.sidebar') &&
        !target.closest('.hamburger')
      ) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Fetch daily attendance
  const fetchDailyAttendance = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const details = Array.from({ length: daysInMonth }, (_, i) => ({
        date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
        status: Math.random() > 0.2 ? 'P' : 'A',
      }));
      
      setAttendanceData({ attendance_details: details });
      setIsLoading(false);
      
      // Update overview stats
      const presentCount = details.filter(d => d.status === 'P').length;
      setOverviewData({
        present: presentCount,
        absent: daysInMonth - presentCount,
        averageHours: Math.floor(Math.random() * 8) + 5
      });
    }, 800);
  };

  // Fetch monthly report
  const fetchMonthlyReport = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const data = employeeCodes.map((emp) => {
        const dailyAttendance: Record<string, string> = {};
        
        Array.from({ length: daysInMonth }, (_, i) => {
          const date = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
          dailyAttendance[date] = Math.random() > 0.2 ? 'P' : 'A';
        });
        
        return {
          employee_name: emp.Text.split(' - ')[0],
          employee_code: emp.Value,
          daily_attendance: dailyAttendance,
          TotalWorkingDays: Math.floor(Math.random() * 15) + 15,
          TotalTimeWorked: `${Math.floor(Math.random() * 180) + 100} hrs`,
        };
      });
      
      setMonthlyData(data);
      setIsLoading(false);
    }, 1000);
  };

  // Generate calendar for daily attendance
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days: (AttendanceDay | null)[] = [];

    // Empty days for calendar alignment
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    
    // Actual month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        status: attendanceData?.attendance_details.find(d => d.date === dateStr)?.status || null,
      });
    }
    
    return days;
  };

  // Download monthly report as Excel
  const downloadExcel = () => {
    import('xlsx').then((XLSX) => {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const headers = [
        'Employee Name', 
        'Employee Code', 
        ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`), 
        'Total Working Days', 
        'Total Time Worked'
      ];
      
      const data = monthlyData.map((emp) => [
        emp.employee_name,
        emp.employee_code,
        ...Array.from({ length: daysInMonth }, (_, i) => {
          const date = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
          return emp.daily_attendance[date] || 'A';
        }),
        emp.TotalWorkingDays,
        emp.TotalTimeWorked,
      ]);
      
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');
      XLSX.writeFile(wb, `Monthly_Report_${selectedMonth}_${selectedYear}.xlsx`);
    });
  };

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'daily') fetchDailyAttendance();
    if (activeTab === 'monthly') fetchMonthlyReport();
  }, [activeTab]);

  return (
    <>
      <Head>
        <title>Attendance Reports</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Top Bar */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center shadow-lg">
          <button 
            className="hamburger text-2xl transition-transform hover:scale-110"
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-2xl font-bold flex items-center">
            <i className="fas fa-chart-line mr-3"></i>
            Attendance Reports
          </h1>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <i className="fas fa-user text-indigo-600"></i>
          </div>
        </header>

        {/* Sidebar */}
        <div 
          className={`sidebar fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out shadow-2xl z-10`}
        >
          <div className="p-5">
            <div className="flex items-center mb-8 mt-2">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">Admin Dashboard</h2>
                <p className="text-indigo-300 text-sm">admin@company.com</p>
              </div>
            </div>
            
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="flex items-center p-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  <i className="fas fa-home mr-3 text-lg"></i>
                  Dashboard
                </a>
              </li>
              <li className="bg-indigo-700 rounded-lg">
                <a href="/reports" className="flex items-center p-3">
                  <i className="fas fa-file-alt mr-3 text-lg"></i>
                  Reports
                </a>
              </li>
              <li>
                <a href="/employees" className="flex items-center p-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  <i className="fas fa-users mr-3 text-lg"></i>
                  Employees
                </a>
              </li>
              <li>
                <a href="/settings" className="flex items-center p-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  <i className="fas fa-cog mr-3 text-lg"></i>
                  Settings
                </a>
              </li>
            </ul>
            
            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-indigo-600">
              <button className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors">
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-0 transition-all duration-300 md:ml-0">
          <div className={`${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} transition-all duration-300`}>
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button 
                className={`px-6 py-3 rounded-xl flex items-center transition-all ${
                  activeTab === 'daily' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white hover:bg-gray-100 text-gray-700 shadow'
                }`}
                onClick={() => setActiveTab('daily')}
              >
                <i className="fas fa-calendar-day mr-2"></i>
                Daily Attendance
              </button>
              
              <button 
                className={`px-6 py-3 rounded-xl flex items-center transition-all ${
                  activeTab === 'monthly' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white hover:bg-gray-100 text-gray-700 shadow'
                }`}
                onClick={() => setActiveTab('monthly')}
              >
                <i className="fas fa-calendar-alt mr-2"></i>
                Monthly Report
              </button>
              
              <button 
                className={`px-6 py-3 rounded-xl flex items-center transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white hover:bg-gray-100 text-gray-700 shadow'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-chart-pie mr-2"></i>
                Overview
              </button>
            </div>

            {/* Daily Attendance */}
            {activeTab === 'daily' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <i className="fas fa-calendar-check mr-3 text-indigo-600"></i>
                    Daily Attendance Report
                  </h2>
                  <p className="text-gray-600 mt-1">View daily attendance for employees</p>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    {isAdmin && (
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-gray-700 mb-2 font-medium">Select Employee</label>
                        <div className="relative">
                          <select 
                            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                          >
                            {employeeCodes.map((emp) => (
                              <option key={emp.Value} value={emp.Value}>
                                {emp.Text}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-3 text-gray-400">
                            <i className="fas fa-chevron-down"></i>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-4 flex-wrap">
                      <div className="min-w-[150px]">
                        <label className="block text-gray-700 mb-2 font-medium">Month</label>
                        <select 
                          className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      
                      <div className="min-w-[120px]">
                        <label className="block text-gray-700 mb-2 font-medium">Year</label>
                        <select 
                          className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      
                      <div className="self-end">
                        <button 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white px-6 py-3 rounded-lg shadow transition-all flex items-center"
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
                              Refresh Data
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : attendanceData ? (
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-7 gap-3 min-w-[700px]">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <div 
                            key={day} 
                            className="text-center font-bold py-3 text-gray-600 bg-gray-50 rounded-lg"
                          >
                            {day}
                          </div>
                        ))}
                        
                        {generateCalendarDays().map((day, i) => (
                          <div 
                            key={i} 
                            className={`p-3 text-center rounded-lg shadow-sm transition-all ${
                              day === null 
                                ? 'bg-transparent' 
                                : day.status === 'P' 
                                  ? 'bg-green-100 hover:bg-green-200' 
                                  : day.status === 'A' 
                                    ? 'bg-red-100 hover:bg-red-200' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {day?.date ? (
                              <>
                                <div className="font-medium text-gray-700">
                                  {new Date(day.date).getDate()}
                                </div>
                                <div className="mt-1">
                                  {day.status === 'P' ? (
                                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                      Present
                                    </span>
                                  ) : day.status === 'A' ? (
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                      Absent
                                    </span>
                                  ) : null}
                                </div>
                              </>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-700">No attendance data</h3>
                      <p className="text-gray-500 mt-2">Select filters and click "Refresh Data" to load records</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Monthly Report */}
            {activeTab === 'monthly' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <i className="fas fa-file-excel mr-3 text-green-600"></i>
                        Monthly Attendance Report
                      </h2>
                      <p className="text-gray-600 mt-1">Detailed monthly attendance records</p>
                    </div>
                    
                    <button 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white px-6 py-3 rounded-lg shadow transition-all flex items-center mt-4 md:mt-0"
                      onClick={downloadExcel}
                      disabled={monthlyData.length === 0}
                    >
                      <i className="fas fa-file-excel mr-2"></i>
                      Export to Excel
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="min-w-[150px]">
                      <label className="block text-gray-700 mb-2 font-medium">Month</label>
                      <select 
                        className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    
                    <div className="min-w-[120px]">
                      <label className="block text-gray-700 mb-2 font-medium">Year</label>
                      <select 
                        className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    
                    <div className="self-end">
                      <button 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white px-6 py-3 rounded-lg shadow transition-all flex items-center"
                        onClick={fetchMonthlyReport}
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
                            Generate Report
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : monthlyData.length > 0 ? (
                    <div className="overflow-x-auto shadow rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Employee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Code
                            </th>
                            {Array.from(
                              { length: new Date(selectedYear, selectedMonth, 0).getDate() }, 
                              (_, i) => (
                                <th 
                                  key={i} 
                                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {i + 1}
                                </th>
                              )
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Days
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Hours
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monthlyData.map((emp, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {emp.employee_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                {emp.employee_code}
                              </td>
                              {Array.from(
                                { length: new Date(selectedYear, selectedMonth, 0).getDate() }, 
                                (_, j) => {
                                  const date = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(j + 1).padStart(2, '0')}`;
                                  const status = emp.daily_attendance[date] || 'A';
                                  
                                  return (
                                    <td 
                                      key={j} 
                                      className={`px-1 py-2 text-center ${
                                        status === 'P' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {status}
                                    </td>
                                  );
                                }
                              )}
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {emp.TotalWorkingDays}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                                {emp.TotalTimeWorked}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-700">No monthly data</h3>
                      <p className="text-gray-500 mt-2">Select filters and click "Generate Report" to load records</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attendance Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <i className="fas fa-chart-pie mr-3 text-purple-600"></i>
                    Attendance Overview
                  </h2>
                  <p className="text-gray-600 mt-1">Summary statistics and analytics</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow border border-green-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-700">Present Days</h3>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{overviewData.present}</p>
                          <div className="mt-2 flex items-center text-green-600">
                            <i className="fas fa-arrow-up mr-1"></i>
                            <span>12% increase from last month</span>
                          </div>
                        </div>
                        <div className="bg-green-500 p-3 rounded-lg">
                          <i className="fas fa-check-circle text-white text-2xl"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6 shadow border border-red-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-700">Absent Days</h3>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{overviewData.absent}</p>
                          <div className="mt-2 flex items-center text-red-600">
                            <i className="fas fa-arrow-down mr-1"></i>
                            <span>5% decrease from last month</span>
                          </div>
                        </div>
                        <div className="bg-red-500 p-3 rounded-lg">
                          <i className="fas fa-user-slash text-white text-2xl"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow border border-blue-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-700">Avg. Hours/Day</h3>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{overviewData.averageHours}</p>
                          <div className="mt-2 flex items-center text-blue-600">
                            <i className="fas fa-clock mr-1"></i>
                            <span>Company average: 8 hours</span>
                          </div>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg">
                          <i className="fas fa-clock text-white text-2xl"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 shadow-inner border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance Trends</h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                        <p className="text-gray-500">Attendance visualization chart</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Top Performers</h4>
                        <ul className="space-y-2">
                          {employeeCodes.slice(0, 3).map((emp, i) => (
                            <li key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                <div className="ml-3">
                                  <p className="font-medium">{emp.Text.split(' - ')[0]}</p>
                                  <p className="text-sm text-gray-500">{emp.Value}</p>
                                </div>
                              </div>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                98%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Needs Improvement</h4>
                        <ul className="space-y-2">
                          {employeeCodes.slice(2, 5).map((emp, i) => (
                            <li key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                <div className="ml-3">
                                  <p className="font-medium">{emp.Text.split(' - ')[0]}</p>
                                  <p className="text-sm text-gray-500">{emp.Value}</p>
                                </div>
                              </div>
                              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                76%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Reports;