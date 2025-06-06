'use client';
import React, { useState, useEffect } from 'react';
import { 
  Clock, User, Calendar, CheckCircle2, XCircle, Clock3, Home, MessageSquare, LogOut, Menu, X, Bell, Settings, ChevronDown, Timer, MapPin, Briefcase 
} from 'lucide-react';
import { getAttendanceStatus } from '@/Services/employee-attendance.service';
import { checkAttendanceStatus } from '@/Services/checkin.service';
import { markAttendance, markExit } from '@/Services/attendance.service';
import { authService } from '@/Services/authService';

// Define interfaces
interface AttendanceStatusResponse {
  CheckInStatus: string;
  Duration: string;
}

interface AttendanceDetails {
  status: string;
  remarks: string;
}

interface MarkAttendanceResponse {
  message: string;
}

interface MarkExitResponse {
  message: string;
}

const AttendancePage = () => {
  const [isMarkEntryVisible, setIsMarkEntryVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employeeCode, setEmployeeCode] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [totalWorkingHours, setTotalWorkingHours] = useState('0 hrs 0 mins');
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', title: '', message: '' });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  const statusOptions = [
    { id: 1, status: 'Present', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 2, status: 'Absent', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 3, status: 'Half-day', icon: Clock3, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 4, status: 'Leave', icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 5, status: 'WFH', icon: Home, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  useEffect(() => {
    // Fetch employee code from local storage using authService
    const code = authService.getEmployeeCode();

    // Check if employee code is valid
    if (code === 'NA' || !code) {
      showMessage('warn', 'Warning', 'Employee code not found. Please log in again.');
      return;
    }

    setEmployeeCode(code);

    // Fetch attendance status and details only if employee code is valid
    checkAttendanceStatus(code)
      .then((response: AttendanceStatusResponse) => {
        setIsMarkEntryVisible(response.CheckInStatus !== 'true');
        setTotalWorkingHours(response.Duration || '0 hrs 0 mins');
        setAttendanceMarked(response.CheckInStatus === 'true');
      })
      .catch((error: Error) => {
        console.error('Error checking attendance status:', error);
        showMessage('error', 'Error', 'Failed to fetch attendance status.');
      });

    getAttendanceStatus(code)
      .then((attendanceDetails: AttendanceDetails) => {
        const statusOption = statusOptions.find((option) => option.status === attendanceDetails.status);
        setSelectedStatus(statusOption ? statusOption.id : 1);
        setRemarks(attendanceDetails.remarks || '');
      })
      .catch((error: Error) => {
        console.error('Error fetching attendance details:', error);
        showMessage('error', 'Error', 'Failed to fetch last attendance details.');
      });
  }, []); // Empty dependency array since we fetch once on mount

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showMessage = (type: string, title: string, message: string) => {
    setToastMessage({ type, title, message });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleMarkAttendance = async () => {
    if (attendanceMarked) {
      showMessage('warning', 'Warning', 'Entry already marked. Please contact admin for update!');
      return;
    }

    try {
      const response: MarkAttendanceResponse = await markAttendance(employeeCode);
      if (response.message === 'Entry already Marked. Please contact admin for update!!!') {
        setAttendanceMarked(true);
        setIsMarkEntryVisible(false);
        showMessage('warning', 'Warning', response.message);
      } else if (response.message === 'Entry Marked Successfully!') {
        setAttendanceMarked(true);
        setIsMarkEntryVisible(false);
        showMessage('success', 'Success', response.message);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      showMessage('error', 'Error', 'Failed to mark attendance. Please try again.');
    }
  };

  const handleMarkExit = async () => {
    try {
      const response: MarkExitResponse = await markExit(employeeCode, selectedStatus, remarks);
      showMessage('success', 'Success', response.message);
    } catch (error) {
      console.error('Error marking exit:', error);
      showMessage('error', 'Error', 'Failed to mark exit. Please try again.');
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const selectedStatusOption = statusOptions.find(option => option.id === selectedStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ${
          toastMessage.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
          toastMessage.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
          'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{toastMessage.title}</div>
            <button onClick={() => setShowToast(false)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
          <div className="text-sm mt-1">{toastMessage.message}</div>
        </div>
      )}

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Date and Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Today's Date</h3>
                <p className="text-sm text-gray-600">{formatDate(currentDate)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Working Hours</h3>
                <p className="text-sm text-gray-600">{totalWorkingHours}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedStatusOption?.bgColor || 'bg-gray-100'}`}>
                {selectedStatusOption && <selectedStatusOption.icon className={`w-6 h-6 ${selectedStatusOption.color}`} />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Current Status</h3>
                <p className={`text-sm font-medium ${selectedStatusOption?.color || 'text-gray-600'}`}>{selectedStatusOption?.status || 'Pending'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Attendance Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Mark Attendance
            </h2>
            <p className="text-gray-600 text-sm mt-1">Employee Code: {employeeCode}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Status</label>
                <div className="relative">
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-black"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.status}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
  value={remarks}
  onChange={(e) => setRemarks(e.target.value)}
  placeholder="Add any remarks..."
  rows={3}
  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg  resize-none bg-white text-black"
/>

                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {isMarkEntryVisible && (
                <button
                  onClick={handleMarkAttendance}
                  disabled={attendanceMarked}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <CheckCircle2 className="w-5 h-5" /> Mark Entry
                </button>
              )}
              <button
                onClick={handleMarkExit}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-5 h-5" /> Mark Exit
              </button>
            </div>
          </div>
        </div>

        {/* Recent Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Recent Attendance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { date: '2025-06-03', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: '9h 0m', remarks: 'On time' },
                  { date: '2025-06-02', checkIn: '09:15 AM', checkOut: '06:15 PM', status: 'Present', hours: '9h 0m', remarks: 'Slightly late' },
                  { date: '2025-06-01', checkIn: '-', checkOut: '-', status: 'Leave', hours: '0h 0m', remarks: 'Sick leave' },
                ].map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.checkOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' :
                        record.status === 'Leave' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.hours}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;