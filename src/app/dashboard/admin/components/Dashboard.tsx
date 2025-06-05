'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { DashboardStats, Activity } from '../types';

Chart.register(...registerables);

interface DashboardProps {
  stats: DashboardStats;
  activities: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, activities }) => {
  const attendanceChartRef = useRef<HTMLCanvasElement | null>(null);
  const leaveChartRef = useRef<HTMLCanvasElement | null>(null);
  const attendanceChartInstanceRef = useRef<Chart | null>(null); // Store attendance chart instance
  const leaveChartInstanceRef = useRef<Chart | null>(null); // Store leave chart instance

  useEffect(() => {
    // Attendance Chart
    if (attendanceChartRef.current) {
      const attendanceCtx = attendanceChartRef.current.getContext('2d');
      if (attendanceCtx) {
        // Destroy existing attendance chart instance if it exists
        if (attendanceChartInstanceRef.current) {
          attendanceChartInstanceRef.current.destroy();
          attendanceChartInstanceRef.current = null;
        }

        // Create new attendance chart instance
        attendanceChartInstanceRef.current = new Chart(attendanceCtx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                label: 'Present',
                data: [22, 21, 23, 20, 24, 15, 8],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                },
              },
              x: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                },
              },
            },
          },
        });
      }
    }

    // Leave Chart
    if (leaveChartRef.current) {
      const leaveCtx = leaveChartRef.current.getContext('2d');
      if (leaveCtx) {
        // Destroy existing leave chart instance if it exists
        if (leaveChartInstanceRef.current) {
          leaveChartInstanceRef.current.destroy();
          leaveChartInstanceRef.current = null;
        }

        // Create new leave chart instance
        leaveChartInstanceRef.current = new Chart(leaveCtx, {
          type: 'doughnut',
          data: {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [
              {
                data: [12, 5, 2],
                backgroundColor: [
                  'rgba(34, 197, 94, 0.8)',
                  'rgba(251, 191, 36, 0.8)',
                  'rgba(239, 68, 68, 0.8)',
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          },
        });
      }
    }

    // Cleanup both charts on unmount
    return () => {
      if (attendanceChartInstanceRef.current) {
        attendanceChartInstanceRef.current.destroy();
        attendanceChartInstanceRef.current = null;
      }
      if (leaveChartInstanceRef.current) {
        leaveChartInstanceRef.current.destroy();
        leaveChartInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only on mount/unmount

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <i className="fas fa-users text-lg"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Present Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.presentToday}</p>
            </div>
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-check text-lg"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingRequests}</p>
            </div>
            <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <i className="fas fa-clock text-lg"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Attendance Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.attendanceRate}%</p>
            </div>
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <i className="fas fa-chart-pie text-lg"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Attendance</h3>
          <div className="h-64">
            <canvas ref={attendanceChartRef} id="attendanceChart" width="400" height="200"></canvas>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Leave Requests</h3>
          <div className="h-64">
            <canvas ref={leaveChartRef} id="leaveChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${activity.color} flex items-center justify-center`}>
                  <i className={`${activity.icon} text-sm`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <div className="text-sm text-gray-400">{activity.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;