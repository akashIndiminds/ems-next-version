'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReportsProps {
  totalEmployees: number;
  averageAttendance: number;
  onGenerateReport: (reportType: string, filters?: any) => void;
}

const Reports: React.FC<ReportsProps> = ({
  totalEmployees,
  averageAttendance,
  onGenerateReport,
}) => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleGenerateReport = (reportType: string) => {
    const filters = {
      month: selectedMonth,
      year: selectedYear,
    };
    onGenerateReport(reportType, filters);
    switch (reportType) {
      case 'daily-attendance':
        router.push('/dashboard/reports/daily-reports');
        break;
      case 'monthly-reports':
        router.push('/dashboard/reports/monthly-reports');
        break;
      case 'performance-overview':
        router.push('/dashboard/reports/performance-overview');
        break;
      default:
        console.warn(`Unknown report type: ${reportType}`);
    }
  };

  const getCurrentMonthDays = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return daysInMonth;
  };

  const reportCards = [
    {
      id: 'daily-attendance',
      title: 'Daily Attendance',
      description: 'View and track daily attendance records with interactive calendar',
      icon: 'fas fa-calendar-check',
      gradient: 'from-blue-50 to-cyan-50',
      iconBg: 'from-blue-500 to-cyan-600',
      badge: `${getCurrentMonthDays()} Days This Month`,
      color: 'blue',
    },
    {
      id: 'monthly-reports',
      title: 'Monthly Reports',
      description: 'Comprehensive monthly attendance reports with Excel export',
      icon: 'fas fa-file-excel',
      gradient: 'from-emerald-50 to-green-50',
      iconBg: 'from-emerald-500 to-green-600',
      badge: `${totalEmployees} Employees Tracked`,
      color: 'emerald',
    },
    {
      id: 'performance-overview',
      title: 'Performance Overview',
      description: 'Analytics dashboard with insights and attendance trends',
      icon: 'fas fa-chart-pie',
      gradient: 'from-purple-50 to-violet-50',
      iconBg: 'from-purple-500 to-violet-600',
      badge: `${averageAttendance}% Average Attendance`,
      color: 'purple',
    },
  ];

  const getButtonColor = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-cyan-600',
      emerald: 'from-emerald-500 to-green-600',
      purple: 'from-purple-500 to-violet-600',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Report Filters</h3>
            <p className="text-gray-600 text-sm">Select date range for generating reports</p>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {reportCards.map((card) => (
          <div
            key={card.id}
            className={`bg-gradient-to-br ${card.gradient} rounded-3xl p-6 shadow-lg border border-white/20 card-hover transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className={`bg-gradient-to-r ${card.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <i className={`${card.icon} text-white text-2xl`}></i>
              </div>
              <div className="text-right">
                <div className="bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                  {card.badge}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{card.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleGenerateReport(card.id)}
                className={`bg-gradient-to-r ${getButtonColor(
                  card.color,
                )} text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all text-sm font-medium transform hover:scale-105`}
              >
                View Details <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">This Month's Reports</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-green-600 text-sm font-medium">+3 from last month</p>
            </div>
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <i className="fas fa-file-alt text-lg"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Export Downloads</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
              <p className="text-green-600 text-sm font-medium">+8 this week</p>
            </div>
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <i className="fas fa-download text-lg"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Data Coverage</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
              <p className="text-green-600 text-sm font-medium">Excellent quality</p>
            </div>
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <i className="fas fa-database text-lg"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports Generated</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fas fa-file-excel text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Monthly Attendance Report - March 2024</p>
                  <p className="text-sm text-gray-500">Generated 2 hours ago</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <i className="fas fa-download mr-1"></i>Download
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="fas fa-chart-bar text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Performance Analytics - Q1 2024</p>
                  <p className="text-sm text-gray-500">Generated 1 day ago</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <i className="fas fa-download mr-1"></i>Download
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <i className="fas fa-calendar text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Daily Attendance Summary - Week 12</p>
                  <p className="text-sm text-gray-500">Generated 3 days ago</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                <i className="fas fa-download mr-1"></i>Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;