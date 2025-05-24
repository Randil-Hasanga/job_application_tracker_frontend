import React from 'react';
import illustration from '../assets/nothing_found.png';

type Props = {
  onAdd: () => void;
};

export default function DashboardEmpty({ onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img src={illustration} alt="No applications" className="w-90 h-80 mb-6" />
      <h2 className="text-xl font-semibold text-gray-700 mb-4">No applications found</h2>
      <button
        onClick={onAdd}
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
  );
}