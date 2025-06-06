'use client';

import React, { useState, useEffect } from 'react';
import { Employee, LeaveRequest, LeaveType } from '../types';


const  baseUrl=process.env.NEXT_PUBLIC_BASE_API;

const LeaveManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await fetch(`${baseUrl}/EmployeeCodes`);
        if (!employeesRes.ok) throw new Error('Failed to fetch employees');
        const employeesData: Employee[] = await employeesRes.json();
        setEmployees(employeesData);

        const pendingRes = await fetch(`${baseUrl}/leaves/pending`);
        if (!pendingRes.ok) throw new Error('Failed to fetch pending requests');
        const pendingData: LeaveRequest[] = await pendingRes.json();
        setPendingRequests(pendingData);
      } catch (error) {
        console.error(error);
        setMessage({ text: 'Error fetching data', type: 'error' });
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      setMessage({ text: 'All fields are required', type: 'error' });
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to submit leave request');
      setMessage({ text: 'Leave request submitted successfully', type: 'success' });
      setFormData({ employeeId: '', leaveType: '', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      setMessage({ text: 'Error submitting leave request', type: 'error' });
    }
  };

  const handleLeaveAction = async (leaveId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`${baseUrl}/leaves/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' }),
      });
      if (!response.ok) throw new Error(`Failed to ${action} leave request`);
      setMessage({ text: `Leave request ${action}d successfully`, type: 'success' });

      const pendingRes = await fetch(`${baseUrl}/leaves/pending`);
      if (!pendingRes.ok) throw new Error('Failed to fetch pending requests');
      const pendingData: LeaveRequest[] = await pendingRes.json();
      setPendingRequests(pendingData);
    } catch (error) {
      setMessage({ text: `Error ${action}ing leave request`, type: 'error' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">🏖️ Apply for Leave</h2>
          <p className="text-gray-600">Submit new leave requests</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Employee</option>
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
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Leave Type</option>
              {Object.values(LeaveType).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
            <textarea
              rows={3}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Reason for leave"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <i className="fas fa-paper-plane mr-2"></i>Submit Leave Request
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">📋 Pending Requests</h2>
          <p className="text-gray-600">Review and approve leave requests</p>
        </div>

        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-inbox text-4xl"></i>
              </div>
              <p className="text-gray-500">No pending leave requests</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{request.employeeName} (#{request.employeeId})</h4>
                    <p className="text-sm text-gray-500">
                      {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1).replace('_', ' ')} • 
                      {Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{request.reason}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLeaveAction(request.id, 'approve')}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    <i className="fas fa-check mr-1"></i>Approve
                  </button>
                  <button
                    onClick={() => handleLeaveAction(request.id, 'reject')}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-times mr-1"></i>Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;