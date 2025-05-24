import React from 'react';

type Props = {
  user?: { picture?: string; displayName: string };
  logoutLoading: boolean;
  onLogout: () => void;
};

export default function DashboardHeader({ user, logoutLoading, onLogout }: Props) {
  return (
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
      {logoutLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-red-600"
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
        <button
          onClick={onLogout}
          className={`bg-red-500 border border-white text-white px-4 py-2 rounded-3xl hover:bg-white hover:text-black hover:border-black shadow-lg flex items-center gap-2 ${logoutLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={logoutLoading}
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
              d="M17 16l4-4-4-4m5 4H9M4 4h7a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
          </svg>
          Logout
        </button>
      )}
    </header>
  );
}