'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { employeeService } from '@/Services/employeeService';
import { employeeAttendanceService } from '@/Services/employeeAttendanceService';
import { authService } from '@/Services/authService';

// Component imports
import WelcomeCard from './components/WelcomeCard';
import AttendanceStats from './components/AttendanceStats';
import AttendanceHistory from './components/AttendanceHistory';
import QuickActions from './components/QuickActions';
import StatsSummary from './components/StatsSummary';

interface EmployeeDetails {
  employee_code: string;
  employee_full_name: string;
  message?: string;
}

interface AttendanceDetails {
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string | null;
  remarks: string | null;
}

const Dashboard: React.FC = () => {
  const [employeeCode, setEmployeeCode] = useState<string | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [attendanceDetails, setAttendanceDetails] = useState<AttendanceDetails>({
    checkInTime: null,
    checkOutTime: null,
    status: null,
    remarks: null,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Stats for visualization (would come from API in real implementation)
  const [attendanceStats, setAttendanceStats] = useState({
    present: 18,
    absent: 2,
    leave: 1,
    halfDay: 2,
    overtime: 14.5,
    workHours: 152,
    punchInRate: 92, // percentage
    onTimeRate: 88, // percentage
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      const empCode = authService.getEmployeeCode();
      
      if (empCode && empCode !== 'NA') {
        setEmployeeCode(empCode);
        await Promise.all([
          fetchEmployeeDetails(empCode),
          fetchAttendanceDetails(empCode)
        ]);
      } else {
        console.warn('Employee code not found. User may need to login.');
        // Optionally redirect to login
        // router.push('/login');
      }
      setLoading(false);
    };

    initializeDashboard();
  }, []);

  const fetchEmployeeDetails = async (employeeCode: string): Promise<void> => {
    try {
      const data = await employeeService.getEmployeeDetails(employeeCode);
      setEmployeeDetails(data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const fetchAttendanceDetails = async (employeeCode: string): Promise<void> => {
    try {
      const data = await employeeAttendanceService.getAttendanceStatus(employeeCode);
      setAttendanceDetails(data);
    } catch (error) {
      console.error('Error fetching attendance details:', error);
      setAttendanceDetails({
        checkInTime: 'Error',
        checkOutTime: 'Error',
        status: 'Error',
        remarks: 'Failed to fetch attendance details'
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-indigo-800 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Navigation would go here */}
      
      <div className="flex">
        {/* Sidebar would go here */}
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} pt-7`}>
          <div className="px-6 w-full mx-auto">
            {/* Welcome Card */}
            <WelcomeCard 
              employeeName={employeeDetails?.employee_full_name || 'Employee'} 
              employeeCode={employeeCode || ''}
            />
            
            {/* Stats Summary Row */}
            <StatsSummary stats={attendanceStats} />
            
            {/* Today's Attendance Status */}
            <AttendanceStats 
              attendanceDetails={attendanceDetails} 
            />
            
            {/* Quick Actions */}
            <QuickActions />
            
            {/* Attendance History */}
            <AttendanceHistory employeeCode={employeeCode || ''} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
