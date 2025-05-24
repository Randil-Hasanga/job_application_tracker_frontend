import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

type Props = {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  onAdd: () => void;
};

export default function DashboardFilters({ statusFilter, setStatusFilter, search, setSearch, onAdd }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
      <div className="relative sm:w-56">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="appearance-none border border-gray-300 rounded-3xl px-4 py-2 w-full sm:w-full pr-10"
        >
          <option value="">Filter by status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <ChevronDownIcon
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
        />
      </div>
      <input
        type="text"
        placeholder="Search by company or role"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border border-gray-300 rounded-3xl px-4 py-2 w-full sm:w-auto sm:flex-grow"
      />
      <button
        onClick={onAdd}
        className="bg-blue-600 border border-white text-white px-4 py-2 rounded-3xl hover:bg-white hover:text-black hover:border-black shadow-lg flex items-center justify-center sm:justify-start gap-2  sm:w-auto"
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
        <span>Add&nbsp;Application</span>
      </button>
    </div>
  );
}