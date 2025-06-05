'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Reports = () => {
  const pathname = usePathname();
  
  const reportCards = [
    {
      id: 'daily',
      title: 'Daily Attendance',
      description: 'View and track daily attendance records with interactive calendar',
      icon: 'fas fa-calendar-check',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      href: '/dashboard/reports/daily-reports',
      stats: '24 Days This Month'
    },
    {
      id: 'monthly',
      title: 'Monthly Reports',
      description: 'Comprehensive monthly attendance reports with Excel export',
      icon: 'fas fa-file-excel',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50',
      href: '/dashboard/reports/monthly-reports',
      stats: '4 Employees Tracked'
    },
    {
      id: 'overview',
      title: 'Performance Overview',
      description: 'Analytics dashboard with insights and attendance trends',
      icon: 'fas fa-chart-pie',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      href: '/dashboard/reports/performance-overview',
      stats: '89% Average Attendance'
    }
  ];

  const quickStats = [
    {
      label: 'Total Employees',
      value: '24',
      icon: 'fas fa-users',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Present Today',
      value: '22',
      icon: 'fas fa-user-check',
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'Absent Today',
      value: '2',
      icon: 'fas fa-user-times',
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      label: 'On Leave',
      value: '3',
      icon: 'fas fa-calendar-minus',
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8">
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                📊 Reports Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Comprehensive attendance tracking and analytics
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <i className="fas fa-calendar mr-2"></i>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <i className={`${stat.icon} text-lg`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {reportCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group block"
            >
              <div className={`bg-gradient-to-br ${card.bgColor} rounded-3xl p-6 lg:p-8 shadow-lg border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`bg-gradient-to-r ${card.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${card.icon} text-white text-2xl`}></i>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                      {card.stats}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="mb-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span className="text-sm font-medium">View Details</span>
                    <i className="fas fa-arrow-right ml-2 text-sm group-hover:translate-x-1 transition-transform"></i>
                  </div>
                  <div className="w-2 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full group-hover:from-gray-400 group-hover:to-gray-500 transition-colors"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 lg:px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                    Recent Activity
                  </h2>
                  <p className="text-gray-600">
                    Latest attendance updates and system activities
                  </p>
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-shadow text-sm font-medium">
                  View All
                </button>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="space-y-4">
                {[
                  {
                    action: 'Daily report generated',
                    user: 'System',
                    time: '2 minutes ago',
                    icon: 'fas fa-file-alt',
                    color: 'text-blue-600 bg-blue-100'
                  },
                  {
                    action: 'Monthly report exported',
                    user: 'Admin',
                    time: '1 hour ago',
                    icon: 'fas fa-download',
                    color: 'text-green-600 bg-green-100'
                  },
                  {
                    action: 'Employee attendance updated',
                    user: 'John Doe',
                    time: '3 hours ago',
                    icon: 'fas fa-user-check',
                    color: 'text-purple-600 bg-purple-100'
                  }
                ].map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl ${activity.color} flex items-center justify-center`}>
                      <i className={`${activity.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">by {activity.user}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;