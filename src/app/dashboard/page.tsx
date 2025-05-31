'use client';

import React, { useState, useEffect } from 'react';
import { employeeService } from '@/Services/employeeService';
import { employeeAttendanceService } from '@/Services/employeeAttendanceService';
import { authService } from '@/Services/authService';

// Import dashboard components
import WelcomeSection from './components/WelcomeSection';
import StatsOverview from './components/StatsOverview';
import AttendanceStatus from './components/AttendanceStatus';
import AttendanceChart from './components/AttendanceChart';
import CalendarView from './components/CalendarView';
import AttendanceTable from './components/AttendanceTable';
import QuickActions from './components/QuickActions';
import NotificationsSection from './components/NotificationsSection';

interface EmployeeDetails {
  employee_code: string;
  employee_full_name: string;
  designation?: string;
  department?: string;
  message?: string;
}

interface AttendanceDetails {
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string | null;
  remarks: string | null;
  workingHours?: string | null;
}

const Dashboard: React.FC = () => {
  const [employeeCode, setEmployeeCode] = useState<string | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [attendanceDetails, setAttendanceDetails] = useState<AttendanceDetails>({
    checkInTime: null,
    checkOutTime: null,
    status: null,
    remarks: null,
    workingHours: null,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initializeDashboard = async () => {
      const empCode = authService.getEmployeeCode();
      
      if (empCode && empCode !== 'NA') {
        setEmployeeCode(empCode);
        await Promise.all([
          fetchEmployeeDetails(empCode),
          fetchAttendanceDetails(empCode)
        ]);
      }
      setLoading(false);
    };

    initializeDashboard();
  }, []);

  const fetchEmployeeDetails = async (employeeCode: string): Promise<void> => {
    try {
      const data = await employeeService.getEmployeeDetails(employeeCode);
      setEmployeeDetails({
        ...data,
        designation: 'Developer', // Placeholder, replace with real data
        department: 'IT Department' // Placeholder, replace with real data
      });
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const fetchAttendanceDetails = async (employeeCode: string): Promise<void> => {
    try {
      const data = await employeeAttendanceService.getAttendanceStatus(employeeCode);
      setAttendanceDetails({
        ...data,
        workingHours: calculateWorkingHours(data.checkInTime, data.checkOutTime)
      });
    } catch (error) {
      console.error('Error fetching attendance details:', error);
    }
  };

  const calculateWorkingHours = (checkIn: string | null, checkOut: string | null): string => {
    if (!checkIn) return '0h 0m';
    
    const checkInTime = new Date(`2023-01-01 ${checkIn}`);
    const checkOutTime = checkOut 
      ? new Date(`2023-01-01 ${checkOut}`) 
      : new Date();
    
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <main className="flex-1 px-5 pt-5 w-full ">
        {/* Welcome Section */}
        <WelcomeSection 
          employeeDetails={employeeDetails} 
          employeeCode={employeeCode}
          lastCheckIn={attendanceDetails.checkInTime}
        />

        {/* Attendance Status & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AttendanceStatus 
              attendanceDetails={attendanceDetails} 
            />
            {/* <AttendanceChart /> */}
          </div>
          {/* <CalendarView /> */}
        </div>

         {/* Stats Overview */}
        <StatsOverview />

        {/* Attendance Table */}
        {/* <AttendanceTable /> */}

        {/* Quick Actions */}
        <QuickActions />

        {/* Notifications */}
        {/* <NotificationsSection /> */}
      </main>
    </div>
  );
};

export default Dashboard;