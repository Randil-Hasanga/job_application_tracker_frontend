import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationService from '../services/applicationService';
import TextGeneratorService from '../services/textGenService';
import { useAuthRedirect } from '../hooks/checkAuth';

const statusColors: Record<string, string> = {
    Applied: 'text-blue-800 bg-blue-100',
    Interview: 'text-yellow-800 bg-yellow-100',
    Offer: 'text-green-800 bg-green-100',
    Rejected: 'text-red-800 bg-red-100',
};

function AddApplication() {
    useAuthRedirect();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        dateApplied: '',
        status: '',
        notes: '',
        vacancy_link: '',
    });

    const [errors, setErrors] = useState({
        company: '',
        role: '',
        dateApplied: '',
        status: '',
        vacancy_link: '',
    });

    const [description, setJobDescription] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleChange = (e: { target: { name: any; value: any } }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleJobDescriptionChange = (e: { target: { value: any } }) => {
        setJobDescription(e.target.value);
    };

    const validateForm = () => {
        const newErrors: any = {};
        let isValid = true;

        if (!formData.company) {
            newErrors.company = 'Company is required.';
            isValid = false;
        }

        if (!formData.role) {
            newErrors.role = 'Role is required.';
            isValid = false;
        }

        if (!formData.dateApplied) {
            newErrors.dateApplied = 'Date Applied is required.';
            isValid = false;
        }

        if (!formData.status) {
            newErrors.status = 'Status is required.';
            isValid = false;
        }

        if (formData.vacancy_link && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.vacancy_link)) {
            newErrors.vacancy_link = 'Invalid URL.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setSubmitLoading(true);
        try {
            const response = await ApplicationService.createApplication(formData);
            console.log(response);
            setFormData({
                company: '',
                role: '',
                dateApplied: '',
                status: '',
                notes: '',
                vacancy_link: '',
            });
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitLoading(false); // Stop loading animation
        }
    };

    const handleCancel = () => {
        setFormData({
            company: '',
            role: '',
            dateApplied: '',
            status: '',
            notes: '',
            vacancy_link: '', // Reset application link
        });
        setErrors({
            company: '',
            role: '',
            dateApplied: '',
            status: '',
            vacancy_link: '',
        });
        setJobDescription('');
    };

    const handleProcessJobDescription = async () => {
        setAiLoading(true);
        try {
            const response = await TextGeneratorService.extractJobData({ description });
            setFormData({
                company: response.company,
                role: response.role,
                dateApplied: response.dateApplied,
                status: response.status,
                notes: '',
                vacancy_link: '',
            });
        } catch (error) {
            console.error('Error processing job description:', error);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-auto bg-gray-50 px-8 py-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="flex justify-between items-center mb-6">
                <nav className="space-x-6 text-sm text-gray-700 font-medium">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 hover:text-blue-600">
                        <ChevronLeftIcon className="h-4 w-4" />
                        Dashboard
                    </button>
                </nav>
            </header>
            <div className="bg-white rounded-3xl border border-blue-400 shadow px-8 py-4 max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-right">Add Job Application</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="rounded-3xl mb-6">
                        <label className="block font-medium text-Black mb-2">You can use AI to extract information!</label>
                        <div className="relative">
                            <textarea
                                value={description}
                                onChange={handleJobDescriptionChange}
                                placeholder="Extract using AI"
                                rows={3}
                                className="w-full border border-gray-300 px-4 py-2 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleProcessJobDescription}
                                className={`absolute top-2 right-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 ${aiLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={aiLoading} // Disable button while loading
                            >
                                {aiLoading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        className="w-6 h-6 text-white"
                                        fill="currentColor"
                                    >
                                        <path d="M248 106.6c18.9-9 32-28.3 32-50.6c0-30.9-25.1-56-56-56s-56 25.1-56 56c0 22.3 13.1 41.6 32 50.6l0 98.8c-2.8 1.3-5.5 2.9-8 4.7l-80.1-45.8c1.6-20.8-8.6-41.6-27.9-52.8C57.2 96 23 105.2 7.5 132S1.2 193 28 208.5c1.3 .8 2.6 1.5 4 2.1l0 90.8c-1.3 .6-2.7 1.3-4 2.1C1.2 319-8 353.2 7.5 380S57.2 416 84 400.5c19.3-11.1 29.4-32 27.8-52.8l50.5-28.9c-11.5-11.2-19.9-25.6-23.8-41.7L88 306.1c-2.6-1.8-5.2-3.3-8-4.7l0-90.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-.1 1.4-.2 2.8-.2 4.3c0 22.3 13.1 41.6 32 50.6l0 98.8c-18.9 9-32 28.3-32 50.6c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.3-13.1-41.6-32-50.6l0-98.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-1.6 20.8 8.6 41.6 27.8 52.8c26.8 15.5 61 6.3 76.5-20.5s6.3-61-20.5-76.5c-1.3-.8-2.7-1.5-4-2.1l0-90.8c1.4-.6 2.7-1.3 4-2.1c26.8-15.5 36-49.7 20.5-76.5S390.8 96 364 111.5c-19.3 11.1-29.4 32-27.8 52.8l-50.6 28.9c11.5 11.2 19.9 25.6 23.8 41.7L360 205.9c2.6 1.8 5.2 3.3 8 4.7l0 90.8c-2.8 1.3-5.5 2.9-8 4.6l-80.1-45.8c.1-1.4 .2-2.8 .2-4.3c0-22.3-13.1-41.6-32-50.6l0-98.8z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className='text-sm w-full space-y-0 text-center'>AI can make mistakes. Check important info</p>
                    </div>
                    <hr className="my-6 border-gray-500" />
                    <div className="rounded-3xl">
                        <label className="block font-bold text-gray-700 mb-1">Company</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            className="w-full border border-gray-300 px-4 py-2 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                    </div>
                    <div className="rounded-3xl">
                        <label className="block font-bold text-gray-700 mb-1">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="Enter job role"
                            className="w-full border border-gray-300 px-4 py-2 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>
                    <div className="flex space-x-6 rounded-3xl">
                        <div className="flex-1">
                            <label className="block font-bold text-gray-700 mb-1">Date Applied</label>
                            <input
                                type="date"
                                name="dateApplied"
                                value={formData.dateApplied}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-2 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.dateApplied && <p className="text-red-500 text-sm mt-1">{errors.dateApplied}</p>}
                        </div>
                        <div className="flex-1 rounded-3xl">
                            <label className="block font-bold text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`w-full border border-gray-300 px-4 py-2 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${formData.status ? statusColors[formData.status] : ''}`}
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
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                        </div>
                    </div>
                    <div className="rounded-3xl">
                        <label className="block font-bold text-gray-700 mb-1">Job Vacancy Link</label>
                        <input
                            type="text"
                            name="vacancy_link"
                            value={formData.vacancy_link}
                            onChange={handleChange}
                            placeholder="https://www.example.com"
                            className="w-full border border-gray-300 px-4 py-2 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.vacancy_link && <p className="text-red-500 text-sm mt-1">{errors.vacancy_link}</p>}
                    </div>
                    <div className="rounded-3xl">
                        <label className="block font-bold text-gray-700 ">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any notes about the application"
                            rows={4}
                            className="w-full border border-gray-300 px-4 py-2 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-end space-x-4 rounded-3xl">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`bg-blue-600 border border-white text-white px-4 py-2 rounded-3xl hover:bg-white hover:text-black hover:border-black shadow-lg flex items-center gap-2 ${submitLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={submitLoading}
                        >
                            {submitLoading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                    Add Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddApplication;