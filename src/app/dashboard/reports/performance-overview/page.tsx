'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Employee {
  id: string;
  name: string;
  code: string;
  workingHours: number;
  attendanceRate: number;
  avatar: string;
  position: string;
  department: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
  trend: 'up' | 'down' | 'stable';
  monthlyData: number[];
}

const PerformanceOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Mock data generation
  const generateEmployeeData = (): Employee[] => {
    const names = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown', 'Sarah Wilson'];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const positions = ['Senior Developer', 'Marketing Manager', 'Sales Executive', 'HR Specialist', 'Finance Analyst'];
    
    return names.map((name, index) => {
      const workingHours = Math.floor(Math.random() * 40) + 120; // 120-160 hours
      const attendanceRate = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      let performance: 'excellent' | 'good' | 'average' | 'poor';
      if (attendanceRate >= 90) performance = 'excellent';
      else if (attendanceRate >= 80) performance = 'good';
      else if (attendanceRate >= 70) performance = 'average';
      else performance = 'poor';

      return {
        id: `ITL-KOL-100${index + 1}`,
        name,
        code: `ITL-KOL-100${index + 1}`,
        workingHours,
        attendanceRate,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`,
        position: positions[index % positions.length],
        department: departments[index % departments.length],
        performance,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
        monthlyData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 30) + 70)
      };
    });
  };

  const fetchPerformanceData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setEmployees(generateEmployeeData());
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [selectedPeriod, selectedDepartment]);

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return '😊';
      case 'good': return '🙂';
      case 'average': return '😐';
      case 'poor': return '😞';
      default: return '😐';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'from-green-400 to-emerald-500';
      case 'good': return 'from-blue-400 to-cyan-500';
      case 'average': return 'from-yellow-400 to-orange-500';
      case 'poor': return 'from-red-400 to-rose-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getOverallStats = () => {
    if (employees.length === 0) return { avgHours: 0, avgAttendance: 0, topPerformer: null, improvementNeeded: 0 };
    
    const avgHours = Math.round(employees.reduce((sum, emp) => sum + emp.workingHours, 0) / employees.length);
    const avgAttendance = Math.round(employees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / employees.length);
    const topPerformer = employees.reduce((top, emp) => 
      emp.attendanceRate > (top?.attendanceRate || 0) ? emp : top, employees[0]);
    const improvementNeeded = employees.filter(emp => emp.performance === 'poor' || emp.performance === 'average').length;
    
    return { avgHours, avgAttendance, topPerformer, improvementNeeded };
  };

  const stats = getOverallStats();
  const sortedEmployees = [...employees].sort((a, b) => b.workingHours - a.workingHours);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link 
                href="/dashboard/reports"
                className="text-purple-600 hover:text-purple-800 transition-colors"
              >
                <i className="fas fa-arrow-left text-lg"></i>
              </Link>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                📊 Performance Overview
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Analytics dashboard with insights and attendance trends
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={fetchPerformanceData}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-medium"
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm mb-1">Avg Working Hours</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgHours}h</p>
              </div>
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-clock text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm mb-1">Avg Attendance</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgAttendance}%</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-percentage text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm mb-1">Top Performer</p>
                <p className="text-lg font-bold text-gray-900 truncate">{stats.topPerformer?.name || 'N/A'}</p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-trophy text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium text-sm mb-1">Need Improvement</p>
                <p className="text-3xl font-bold text-gray-900">{stats.improvementNeeded}</p>
              </div>
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <h3 className="text-lg font-bold text-gray-900">Performance Filters</h3>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <select 
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisQuarter">This Quarter</option>
                <option value="thisYear">This Year</option>
              </select>
              
              <select 
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Performance Leaderboard */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 lg:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                  🏆 Performance Leaderboard
                </h2>
                <p className="text-gray-600">
                  Employee ranking based on working hours and attendance
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <i className="fas fa-sort-amount-down"></i>
                <span>Sorted by Working Hours</span>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading performance data...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedEmployees.map((employee, index) => (
                  <div key={employee.id} className="relative">
                    {/* Rank Badge */}
                    <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
                        'bg-gradient-to-r from-indigo-400 to-indigo-500'
                      }`}>
                        {index < 3 ? (
                          <i className="fas fa-trophy text-lg"></i>
                        ) : (
                          <span className="text-sm">#{index + 1}</span>
                        )}
                      </div>
                    </div>

                    <div className={`bg-gradient-to-r ${getPerformanceColor(employee.performance)} p-1 rounded-2xl ml-8`}>
                      <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center space-x-6">
                          {/* Employee Avatar with Expression */}
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                              <img 
                                src={employee.avatar} 
                                alt={employee.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-2 -right-2 text-3xl">
                              {getPerformanceIcon(employee.performance)}
                            </div>
                            <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center ${
                              employee.trend === 'up' ? 'bg-green-500' :
                              employee.trend === 'down' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`}>
                              <i className={`fas ${
                                employee.trend === 'up' ? 'fa-arrow-up' :
                                employee.trend === 'down' ? 'fa-arrow-down' :
                                'fa-minus'
                              } text-white text-xs`}></i>
                            </div>
                          </div>

                          {/* Employee Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{employee.name}</h3>
                                <p className="text-gray-600 mb-1">{employee.position}</p>
                                <p className="text-sm text-gray-500">{employee.department} • {employee.code}</p>
                              </div>
                              
                              <div className="text-right">
                                <div className="flex items-center space-x-4 mb-2">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{employee.workingHours}h</p>
                                    <p className="text-xs text-gray-500">Working Hours</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{employee.attendanceRate}%</p>
                                    <p className="text-xs text-gray-500">Attendance</p>
                                  </div>
                                </div>
                                
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  employee.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                                  employee.performance === 'good' ? 'bg-blue-100 text-blue-800' :
                                  employee.performance === 'average' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {employee.performance.charAt(0).toUpperCase() + employee.performance.slice(1)}
                                </div>
                              </div>
                            </div>

                            {/* Progress Bars */}
                            <div className="mt-4 space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Working Hours Progress</span>
                                  <span className="font-medium">{employee.workingHours}/160h</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((employee.workingHours / 160) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Attendance Rate</span>
                                  <span className="font-medium">{employee.attendanceRate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      employee.attendanceRate >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                      employee.attendanceRate >= 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                                      employee.attendanceRate >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                                      'bg-gradient-to-r from-red-500 to-rose-600'
                                    }`}
                                    style={{ width: `${employee.attendanceRate}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Department Performance */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Department Performance</h3>
              <p className="text-gray-600">Performance breakdown by department</p>
            </div>
            <div className="p-6">
              {['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'].map((dept, index) => {
                const deptEmployees = employees.filter(emp => emp.department === dept);
                const avgPerformance = deptEmployees.length > 0 ? 
                  Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / deptEmployees.length) : 0;
                
                return (
                  <div key={dept} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{dept}</span>
                      <span className="text-sm text-gray-600">{avgPerformance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          index % 5 === 0 ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                          index % 5 === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                          index % 5 === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          index % 5 === 3 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                          'bg-gradient-to-r from-pink-500 to-rose-600'
                        }`}
                        style={{ width: `${avgPerformance}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Performance Distribution</h3>
              <p className="text-gray-600">Employee performance categories</p>
            </div>
            <div className="p-6">
              {[
                { label: 'Excellent (90%+)', count: employees.filter(emp => emp.performance === 'excellent').length, color: 'bg-green-500', emoji: '😊' },
                { label: 'Good (80-89%)', count: employees.filter(emp => emp.performance === 'good').length, color: 'bg-blue-500', emoji: '🙂' },
                { label: 'Average (70-79%)', count: employees.filter(emp => emp.performance === 'average').length, color: 'bg-yellow-500', emoji: '😐' },
                { label: 'Poor (<70%)', count: employees.filter(emp => emp.performance === 'poor').length, color: 'bg-red-500', emoji: '😞' }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between mb-4 last:mb-0">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{category.emoji}</div>
                    <span className="font-medium text-gray-900">{category.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl font-bold text-gray-900">{category.count}</span>
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 lg:p-8 border-b border-gray-200">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              📋 Performance Summary
            </h3>
            <p className="text-gray-600">
              Key insights and recommendations based on current performance data
            </p>
          </div>
          
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-green-800">🌟 Top Performers</h4>
                  <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="fas fa-trophy text-white text-sm"></i>
                  </div>
                </div>
                <div className="space-y-2">
                  {sortedEmployees.slice(0, 3).map((emp, index) => (
                    <div key={emp.id} className="flex items-center justify-between">
                      <span className="text-green-700 text-sm">{emp.name}</span>
                      <span className="font-bold text-green-800">{emp.workingHours}h</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-yellow-800">⚠️ Needs Attention</h4>
                  <div className="bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="fas fa-exclamation text-white text-sm"></i>
                  </div>
                </div>
                <div className="space-y-2">
                  {employees.filter(emp => emp.performance === 'poor' || emp.performance === 'average').slice(0, 3).map((emp) => (
                    <div key={emp.id} className="flex items-center justify-between">
                      <span className="text-yellow-700 text-sm">{emp.name}</span>
                      <span className="font-bold text-yellow-800">{emp.attendanceRate}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-blue-800">📈 Trending Up</h4>
                  <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="fas fa-arrow-up text-white text-sm"></i>
                  </div>
                </div>
                <div className="space-y-2">
                  {employees.filter(emp => emp.trend === 'up').slice(0, 3).map((emp) => (
                    <div key={emp.id} className="flex items-center justify-between">
                      <span className="text-blue-700 text-sm">{emp.name}</span>
                      <span className="font-bold text-blue-800">{emp.attendanceRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">💡 Recommendations</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mt-0.5">
                    <i className="fas fa-lightbulb text-blue-600 text-xs"></i>
                  </div>
                  <span>Consider implementing flexible working hours for employees with declining attendance rates</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center mt-0.5">
                    <i className="fas fa-star text-green-600 text-xs"></i>
                  </div>
                  <span>Recognize and reward top performers to maintain motivation and set examples</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-orange-100 w-6 h-6 rounded-full flex items-center justify-center mt-0.5">
                    <i className="fas fa-users text-orange-600 text-xs"></i>
                  </div>
                  <span>Conduct one-on-one meetings with employees needing attention to understand challenges</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverview;
