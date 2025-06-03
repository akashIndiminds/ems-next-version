import axios from 'axios';
const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

export const setAttendanceStatus = async (
  empcode: string,
  date: string,
  checkInTime: string,
  checkOutTime: string,
  status: string,
  remarks: string
): Promise<{ message: string }> => {
  const params = new URLSearchParams({
    EmployeeCode: empcode,
    Date: date,
    CheckInTime: checkInTime,
    CheckOutTime: checkOutTime,
    Status: status,
    Remarks: remarks
  });
  const response = await axios.post(`${baseUrl}/SetAttendanceStatus?${params.toString()}`, {});
  return response.data;
};