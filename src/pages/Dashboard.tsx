import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ApplicationService from '../services/applicationService';
import { useNavigate } from 'react-router-dom';
import LoginService from '../services/loginService';

const statusColors: Record<string, string> = {
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};

type Application = {
    _id: string;
    company: string;
    role: string;
    dateApplied: string; // ISO date string
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    vacancy_link: string;
    notes: string;
};

type User = {
    _id: string;
    email: string;
    picture?: string;
    displayName: string;
};

export default function Dashboard() {
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [applications, setApplications] = useState<Application[]>([]);
    const [apps, setApps] = useState<Application[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [activeStatusId, setActiveStatusId] = useState<string | null>(null);
    const [editableRowId, setEditableRowId] = useState<string | null>(null);
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
    const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // New state for loading animation
    const [user, setUser] = useState<User>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setIsLoading(true);
                const data = await ApplicationService.getApplications();
                const userData = await LoginService.getUserData();
                setUser(userData);
                setApplications(data);
            } catch (error) {
                console.error(`Error fetching applications: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, []);

    useEffect(() => {
        setApps(applications);
    }, [applications]);

    const filteredApps = apps.filter(app =>
        (app.company.toLowerCase().includes(search.toLowerCase()) ||
            app.role.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? app.status === statusFilter : true)
    );

    const handleStatusChange = async (id: string, newStatus: 'Applied' | 'Interview' | 'Offer' | 'Rejected') => {
        const updated = apps.map(app =>
            app._id === id ? { ...app, status: newStatus } : app
        );
        setApps(updated);

        try {
            await ApplicationService.updateApplication(id, { status: newStatus }); // Send PATCH request
        } catch (error) {
            console.error(`Error updating status: ${error}`);
        }
        setActiveStatusId(null);
    };

    const handleNoteChange = async (id: string, newNote: string) => {
        const updated = apps.map(app =>
            app._id === id ? { ...app, notes: newNote } : app
        );
        setApps(updated);

        try {
            await ApplicationService.updateApplication(id, { notes: newNote });
        } catch (error) {
            console.error(`Error updating notes: ${error}`);
        }
    };

    const handleUpdateToggle = (id: string) => {
        setEditableRowId(editableRowId === id ? null : id);
    };

    const handleSaveRow = async (id: string) => {
        const updatedApp = apps.find(app => app._id === id);
        const originalApp = applications.find(app => app._id === id);

        if (!updatedApp || !originalApp) return;

        if (
            updatedApp.company === originalApp.company &&
            updatedApp.role === originalApp.role &&
            updatedApp.vacancy_link === originalApp.vacancy_link &&
            updatedApp.notes === originalApp.notes &&
            updatedApp.status === originalApp.status
        ) {
            setEditableRowId(null);
            return;
        }

        setLoadingRowId(id);
        try {
            await ApplicationService.updateApplication(id, updatedApp);
            setEditableRowId(null);
        } catch (error) {
            console.error(`Error updating application: ${error}`);
        } finally {
            setLoadingRowId(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await ApplicationService.deleteApplication(id);
            setApps(apps.filter(app => app._id !== id));
            setDeleteConfirmationId(null);
        } catch (error) {
            console.error(`Error deleting application: ${error}`);
        }
    };

    const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);

    const paginatedApps = filteredApps.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    }

    return (
        <div className="rounded-xl h-screen overflow-auto bg-gray-50 px-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="flex justify-between items-center mb-6 my-10">
                <div className="flex items-center gap-4">
                    <img
                        src={user?.picture || 'https://avatar.iran.liara.run/public/30'}
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Welcome!</h1>
                        <p className="text-sm text-gray-600">{user?.displayName}</p>
                    </div>
                </div>
                <nav className="space-x-6 text-sm text-gray-700 font-medium">
                    <Link to="/" className="hover:text-blue-600">Dashboard</Link>
                </nav>
            </header>
            {filteredApps.length === 0 ? (
                <>
                    <div className="flex gap-4 mb-4">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-3xl px-4 py-2 w-56"
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
                            className="border border-gray-300 rounded-3xl px-4 py-2 flex-grow"
                        />
                        <button
                            onClick={() => navigate('/add-application')}
                            className="bg-blue-600 border border-white text-white px-4 py-2 rounded-3xl hover:bg-white hover:text-black hover:border-black shadow-lg flex items-center gap-2"
                        >
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
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-20">
                        {/* SVG illustration */}
                        <img
                            src="src/assets/nothing_found.svg"
                            alt="No Applications"
                            className="w-90 h-80 mb-6"
                        />
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">No applications found</h2>
                        <button
                            onClick={() => navigate('/add-application')}
                            className="bg-blue-600 border border-white text-white px-4 py-2 rounded-3xl hover:bg-white hover:text-black hover:border-black shadow-lg flex items-center gap-2"
                        >
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
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex gap-4 mb-4">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-3xl px-4 py-2 w-56"
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
                            className="border border-gray-300 rounded-3xl px-4 py-2 flex-grow"
                        />
                        <button
                            onClick={() => navigate('/add-application')}
                            className="bg-blue-600 border border-white text-white px-4 py-2 rounded-3xl hover:bg-white hover:text-black hover:border-black shadow-lg flex items-center gap-2"
                        >
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
                        </button>
                    </div>
                    <div className="bg-white shadow overflow-x-auto relative rounded-3xl border border-blue-200 my-10">
                        {/* Left Pagination Icon */}
                        {totalPages > 1 && (
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`z-10 absolute -left-0 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-full ${currentPage === 1 ? 'z-10 cursor-not-allowed' : ' text-black hover:text-blue-700'
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-14 h-14"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                                </svg>
                            </button>
                        )}
                        <table className="min-w-full divide-y divide-gray-200 text-sm relative border rounded-3xl">
                            <thead className="bg-blue-100 text-gray-600 text-left">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-center"></th> {/* Empty first column */}
                                    <th className="px-6 py-3 font-semibold text-center">Company</th>
                                    <th className="px-6 py-3 font-semibold text-center">Role</th>
                                    <th className="px-6 py-3 font-semibold text-center">Date Applied</th>
                                    <th className="px-6 py-3 font-semibold text-center">Status</th>
                                    <th className="px-6 py-3 font-semibold text-center">Job Link</th>
                                    <th className="px-6 py-3 font-semibold text-center">Notes</th>
                                    <th className="px-6 py-3 font-semibold text-left"></th>
                                    <th className="px-6 py-3 font-semibold text-center"></th> {/* Empty last column */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {paginatedApps.map(app => (
                                    <tr key={app._id} className="relative">
                                        <td className="px-6 py-3 text-center"></td> {/* Empty first column */}
                                        <td className="px-6 py-3 text-center">
                                            {editableRowId === app._id ? (
                                                <input
                                                    type="text"
                                                    value={app.company}
                                                    onChange={(e) =>
                                                        setApps(apps.map(a => a._id === app._id ? { ...a, company: e.target.value } : a))
                                                    }
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                />
                                            ) : (
                                                app.company
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {editableRowId === app._id ? (
                                                <input
                                                    type="text"
                                                    value={app.role}
                                                    onChange={(e) =>
                                                        setApps(apps.map(a => a._id === app._id ? { ...a, role: e.target.value } : a))
                                                    }
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                />
                                            ) : (
                                                app.role
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {new Date(app.dateApplied).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 relative text-center">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${statusColors[app.status]}`}
                                                onClick={() => setActiveStatusId(activeStatusId === app._id ? null : app._id)}
                                            >
                                                {app.status}
                                            </span>
                                            {activeStatusId === app._id && (
                                                <div className="absolute z-10 top-10 left-0 flex gap-2 p-2 bg-white shadow-lg rounded-full border border-gray-200 animate-fadeIn">
                                                    {Object.keys(statusColors).map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleStatusChange(app._id, status as 'Applied' | 'Interview' | 'Offer' | 'Rejected')}
                                                            className={`text-xs px-3 py-1 rounded-full font-medium transition transform hover:scale-110 ${statusColors[status]}`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {editableRowId === app._id ? (
                                                <input
                                                    type="text"
                                                    value={app.vacancy_link}
                                                    onChange={(e) =>
                                                        setApps(apps.map(a => a._id === app._id ? { ...a, vacancy_link: e.target.value } : a))
                                                    }
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                />
                                            ) : (
                                                <a
                                                    href={app.vacancy_link.startsWith('http') ? app.vacancy_link : `https://${app.vacancy_link}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    View
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <input
                                                type="text"
                                                value={app.notes}
                                                onChange={(e) => handleNoteChange(app._id, e.target.value)}
                                                onBlur={() => setActiveStatusId(null)}
                                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td className="px-6 py-3 flex justify-center gap-4 text-center relative items-center">
                                            {editableRowId === app._id ? (
                                                <button
                                                    onClick={() => handleSaveRow(app._id)}
                                                    className={`text-green-600 hover:text-green-800 flex items-center justify-center ${loadingRowId === app._id ? 'opacity-70 cursor-not-allowed' : ''
                                                        }`}
                                                    title="Save"
                                                    disabled={loadingRowId === app._id}
                                                >
                                                    {loadingRowId === app._id ? (
                                                        <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ) : (
                                                <button onClick={() => handleUpdateToggle(app._id)} className="text-blue-600 hover:text-blue-800" title="Update">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.5 1.5-4.5L16.862 3.487z" />
                                                    </svg>
                                                </button>
                                            )}
                                            {deleteConfirmationId === app._id ? (
                                                <div className="flex gap-2 border border-gray-300 rounded px-2 py-1 animate-fadeIn bg-slate-50">
                                                    <button onClick={() => handleDelete(app._id)} className="text-green-600 hover:text-green-800" title="Confirm Delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => setDeleteConfirmationId(null)} className="text-red-600 hover:text-red-800" title="Cancel Delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeleteConfirmationId(app._id)} className="text-red-600 hover:text-red-800" title="Delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75V3a3 3 0 013-3h0a3 3 0 013 3v.75m6.75 0H3.75m16.5 0a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75m0 0L5.25 21a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25L20.25 3.75H3.75z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center"></td> {/* Empty last column */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalPages > 1 && (
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`z-10 absolute -right-0 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-full ${currentPage === totalPages ? 'z-10 cursor-not-allowed' : ' text-black hover:text-blue-700'
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-14 h-14"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}