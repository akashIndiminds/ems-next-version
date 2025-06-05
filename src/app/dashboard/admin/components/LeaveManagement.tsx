'use client';

import React, { useState } from 'react';
import { Employee, LeaveRequest, LeaveType, LeaveStatus } from '../types'; // Added Employee

interface LeaveManagementProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  onSubmitLeave: (leave: Omit<LeaveRequest, 'id' | 'employeeName' | 'status' | 'createdAt'>) => void; // Aligned with AdminPage.tsx
  onLeaveAction: (leaveId: string, action: 'approve' | 'reject') => void;
  currentUserName?: string;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({
  employees,
  leaveRequests = [],
  onSubmitLeave,
  onLeaveAction,
  currentUserName = 'Current User',
}) => {
  const [formData, setFormData] = useState({
    employeeId: 'current-user',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmitLeave({
      employeeId: formData.employeeId,
      leaveType: formData.leaveType as LeaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
    });

    setFormData({
      employeeId: 'current-user',
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusBadge = (status: LeaveStatus) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const formatLeaveType = (type: LeaveType) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Leave Request Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">🏖️ Apply for Leave</h2>
          <p className="text-gray-600">Submit new leave requests</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="current-user">Current User ({currentUserName})</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} ({employee.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Leave Type</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="vacation">Vacation</option>
              <option value="emergency">Emergency Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
            <textarea
              rows={3}
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Reason for leave"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <i className="fas fa-paper-plane mr-2"></i>Submit Leave Request
          </button>
        </form>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">📋 Pending Requests</h2>
          <p className="text-gray-600">Review and approve leave requests</p>
        </div>

        <div className="space-y-4">
          {leaveRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-inbox text-4xl"></i>
              </div>
              <p className="text-gray-500">No pending leave requests</p>
            </div>
          ) : (
            leaveRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{request.employeeName} (#{request.employeeId})</h4>
                    <p className="text-sm text-gray-500">
                      {formatLeaveType(request.leaveType)} • {calculateLeaveDays(request.startDate, request.endDate)} days
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(request.startDate).toLocaleDateString()} -{' '}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadge(request.status)}`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{request.reason}</p>

                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onLeaveAction(request.id, 'approve')}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
                    >
                      <i className="fas fa-check mr-1"></i>Approve
                    </button>
                    <button
                      onClick={() => onLeaveAction(request.id, 'reject')}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                    >
                      <i className="fas fa-times mr-1"></i>Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;