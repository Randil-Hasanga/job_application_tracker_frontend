import React from 'react';

type Application = {
  _id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  vacancy_link: string;
  notes: string;
};

type Props = {
  paginatedApps: Application[];
  statusColors: Record<string, string>;
  editableRowId: string | null;
  loadingRowId: string | null;
  activeStatusId: string | null;
  deleteConfirmationId: string | null;
  setApps: React.Dispatch<React.SetStateAction<Application[]>>;
  apps: Application[];
  handleStatusChange: (id: string, status: Application['status']) => void;
  handleNoteChange: (id: string, note: string) => void;
  handleUpdateToggle: (id: string) => void;
  handleSaveRow: (id: string) => void;
  setActiveStatusId: (id: string | null) => void;
  setDeleteConfirmationId: (id: string | null) => void;
  handleDelete: (id: string) => void;
};

export default function DashboardTable({
  paginatedApps,
  statusColors,
  editableRowId,
  loadingRowId,
  activeStatusId,
  deleteConfirmationId,
  setApps,
  apps,
  handleStatusChange,
  handleNoteChange,
  handleUpdateToggle,
  handleSaveRow,
  setActiveStatusId,
  setDeleteConfirmationId,
  handleDelete,
}: Props) {
  return (
    <table className="min-w-full divide-y divide-gray-200 text-sm relative border rounded-3xl">
      <thead className="dark:bg-indigo-200 text-gray-600 text-left">
        <tr>
          <th className="px-3 sm:px-6 py-3 font-semibold text-center"></th>
          <th className="px-3 sm:px-6 py-3 font-semibold text-center">Company</th>
          <th className="px-3 sm:px-6 py-3 font-semibold text-center">Role</th>
          <th className="px-3 sm:px-6 py-3 font-semibold text-center hidden sm:table-cell">Date Applied</th>
          <th className="px-3 sm:px-6 py-3 font-semibold text-center hidden sm:table-cell">Status</th>
          <th className="px-3 sm:px-6 py-3 font-semibold text-center hidden sm:table-cell">Job Link</th>
          <th className="px-3 sm:px-6 py-3 font-semibold text-center hidden sm:table-cell">Notes</th>
          <th className="px-3 sm:px-6 py-3 font-semibold text-left"></th>
          <th className="px-3 sm:px-6 py-3 font-semibold text-center"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 text-gray-700">
        {paginatedApps.map(app => (
          <tr key={app._id} className="relative">
            <td className="px-3 sm:px-6 py-3 text-center"></td>
            <td className="px-3 sm:px-6 py-3 text-center">
              {editableRowId === app._id ? (
                <input
                  type="text"
                  value={app.company}
                  onChange={(e) =>
                    setApps(apps.map(a => a._id === app._id ? { ...a, company: e.target.value } : a))
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm sm:text-base"
                />
              ) : (
                app.company
              )}
            </td>
            <td className="px-3 sm:px-6 py-3 text-center">
              {editableRowId === app._id ? (
                <input
                  type="text"
                  value={app.role}
                  onChange={(e) =>
                    setApps(apps.map(a => a._id === app._id ? { ...a, role: e.target.value } : a))
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm sm:text-base"
                />
              ) : (
                app.role
              )}
            </td>
            <td className="px-3 sm:px-6 py-3 text-center hidden sm:table-cell">
              {new Date(app.dateApplied).toLocaleDateString()}
            </td>
            <td className="px-3 sm:px-6 py-3 relative text-center hidden sm:table-cell">
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
                      onClick={() => handleStatusChange(app._id, status as Application['status'])}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition transform hover:scale-110 ${statusColors[status]}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </td>
            <td className="px-3 sm:px-6 py-3 text-center hidden sm:table-cell">
              {editableRowId === app._id ? (
                <input
                  type="text"
                  value={app.vacancy_link}
                  onChange={(e) =>
                    setApps(apps.map(a => a._id === app._id ? { ...a, vacancy_link: e.target.value } : a))
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm sm:text-base"
                />
              ) : (
                <a
                  href={app.vacancy_link.startsWith('http') ? app.vacancy_link : `https://${app.vacancy_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm sm:text-base"
                >
                  View
                </a>
              )}
            </td>
            <td className="px-3 sm:px-6 py-3 text-center hidden sm:table-cell">
              <input
                type="text"
                value={app.notes}
                onChange={(e) => handleNoteChange(app._id, e.target.value)}
                onBlur={() => setActiveStatusId(null)}
                className="border border-gray-300 rounded px-2 py-1 w-full text-sm sm:text-base"
              />
            </td>
            <td className="px-3 sm:px-6 py-3 flex justify-center gap-2 sm:gap-4 text-center relative items-center">
              {editableRowId === app._id ? (
                <button
                  onClick={() => handleSaveRow(app._id)}
                  className={`text-green-600 hover:text-green-800 flex items-center justify-center ${loadingRowId === app._id ? 'opacity-70 cursor-not-allowed' : ''}`}
                  title="Save"
                  disabled={loadingRowId === app._id}
                >
                  {loadingRowId === app._id ? (
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              ) : (
                <button onClick={() => handleUpdateToggle(app._id)} className="text-blue-600 hover:text-blue-800" title="Update">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.5 1.5-4.5L16.862 3.487z" />
                  </svg>
                </button>
              )}
              {deleteConfirmationId === app._id ? (
                <div className="flex gap-2 border border-gray-300 rounded px-2 py-1 animate-fadeIn bg-slate-50">
                  <button onClick={() => handleDelete(app._id)} className="text-green-600 hover:text-green-800" title="Confirm Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteConfirmationId(null)} className="text-red-600 hover:text-red-800" title="Cancel Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirmationId(app._id)} className="text-red-600 hover:text-red-800" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75V3a3 3 0 013-3h0a3 3 0 013 3v.75m6.75 0H3.75m16.5 0a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75m0 0L5.25 21a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25L20.25 3.75H3.75z" />
                  </svg>
                </button>
              )}
            </td>
            <td className="px-3 sm:px-6 py-3 text-center"></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}