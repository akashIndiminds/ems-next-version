import axios from 'axios';
import { aesEncryptionService } from '@/utils/encryption';
import { isClientSide, getLocalDateString } from './helpers';

const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

export const markAttendance = async (employeeCode: string): Promise<any> => {
  const encryptedEmployeeCode = aesEncryptionService.encrypt(employeeCode);
  const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);
  const url = `${baseUrl}/MarkEntry?EmployeeCode=${encodedEmployeeCode}`;
  const response = await axios.post(url, null);
  return response.data;
};

export const hasMarkedAttendance = (): boolean => {
  if (!isClientSide()) return false;
  const storedDate = localStorage.getItem('lastAttendanceDate');
  const currentDate = getLocalDateString();
  if (storedDate !== currentDate) {
    localStorage.removeItem('attendanceMarked');
    localStorage.removeItem('lastAttendanceDate');
    return false;
  }
  return localStorage.getItem('attendanceMarked') === 'true';
};

export const handleAttendanceMarked = (): void => {
  if (isClientSide()) {
    const currentDate = getLocalDateString();
    localStorage.setItem('attendanceMarked', 'true');
    localStorage.setItem('lastAttendanceDate', currentDate);
  }
};

export const resetAttendanceStatus = (): void => {
  if (isClientSide()) {
    localStorage.removeItem('attendanceMarked');
    localStorage.removeItem('lastAttendanceDate');
  }
};

export const markExit = async (employeeCode: string, status: number, remarks: string): Promise<any> => {
  const encryptedEmployeeCode = aesEncryptionService.encrypt(employeeCode);
  const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);
  const queryString = `?EmployeeCode=${encodedEmployeeCode}&Status=${status}&Remarks=${encodeURIComponent(remarks)}`;
  const response = await axios.post(`${baseUrl}/MarkExit${queryString}`, null);
  return response.data;
};