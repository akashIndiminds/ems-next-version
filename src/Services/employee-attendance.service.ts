import axios from 'axios';
import { aesEncryptionService } from '@/utils/encryption';

const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

interface DailyAttendanceResponse {
  success: boolean;
  message?: string;
  data?: {
    empcode: string;
    date: string;
    checkintime: string;
    checkouttime: string | null;
    status: number;
    remarks: string;
  };
  Employee_Details?: any;
}

interface AttendanceViewModel {
  checkInTime: string;
  checkOutTime: string;
  status: string;
  remarks: string;
}

const formatTime = (time: string | null): string => {
  if (!time) return 'Not Marked';
  try {
    const timeOnly = time.split('.')[0];
    return new Date(`1970-01-01T${timeOnly}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return 'Not Marked';
  }
};

const getStatusText = (statusCode: number): string => {
  const statusMap: { [key: number]: string } = {
    1: 'Present',
    2: 'Absent',
    3: 'Half-day',
    4: 'Leave'
  };
  return statusMap[statusCode] || 'Pending';
};

export const getAttendanceStatus = async (employeeCode: string): Promise<AttendanceViewModel> => {
  const encryptedEmpCode = aesEncryptionService.encrypt(employeeCode);
  const encodedEmpCode = encodeURIComponent(encryptedEmpCode);
  try {
    const response = await axios.post<DailyAttendanceResponse>(`${baseUrl}/AttendanceDetails?Empcode=${encodedEmpCode}`, {});
    const data = response.data;
    if (!data.success || !data.data) {
      return { checkInTime: 'Not Marked', checkOutTime: 'Not Marked', status: 'Pending', remarks: '' };
    }
    return {
      checkInTime: formatTime(data.data.checkintime),
      checkOutTime: formatTime(data.data.checkouttime),
      status: getStatusText(data.data.status),
      remarks: data.data.remarks || ''
    };
  } catch (error) {
    console.error('HTTP Error:', error);
    return { checkInTime: 'Not Marked', checkOutTime: 'Not Marked', status: 'Pending', remarks: '' };
  }
};
