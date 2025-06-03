import axios from 'axios';
const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

export const getMonthlyAttendanceReport = async (month: number, year: number): Promise<any> => {
  const params = new URLSearchParams({ Month: month.toString(), Year: year.toString() });
  const response = await axios.post(`${baseUrl}/AllEmployeeReport?${params.toString()}`, null);
  return response.data;
};