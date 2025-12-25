import type { FC } from 'react';

type StepProgressProps = {
  current: number;
  total: number;
  title: string;
  description?: string;
};

export const StepProgress: FC<StepProgressProps> = ({
  current,
  total,
  title,
  description,
}) => {
  const percentage = (current / total) * 100;
  const radius = 24;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="transform -rotate-90"
            width="56"
            height="56"
          >
            <circle
              className="text-gray-200"
              cx="28"
              cy="28"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
            />
            <circle
              className="text-indigo-500 transition-all duration-300"
              cx="28"
              cy="28"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
            />
          </svg>
          <span className="absolute text-sm font-semibold text-gray-700">
            {current}/{total}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {description != null && (
            <p className="text-sm text-gray-500 truncate">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
