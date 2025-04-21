import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const statusColors: Record<string, string> = {
    Applied: 'text-blue-800 bg-blue-100',
    Interview: 'text-yellow-800 bg-yellow-100',
    Offer: 'text-green-800 bg-green-100',
    Rejected: 'text-red-800 bg-red-100',
};

function AddApplication() {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        dateApplied: '',
        status: '',
        notes: '',
    });

    const handleChange = (e: { target: { name: any; value: any } }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    const handleCancel = () => {
        setFormData({
            company: '',
            role: '',
            dateApplied: '',
            status: '',
            notes: '',
        });
    };

    return (
        <div className="rounded-xl h-screen overflow-auto bg-gray-50 px-8 py-6 my-6 border border-blue-200" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <nav className="space-x-6 text-sm text-gray-700 font-medium">
                    <a href="/" className="flex items-center gap-1 hover:text-blue-600">
                        <ChevronLeftIcon className="h-4 w-4" />
                        Dashboard
                    </a>
                </nav>
            </header>

            {/* Form Container */}
            <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-left">Add Job Application</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Company</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="Enter job role"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Date and Status */}
                    <div className="flex space-x-6">
                        <div className="flex-1">
                            <label className="block font-medium text-gray-700 mb-1">Date Applied</label>
                            <input
                                type="date"
                                name="dateApplied"
                                value={formData.dateApplied}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex-1">
                            <label className="block font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    formData.status ? statusColors[formData.status] : ''
                                }`}
                            >
                                <option value="" className="text-gray-700">Select status</option>
                                {Object.keys(statusColors).map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                        className={statusColors[status]}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any notes about the application"
                            rows={4}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Add Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddApplication;
