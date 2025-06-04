'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Employee {
  Text: string;
  Value: string;
}

interface MonthlyReportEntry {
  employee_name: string;
  employee_code: string;
  daily_attendance: Record<string, string>;
  TotalWorkingDays: number;
  TotalTimeWorked: string;
  PresentDays: number;
  AbsentDays: number;
  AttendancePercentage: number;
}

const MonthlyReports = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState<MonthlyReportEntry[]>([]);
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

  const fetchMonthlyReport = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const data = employeeCodes.map((emp) => {
        const dailyAttendance: Record<string, string> = {};
        let presentCount = 0;
        
        Array.from({ length: daysInMonth }, (_, i) => {
          const date = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
          const status = Math.random() > 0.2 ? 'P' : 'A';
          dailyAttendance[date] = status;
          if (status === 'P') presentCount++;
        });

        const absentCount = daysInMonth - presentCount;
        const percentage = Math.round((presentCount / daysInMonth) * 100);

        return {
          employee_name: emp.Text.split(' - ')[0],
          employee_code: emp.Value,
          daily_attendance: dailyAttendance,
          TotalWorkingDays: daysInMonth,
          TotalTimeWorked: `${Math.floor(Math.random() * 180) + 100} hrs`,
          PresentDays: presentCount,
          AbsentDays: absentCount,
          AttendancePercentage: percentage,
        };
      });
      setMonthlyData(data);
      setIsLoading(false);
    }, 1000);
  };

  const downloadExcel = () => {
    // Mock Excel download functionality
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Monthly_Report_${selectedMonth}_${selectedYear}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateCSVContent = () => {
    if (monthlyData.length === 0) return '';
    
    const headers = ['Employee Name', 'Employee Code', 'Present Days', 'Absent Days', 'Total Working Days', 'Attendance %', 'Total Time Worked'];
    const rows = monthlyData.map(emp => [
      emp.employee_name,
      emp.employee_code,
      emp.PresentDays,
      emp.AbsentDays,
      emp.TotalWorkingDays,
      `${emp.AttendancePercentage}%`,
      emp.TotalTimeWorked
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };

  const getOverallStats = () => {
    if (monthlyData.length === 0) return { totalEmployees: 0, avgAttendance: 0, totalPresent: 0, totalAbsent: 0 };
    
    const totalEmployees = monthlyData.length;
    const avgAttendance = Math.round(
      monthlyData.reduce((sum, emp) => sum + emp.AttendancePercentage, 0) / totalEmployees
    );
    const totalPresent = monthlyData.reduce((sum, emp) => sum + emp.PresentDays, 0);
    const totalAbsent = monthlyData.reduce((sum, emp) => sum + emp.AbsentDays, 0);
    
    return { totalEmployees, avgAttendance, totalPresent, totalAbsent };
  };

  useEffect(() => {
    fetchMonthlyReport();
  }, [selectedMonth, selectedYear]);

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link 
                href="/dashboard/reports"
                className="text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                <i className="fas fa-arrow-left text-lg"></i>
              </Link>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                📊 Monthly Reports
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Comprehensive monthly attendance reports with Excel export
            </p>
          </div>
          <button
            onClick={downloadExcel}
            disabled={isLoading || monthlyData.length === 0}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-medium"
          >
            <i className="fas fa-file-excel mr-2"></i>
            Export Excel
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm mb-1">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-users text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 font-medium text-sm mb-1">Avg Attendance</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgAttendance}%</p>
              </div>
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-emerald-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm mb-1">Total Present</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPresent}</p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium text-sm mb-1">Total Absent</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAbsent}</p>
              </div>
              <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-times-circle text-red-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Filters */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 lg:p-8 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Month</label>
                  <select 
                    className="w-full p-4 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full p-4 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-4 rounded-xl shadow-lg transition-all duration-200 font-medium"
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
          </div>
          
          {/* Report Table */}
          <div className="p-6 lg:p-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating monthly report...</p>
                </div>
              </div>
            ) : monthlyData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-bold text-gray-900">Employee</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Code</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Present</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Absent</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Working Days</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Attendance %</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Time Worked</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((employee, index) => (
                      <tr key={employee.employee_code} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              {employee.employee_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{employee.employee_name}</p>
                              <p className="text-sm text-gray-500">{employee.employee_code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-6">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {employee.employee_code}
                          </span>
                        </td>
                        <td className="text-center py-4 px-6">
                          <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full font-bold">
                            {employee.PresentDays}
                          </span>
                        </td>
                        <td className="text-center py-4 px-6">
                          <span className="bg-red-100 text-red-700 px-3 py-2 rounded-full font-bold">
                            {employee.AbsentDays}
                          </span>
                        </td>
                        <td className="text-center py-4 px-6 font-medium text-gray-900">
                          {employee.TotalWorkingDays}
                        </td>
                        <td className="text-center py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  employee.AttendancePercentage >= 80 
                                    ? 'bg-green-500' 
                                    : employee.AttendancePercentage >= 60 
                                    ? 'bg-yellow-500' 
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${employee.AttendancePercentage}%` }}
                              ></div>
                            </div>
                            <span className={`font-bold text-sm ${
                              employee.AttendancePercentage >= 80 
                                ? 'text-green-600' 
                                : employee.AttendancePercentage >= 60 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                            }`}>
                              {employee.AttendancePercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-6 font-medium text-gray-700">
                          {employee.TotalTimeWorked}
                        </td>
                        <td className="text-center py-4 px-6">
                          <Link
                            href={`/dashboard/reports/daily-reports?employee=${employee.employee_code}&month=${selectedMonth}&year=${selectedYear}`}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                          >
                            <i className="fas fa-eye mr-1"></i>
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i className="fas fa-file-alt text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Data Available</h3>
                <p className="text-gray-500">Select month and year, then click "Generate Report" to load data</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        {monthlyData.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 lg:p-8 border-b border-gray-200">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                Performance Summary
              </h3>
              <p className="text-gray-600">
                Attendance performance breakdown for {months.find(m => m.value === selectedMonth)?.name} {selectedYear}
              </p>
            </div>
            
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-green-800">Excellent (80%+)</h4>
                    <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                      <i className="fas fa-star text-white text-sm"></i>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-700 mb-2">
                    {monthlyData.filter(emp => emp.AttendancePercentage >= 80).length}
                  </p>
                  <p className="text-green-600 text-sm">employees with excellent attendance</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-yellow-800">Good (60-79%)</h4>
                    <div className="bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center">
                      <i className="fas fa-exclamation text-white text-sm"></i>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-yellow-700 mb-2">
                    {monthlyData.filter(emp => emp.AttendancePercentage >= 60 && emp.AttendancePercentage < 80).length}
                  </p>
                  <p className="text-yellow-600 text-sm">employees need improvement</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-red-800">Poor (&lt;60%)</h4>
                    <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
                      <i className="fas fa-times text-white text-sm"></i>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-red-700 mb-2">
                    {monthlyData.filter(emp => emp.AttendancePercentage < 60).length}
                  </p>
                  <p className="text-red-600 text-sm">employees need attention</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReports;