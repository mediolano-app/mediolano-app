'use client';

import React from 'react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
    className = ''
}) => {
    return (
        <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
                </div>
                {onRetry && (
                    <div className="ml-3">
                        <button
                            onClick={onRetry}
                            className="text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};