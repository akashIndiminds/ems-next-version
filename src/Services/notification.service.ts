import axios from 'axios';
const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

interface ApiNotification {
  id: number;
  text: string;
  created_at: string;
  is_read: boolean;
  employee_code?: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isGlobal: boolean;
}

export const loadNotifications = async (employeeCode: string): Promise<Notification[]> => {
  const requestUrl = employeeCode.toUpperCase() === 'GLOBAL'
    ? `${baseUrl}/notifications/GLOBAL`
    : `${baseUrl}/notifications/${employeeCode}`;
  const response = await axios.get<{ success: boolean; data: ApiNotification[] }>(requestUrl);
  return response.data.data.map(notification => ({
    id: notification.id,
    message: notification.text,
    timestamp: new Date(notification.created_at),
    isRead: notification.is_read,
    isGlobal: !notification.employee_code
  }));
};

export const markAsRead = async (notificationId: number, employeeCode: string): Promise<void> => {
  await axios.put(`${baseUrl}/notifications/mark-as-read`, {
    announcement_id: notificationId,
    employee_code: employeeCode
  });
};

export const markAllAsRead = async (employeeCode: string): Promise<void> => {
  await axios.put(`${baseUrl}/notifications/mark-all-read`, { employee_code: employeeCode });
};