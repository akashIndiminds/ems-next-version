import axios from 'axios';
import { aesEncryptionService } from '@/utils/encryption';
import { isClientSide, getLocalDateString } from './helpers';

const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

export const storeCheckInStatus = (status: string, duration: string): void => {
  if (isClientSide()) {
    const encryptedStatus = aesEncryptionService.encrypt(status);
    const encryptedDuration = aesEncryptionService.encrypt(duration);
    const currentDate = getLocalDateString();
    localStorage.setItem('checkInStatus', encryptedStatus);
    localStorage.setItem('duration', encryptedDuration);
    localStorage.setItem('lastCheckInDate', currentDate);
  }
};

export const getCheckInStatus = (): string => {
  if (!isClientSide()) return '';
  const storedDate = localStorage.getItem('lastCheckInDate');
  const currentDate = getLocalDateString();
  if (storedDate !== currentDate) {
    resetCheckInStatus();
    return '';
  }
  const encryptedStatus = localStorage.getItem('checkInStatus');
  return encryptedStatus ? aesEncryptionService.decrypt(encryptedStatus) : '';
};

export const getDuration = (): string => {
  if (!isClientSide()) return '';
  const storedDate = localStorage.getItem('lastCheckInDate');
  const currentDate = getLocalDateString();
  if (storedDate !== currentDate) {
    resetCheckInStatus();
    return '';
  }
  const encryptedDuration = localStorage.getItem('duration');
  return encryptedDuration ? aesEncryptionService.decrypt(encryptedDuration) : '';
};

export const resetCheckInStatus = (): void => {
  if (isClientSide()) {
    localStorage.removeItem('checkInStatus');
    localStorage.removeItem('duration');
    localStorage.removeItem('lastCheckInDate');
  }
};

export const checkAttendanceStatus = async (employeeCode: string): Promise<any> => {
  const encryptedEmployeeCode = aesEncryptionService.encrypt(employeeCode);
  const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);
  const response = await axios.post(`${baseUrl}/CheckInStatus?EmployeeCode=${encodedEmployeeCode}`, null);
  return response.data;
};