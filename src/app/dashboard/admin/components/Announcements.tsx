'use client';

import React, { useState } from 'react';
import { Employee } from '../types';

interface AnnouncementsProps {
  employees: Employee[];
  onSubmitAnnouncement: (employeeId: string | null, text: string) => void;
}

const Announcements: React.FC<AnnouncementsProps> = ({ employees, onSubmitAnnouncement }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [announcementText, setAnnouncementText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!announcementText.trim()) {
      return;
    }

    const employeeId = selectedEmployee || null;
    onSubmitAnnouncement(employeeId, announcementText);
    
    // Reset form
    setSelectedEmployee('');
    setAnnouncementText('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📢 Create Announcement</h2>
        <p className="text-gray-600">Send announcements to all employees or specific individuals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Employee (Optional)
          </label>
          <select 
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} - {employee.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Announcement Text
          </label>
          <textarea 
            rows={5}
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your announcement here..."
            required
          />
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!announcementText.trim()}
          >
            <i className="fas fa-paper-plane mr-2"></i>
            Post Announcement
          </button>
        </div>
      </form>
    </div>
  );
};

export default Announcements;