import { useState } from 'react';
import { Link } from 'react-router-dom';

const applications = [
    {
        id: 1,
        company: 'Meta',
        role: 'Software Engineer',
        date: '04/01/2024',
        status: 'Interview',
        link: 'https://meta.com/careers',
        notes: 'Interview scheduled next week',
    },
    {
        id: 2,
        company: 'Google',
        role: 'Software Engineer',
        date: '03/25/2024',
        status: 'Applied',
        link: 'https://careers.google.com',
        notes: 'Waiting for response',
    },
    {
        id: 3,
        company: 'Amazon',
        role: 'Frontend Developer',
        date: '03/20/2024',
        status: 'Applied',
        link: 'https://amazon.jobs',
        notes: 'Followed up via email',
    },
    {
        id: 4,
        company: 'Microsoft',
        role: 'UX Designer',
        date: '03/18/2024',
        status: 'Rejected',
        link: 'https://careers.microsoft.com',
        notes: 'Rejection email received',
    },
    {
        id: 5,
        company: 'Spotify',
        role: 'Product Manager',
        date: '02/15/2024',
        status: 'Offer',
        link: 'https://spotifyjobs.com',
        notes: 'Offer under review',
    },
];

const statusColors: Record<string, string> = {
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};

export default function Dashboard() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [activeStatusId, setActiveStatusId] = useState<number | null>(null);
    const [apps, setApps] = useState(applications);

    const filteredApps = apps.filter(app =>
        (app.company.toLowerCase().includes(search.toLowerCase()) ||
            app.role.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? app.status === statusFilter : true)
    );

    const handleStatusChange = (id: number, newStatus: string) => {
        const updated = apps.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        );
        setApps(updated);
        setActiveStatusId(null);
    };

    const handleNoteChange = (id: number, newNote: string) => {
        const updated = apps.map(app =>
            app.id === id ? { ...app, notes: newNote } : app
        );
        setApps(updated);
    };

    const handleBlur = () => {
        setActiveStatusId(null); // Close any active status dropdowns
    };

    return (
        <div className="rounded-xl h-screen overflow-auto bg-gray-50 px-8 py-6 my-6 border border-blue-200" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Job Application Tracker</h1>
                <nav className="space-x-6 text-sm text-gray-700 font-medium">
                    <Link to="/" className="hover:text-blue-600">Dashboard</Link>
                    <Link to="/add-application" className="hover:text-blue-600">Add Application</Link>
                </nav>
            </header>

            {/* Title + Controls */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-semibold text-gray-800">Applications</h2>
                <Link
                    to="/add-application"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add New
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-56"
                >
                    <option value="">Filter by status</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by company or role"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 flex-grow"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm relative">
                    <thead className="bg-gray-100 text-gray-600 text-left">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-center">Company</th>
                            <th className="px-6 py-3 font-semibold text-center">Role</th>
                            <th className="px-6 py-3 font-semibold text-center">Date Applied</th>
                            <th className="px-6 py-3 font-semibold text-center">Status</th>
                            <th className="px-6 py-3 font-semibold text-center">Job Link</th>
                            <th className="px-6 py-3 font-semibold text-center">Notes</th>
                            <th className="px-6 py-3 font-semibold text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {filteredApps.map(app => (
                            <tr key={app.id} className="relative">
                                <td className="px-6 py-3 text-center">{app.company}</td>
                                <td className="px-6 py-3 text-center">{app.role}</td>
                                <td className="px-6 py-3 text-center">{app.date}</td>
                                <td className="px-6 py-3 relative text-center">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${statusColors[app.status]}`}
                                        onClick={() => setActiveStatusId(activeStatusId === app.id ? null : app.id)}
                                    >
                                        {app.status}
                                    </span>
                                    {activeStatusId === app.id && (
                                        <div className="absolute z-10 top-10 left-0 flex gap-2 p-2 bg-white shadow-lg rounded-full border border-gray-200 animate-fadeIn">
                                            {Object.keys(statusColors).map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(app.id, status)}
                                                    className={`text-xs px-3 py-1 rounded-full font-medium transition transform hover:scale-110 ${statusColors[status]}`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-3 text-blue-600 underline text-center">
                                    <a href={app.link} target="_blank" rel="noopener noreferrer">View</a>
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <input
                                        type="text"
                                        value={app.notes}
                                        onChange={(e) => handleNoteChange(app.id, e.target.value)}
                                        onBlur={handleBlur}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="px-6 py-3 flex justify-center gap-4 text-center">
                                    {/* Update Icon */}
                                    <button
                                        onClick={() => console.log(`Update row with ID: ${app.id}`)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Update"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.5 1.5-4.5L16.862 3.487z"
                                            />
                                        </svg>
                                    </button>

                                    {/* Delete Icon */}
                                    <button
                                        onClick={() => console.log(`Delete row with ID: ${app.id}`)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Animation Styles */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
