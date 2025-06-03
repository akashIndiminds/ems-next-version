import axios from 'axios';

const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

interface LeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export const applyForLeave = async (leaveRequest: LeaveRequest): Promise<any> => {
  const response = await axios.post(`${baseUrl}/leave/apply`, leaveRequest);
  return response.data;
};