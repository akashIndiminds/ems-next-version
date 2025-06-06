'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Announcements from './components/Announcements';
import RegisterEmployee from './components/RegisterEmployee';
import SetAttendance from './components/SetAttendance';
import LeaveManagement from './components/LeaveManagement';
import Reports from './components/Reports';
import { Employee, DashboardStats, Activity, AttendanceRecord, LeaveRequest, AttendanceStatus, LeaveType, LeaveStatus } from './types';

type TabType = 'dashboard' | 'announcements' | 'register' | 'attendance' | 'leave' | 'reports';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sample data - In real app, this would come from API/database
  const [employees] = useState<Employee[]>([
    {
      id: 'EMP001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1234567890',
      joiningDate: '2024-01-15'
    },
    {
      id: 'EMP002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1234567891',
      joiningDate: '2024-02-01'
    },
    {
      id: 'EMP003',
      firstName: 'Mike',
      lastName: 'Davis',
      email: 'mike.davis@company.com',
      phone: '+1234567892',
      joiningDate: '2024-03-10'
    }
  ]);

  const [dashboardStats] = useState<DashboardStats>({
    totalEmployees: 24,
    presentToday: 22,
    pendingRequests: 5,
    attendanceRate: 89
  });

  const [recentActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'registration',
      title: 'New employee registered',
      description: 'John Smith joined the team',
      timestamp: '2 hours ago',
      icon: 'fas fa-user-plus',
      color: 'blue'
    },
    {
      id: '2',
      type: 'attendance',
      title: 'Attendance updated',
      description: 'Bulk attendance for March processed',
      timestamp: '4 hours ago',
      icon: 'fas fa-calendar-check',
      color: 'green'
    },
    {
      id: '3',
      type: 'announcement',
      title: 'New announcement posted',
      description: 'Company policy update',
      timestamp: '1 day ago',
      icon: 'fas fa-bullhorn',
      color: 'purple'
    }
  ]);

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      leaveType: LeaveType.SICK,
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      reason: 'Medical appointment and recovery',
      status: LeaveStatus.PENDING,
      createdAt: '2024-06-05'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      leaveType: LeaveType.PERSONAL,
      startDate: '2024-06-15',
      endDate: '2024-06-17',
      reason: 'Family function attendance',
      status: LeaveStatus.PENDING,
      createdAt: '2024-06-04'
    }
  ]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'announcements', name: 'Announcements', icon: 'fas fa-bullhorn' },
    { id: 'register', name: 'Register Employee', icon: 'fas fa-user-plus' },
    { id: 'attendance', name: 'Set Attendance', icon: 'fas fa-calendar-check' },
    { id: 'leave', name: 'Leave Management', icon: 'fas fa-calendar-minus' },
    { id: 'reports', name: 'Reports', icon: 'fas fa-chart-bar' }
  ];

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

 const handleSubmitAnnouncement = (employeeId: string | null, text: string) => {
  console.log('Submitting announcement:', { employeeId, text });
  showMessage('Announcement posted successfully!');
};
  const handleRegisterEmployee = (employeeData: Omit<Employee, 'id'>) => {
    // Handle employee registration
    console.log('Registering employee:', employeeData);
    showMessage('Employee registered successfully!');
  };

  const handleSetAttendance = (attendanceData: Omit<AttendanceRecord, 'id'>) => {
    // Handle attendance setting
    console.log('Setting attendance:', attendanceData);
    showMessage('Attendance updated successfully!');
  };

  const handleSubmitLeave = (leaveData: Omit<LeaveRequest, 'id' | 'employeeName' | 'status' | 'createdAt'>) => {
    // Handle leave submission
    console.log('Submitting leave:', leaveData);
    showMessage('Leave request submitted successfully!');
  };

  const handleLeaveAction = (leaveId: string, action: 'approve' | 'reject') => {
    // Handle leave approval/rejection
    console.log('Leave action:', { leaveId, action });
    showMessage(`Leave request ${action}d successfully!`);
  };

  useEffect(() => {
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

 const renderTabContent = () => {
  switch (activeTab) {
    case 'dashboard':
      return (
        <Dashboard
          stats={dashboardStats}
          activities={recentActivities}
        />
      );
    case 'announcements':
  return <Announcements />;
    case 'register':
      return (
        <RegisterEmployee/>
      );
    case 'attendance':
      return (
        <SetAttendance
          employees={employees}
          onSetAttendance={handleSetAttendance}
        />
      );
    case 'leave':
      return (
        <LeaveManagement/>
      );
    case 'reports':
      return <Reports totalEmployees={0} averageAttendance={0} onGenerateReport={function (reportType: string, filters?: any): void {
          throw new Error('Function not implemented.');
      } } />;
    default:
      return null;
  }
};

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Navigation Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <i className="fas fa-user-shield text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Employee Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* Success/Error Messages */}
      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`${
              message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white px-6 py-3 rounded-xl shadow-lg mb-4 transform transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <span>
                <i
                  className={`fas fa-${
                    message.type === 'success' ? 'check' : 'exclamation-triangle'
                  } mr-2`}
                ></i>
                {message.text}
              </span>
              <button
                onClick={() => setMessage(null)}
                className="ml-4 text-white hover:text-gray-200"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FontAwesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default AdminPage;