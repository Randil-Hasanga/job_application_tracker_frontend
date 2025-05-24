import { useEffect, useState } from 'react';
import ApplicationService from '../services/applicationService';
import { useNavigate } from 'react-router-dom';
import LoginService from '../services/loginService';
import { useAuthRedirect } from '../hooks/checkAuth';
import DashboardHeader from '../components/DashboardHeader';
import DashboardFilters from '../components/DashboardFilters';
import DashboardEmpty from '../components/DashboardEmpty';
import DashboardTable from '../components/DashboardTable';

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
  dateApplied: string;
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
  useAuthRedirect();
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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

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

  const handleStatusChange = async (id: string, newStatus: Application['status']) => {
    const updated = apps.map(app =>
      app._id === id ? { ...app, status: newStatus } : app
    );
    setApps(updated);

    try {
      await ApplicationService.updateApplication(id, { status: newStatus });
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

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const response = await LoginService.logout();
      if (response.sucess) {
        navigate('/login');
      } else {
        setLogoutLoading(false);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <div className="rounded-xl h-screen overflow-auto bg-gray-50 px-4 sm:px-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <DashboardHeader user={user} logoutLoading={logoutLoading} onLogout={handleLogout} />
      <hr className="border-t-2 border-gray-300 my-8" />
      <DashboardFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        search={search}
        setSearch={setSearch}
        onAdd={() => navigate('/add-application')}
      />
      {filteredApps.length === 0 ? (
        <DashboardEmpty onAdd={() => navigate('/add-application')} />
      ) : (
        <>
          <p className="block md:hidden text-sm text-center">
            Use a desktop device for optimal experience
          </p>
          <div className="bg-white shadow overflow-x-auto relative rounded-3xl border border-blue-200 my-5">
            {totalPages > 1 && (
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`z-10 absolute sm:-left-0 -left-7  top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-full ${currentPage === 1 ? 'z-10 cursor-not-allowed' : ' text-black hover:text-blue-700'
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
            <DashboardTable
              paginatedApps={paginatedApps}
              statusColors={statusColors}
              editableRowId={editableRowId}
              loadingRowId={loadingRowId}
              activeStatusId={activeStatusId}
              deleteConfirmationId={deleteConfirmationId}
              setApps={setApps}
              apps={apps}
              handleStatusChange={handleStatusChange}
              handleNoteChange={handleNoteChange}
              handleUpdateToggle={handleUpdateToggle}
              handleSaveRow={handleSaveRow}
              setActiveStatusId={setActiveStatusId}
              setDeleteConfirmationId={setDeleteConfirmationId}
              handleDelete={handleDelete}
            />
            {totalPages > 1 && (
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`z-10 absolute sm:-right-0 -right-6 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-full ${currentPage === totalPages ? 'z-10 cursor-not-allowed' : ' text-black hover:text-blue-700'
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