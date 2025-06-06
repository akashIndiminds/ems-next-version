'use client';

import React, { useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

const RegisterEmployee: React.FC = () => {
    const [formData, setFormData] = useState({
        FirstName: '',
        MiddleName: '',
        LastName: '',
        EmailID: '',
        PhoneNumber: '',
        JoiningDate: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.FirstName.trim()) newErrors.FirstName = 'First name is required';
        if (!formData.LastName.trim()) newErrors.LastName = 'Last name is required';
        if (!formData.EmailID.trim()) {
            newErrors.EmailID = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.EmailID)) {
            newErrors.EmailID = 'Please enter a valid email address';
        }
        if (!formData.PhoneNumber.trim()) {
            newErrors.PhoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.PhoneNumber.replace(/\D/g, ''))) {
            newErrors.PhoneNumber = 'Please enter a valid 10-digit phone number';
        }
        if (!formData.JoiningDate) newErrors.JoiningDate = 'Joining date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const queryParams = new URLSearchParams(formData).toString();
        const url = `${baseUrl}/RegisterEmployee?${queryParams}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (!response.ok) throw new Error('Failed to register employee');

            setMessage({ text: 'Employee registered successfully!', type: 'success' });
            setFormData({
                FirstName: '',
                MiddleName: '',
                LastName: '',
                EmailID: '',
                PhoneNumber: '',
                JoiningDate: ''
            });
        } catch (error) {
            setMessage({ text: 'Error registering employee. Please try again.', type: 'error' });
        }

        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">👤 Register New Employee</h2>
                <p className="text-gray-600">Add new employees to the system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                        type="text"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.FirstName ? 'border-red-300' : 'border-gray-300'} text-black`}
                        placeholder="Enter first name"
                    />
                    {errors.FirstName && <p className="mt-1 text-sm text-red-600">{errors.FirstName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                        type="text"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.LastName ? 'border-red-300' : 'border-gray-300'} text-black`}
                        placeholder="Enter last name"
                    />
                    {errors.LastName && <p className="mt-1 text-sm text-red-600">{errors.LastName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                    <input
                        type="text"
                        name="MiddleName"
                        value={formData.MiddleName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black"
                        placeholder="Enter middle name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
                    <input
                        type="email"
                        name="EmailID"
                        value={formData.EmailID}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.EmailID ? 'border-red-300' : 'border-gray-300'} text-black`}
                        placeholder="Enter email address"
                    />
                    {errors.EmailID && <p className="mt-1 text-sm text-red-600">{errors.EmailID}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                        type="tel"
                        name="PhoneNumber"
                        value={formData.PhoneNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.PhoneNumber ? 'border-red-300' : 'border-gray-300'} text-black`}
                        placeholder="Enter phone number"
                    />
                    {errors.PhoneNumber && <p className="mt-1 text-sm text-red-600">{errors.PhoneNumber}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date *</label>
                    <input
                        type="date"
                        name="JoiningDate"
                        value={formData.JoiningDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.JoiningDate ? 'border-red-300' : 'border-gray-300'} text-black`}
                    />
                    {errors.JoiningDate && <p className="mt-1 text-sm text-red-600">{errors.JoiningDate}</p>}
                </div>

                <div className="md:col-span-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                        <i className="fas fa-user-plus mr-2"></i>Register Employee
                    </button>
                </div>
            </div>

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

export default RegisterEmployee;