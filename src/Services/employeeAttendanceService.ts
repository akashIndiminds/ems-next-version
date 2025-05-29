import { aesEncryptionService } from '@/utils/encryption';

const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

export interface AttendanceResponse {
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

export interface AttendanceViewModel {
  checkInTime: string;
  checkOutTime: string;
  status: string;
  remarks: string;
}

export interface AttendanceRecord {
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  remarks: string;
  hoursWorked?: number;
}

class EmployeeAttendanceService {
  private apiUrl = `${baseUrl}/AttendanceDetails`;

  async getAttendanceStatus(employeeCode: string): Promise<AttendanceViewModel> {
    try {
      const encryptedEmpCode = aesEncryptionService.encrypt(employeeCode);
      const encodedEmpCode = encodeURIComponent(encryptedEmpCode);

      const response = await fetch(`${this.apiUrl}?Empcode=${encodedEmpCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        console.error('HTTP Error:', response.status);
        return this.getDefaultAttendance();
      }

      const data: AttendanceResponse = await response.json();
      console.log('Full API Response:', data);

      if (!data.success || !data.data) {
        console.warn(data.message || 'No attendance data found');
        return this.getDefaultAttendance();
      }

      return {
        checkInTime: this.formatTime(data.data.checkintime),
        checkOutTime: this.formatTime(data.data.checkouttime),
        status: this.getStatusText(data.data.status),
        remarks: data.data.remarks || ''
      };
    } catch (error) {
      console.error('Error fetching attendance status:', error);
      return this.getDefaultAttendance();
    }
  }

  async getAttendanceHistory(
    employeeCode: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<AttendanceRecord[]> {
    try {
      const encryptedEmpCode = aesEncryptionService.encrypt(employeeCode);
      const encodedEmpCode = encodeURIComponent(encryptedEmpCode);
      
      let url = `${this.apiUrl}/history?Empcode=${encodedEmpCode}`;
      
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data.map((record: any) => ({
          date: this.formatDate(record.date),
          checkInTime: this.formatTime(record.checkintime),
          checkOutTime: this.formatTime(record.checkouttime),
          status: this.getStatusText(record.status),
          remarks: record.remarks || '',
          hoursWorked: this.calculateHoursWorked(record.checkintime, record.checkouttime)
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      return [];
    }
  }

  async markAttendance(employeeCode: string, type: 'checkin' | 'checkout'): Promise<any> {
    try {
      const encryptedEmpCode = aesEncryptionService.encrypt(employeeCode);
      
      const response = await fetch(`${this.apiUrl}/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeCode: encryptedEmpCode,
          type,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  async getAttendanceSummary(employeeCode: string, month: number, year: number): Promise<any> {
    try {
      const encryptedEmpCode = aesEncryptionService.encrypt(employeeCode);
      const encodedEmpCode = encodeURIComponent(encryptedEmpCode);
      
      const response = await fetch(
        `${this.apiUrl}/summary?Empcode=${encodedEmpCode}&month=${month}&year=${year}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
      throw error;
    }
  }

  private getDefaultAttendance(): AttendanceViewModel {
    return {
      checkInTime: 'Not Marked',
      checkOutTime: 'Not Marked',
      status: 'Pending',
      remarks: ''
    };
  }

  private formatTime(time: string | null): string {
    if (!time) return 'Not Marked';
    try {
      const timeOnly = time.split('.')[0]; // Remove milliseconds
      return new Date(`1970-01-01T${timeOnly}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Not Marked';
    }
  }

  private formatDate(date: string): string {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return date;
    }
  }

  private getStatusText(statusCode: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Present',
      2: 'Absent',
      3: 'Half-day',
      4: 'Leave'
    };
    return statusMap[statusCode] || 'Pending';
  }

  private calculateHoursWorked(checkIn: string | null, checkOut: string | null): number {
    if (!checkIn || !checkOut) return 0;
    
    try {
      const checkInTime = new Date(`1970-01-01T${checkIn.split('.')[0]}`);
      const checkOutTime = new Date(`1970-01-01T${checkOut.split('.')[0]}`);
      
      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
      return Math.max(0, diffMs / (1000 * 60 * 60)); // Convert to hours
    } catch (error) {
      return 0;
    }
  }
}

// Export a singleton instance
export const employeeAttendanceService = new EmployeeAttendanceService();