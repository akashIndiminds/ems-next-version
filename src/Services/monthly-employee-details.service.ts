import axios from 'axios';
import { aesEncryptionService} from '@/utils/encryption';
const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

interface AttendanceDetail {
  date: string;
  check_in: string;
  check_out: string;
  hours_worked: number;
  status: string;
  remarks: string;
  arrival_status: string;
}

interface MonthlyAttendanceResponse {
  attendance_details: AttendanceDetail[];
  summary: {
    total_hours_worked: number;
    month: string;
    year: string;
    employee_code: string;
  };
  status: string;
  message: string;
}

export const getMonthlyEmployeeDetails = async (
  employeeCode: string,
  month: number,
  year: number
): Promise<MonthlyAttendanceResponse> => {
  const encryptedEmployeeCode = aesEncryptionService.encrypt(employeeCode);
  const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);
  const queryString = `?EmployeeCode=${encodedEmployeeCode}&Month=${month}&Year=${year}`;
  const response = await axios.post<MonthlyAttendanceResponse>(`${baseUrl}/ByEmployeeReport${queryString}`, {});
  return response.data;
};