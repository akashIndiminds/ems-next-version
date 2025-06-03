import axios from 'axios';
import { aesEncryptionService } from '@/utils/encryption';


const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

export const changePassword = async (
  empCode: string,
  currentPassword: string,
  newPassword: string
): Promise<any> => {
  const encryptedEmpCode = aesEncryptionService.encrypt(empCode);
  const encryptedCurrentPassword = aesEncryptionService.encrypt(currentPassword);
  const encryptedNewPassword = aesEncryptionService.encrypt(newPassword);
  const queryString = `?EmployeeCode=${encodeURIComponent(encryptedEmpCode)}¤t_password=${encodeURIComponent(encryptedCurrentPassword)}&new_password=${encodeURIComponent(encryptedNewPassword)}`;
  const response = await axios.post(`${baseUrl}/UpdatePassword${queryString}`, null);
  return response.data;
};