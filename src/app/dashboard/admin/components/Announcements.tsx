'use client';

import React, { useState, useEffect } from 'react';



const  baseUrl=process.env.NEXT_PUBLIC_BASE_API;
interface EmployeeCode {
  Text: string;
  Value: string;
}

const Announcements: React.FC = () => {
  const [employeeCodes, setEmployeeCodes] = useState<EmployeeCode[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch employee codes on component mount
  useEffect(() => {
    const fetchEmployeeCodes = async () => {
      try {
        const response = await fetch(`${baseUrl}/EmployeeCodes`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee codes');
        }
        const data: EmployeeCode[] = await response.json();
        // Sort alphabetically by employee name
        const sortedData = data.sort((a, b) => {
          const nameA = a.Text.split(' - ')[0].trim().toUpperCase();
          const nameB = b.Text.split(' - ')[0].trim().toUpperCase();
          return nameA.localeCompare(nameB);
        });
        setEmployeeCodes(sortedData);
      } catch (error) {
        console.error('Error fetching employee codes:', error);
        setMessage({ text: 'Error loading employee list', type: 'error' });
      }
    };

    fetchEmployeeCodes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!announcementText.trim()) {
      setMessage({ text: 'Announcement cannot be empty!', type: 'error' });
      return;
    }

    const requestBody = {
      text: announcementText,
      employee_code: selectedEmployee || null, // Null for global announcements
    };

    try {
      const response = await fetch(`${baseUrl}/announcements/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to post announcement');
      }

      setMessage({ text: 'Announcement successfully posted!', type: 'success' });
      setAnnouncementText('');
      setSelectedEmployee('');
    } catch (error) {
      console.error('Error posting announcement:', error);
      setMessage({ text: 'Error posting announcement. Please try again!', type: 'error' });
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
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
            className="w-full px-4 py-3 rounded-xl border text-black"
          >
            <option value="">All Employees</option>
            {employeeCodes.map((employee) => (
              <option key={employee.Value} value={employee.Value}>
                {employee.Text}
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
            className="w-full px-4 py-3 rounded-xl border text-black"
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

      {message && (
        <div
          className={`mt-4 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Announcements;