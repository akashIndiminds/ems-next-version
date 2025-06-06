// Employee Management System Types

// Enums
export enum AttendanceStatus {
  PRESENT = 1,
  ABSENT = 2,
  HALF_DAY = 3,
  LEAVE = 4,
  WFH = 5
}

export enum LeaveType {
  SICK = 'sick',
  PERSONAL = 'personal',
  VACATION = 'vacation',
  EMERGENCY = 'emergency'
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Interfaces
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  joiningDate: string;
}

export interface Announcement {
  id: string;
  employeeId?: string; // Optional - if null, announcement is for all
  text: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingRequests: number;
  attendanceRate: number;
}

export interface Activity {
  id: string;
  type: 'registration' | 'attendance' | 'announcement' | 'leave';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
}

export interface ActiveTab {
  id: string;
  name: string;
  icon: string;
}