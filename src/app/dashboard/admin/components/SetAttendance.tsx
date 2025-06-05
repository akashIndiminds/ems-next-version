'use client';

import React, { useState } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';

interface SetAttendanceProps {
  employees: Employee[];
  onSetAttendance: (attendance: Omit<AttendanceRecord, 'id'>) => void;
}

const SetAttendance: React.FC<SetAttendanceProps> = ({ employees, onSetAttendance }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    checkInTime: '',
    checkOutTime: '',
    status: '',
    remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.date || !formData.status) {
      alert('Please fill in all required fields');
      return;
    }

    onSetAttendance({
      employeeId: formData.employeeId,
      date: formData.date,
      checkInTime: formData.checkInTime || undefined, // Changed from null to undefined
      checkOutTime: formData.checkOutTime || undefined, // Changed from null to undefined
      status: parseInt(formData.status) as AttendanceStatus,
      remarks: formData.remarks || undefined // Changed from null to undefined
    });

    // Reset form
    setFormData({
      employeeId: '',
      date: '',
      checkInTime: '',
      checkOutTime: '',
      status: '',
      remarks: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      '1': 'Present',
      '2': 'Absent',
      '3': 'Half-day',
      '4': 'Leave',
      '5': 'WFH'
    };
    return statusMap[status] || 'Select Status';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 Set Attendance</h2>
        <p className="text-gray-600">Manually set or update employee attendance records</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
          <select 
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} - {employee.id}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
          <input 
            type="time" 
            name="checkInTime"
            value={formData.checkInTime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
          <input 
            type="time" 
            name="checkOutTime"
            value={formData.checkOutTime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
          <select 
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Status</option>
            <option value="1">Present</option>
            <option value="2">Absent</option>
            <option value="3">Half-day</option>
            <option value="4">Leave</option>
            <option value="5">WFH</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
          <input 
            type="text" 
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Optional remarks"
          />
        </div>
        
        <div className="md:col-span-2">
          <button 
            type="submit" 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <i className="fas fa-save mr-2"></i>Update Attendance
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetAttendance;