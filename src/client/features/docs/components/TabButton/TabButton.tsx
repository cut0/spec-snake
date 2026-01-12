import type { FC } from 'react';

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export const TabButton: FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    type="button"
    className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 ${
      isActive
        ? 'text-indigo-600 border-b-2 border-indigo-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);
