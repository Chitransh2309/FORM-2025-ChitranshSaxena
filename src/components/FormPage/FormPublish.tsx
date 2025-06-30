"use client";

import { Copy } from "lucide-react";

interface FormPublishModalProps {
  formLink: string;
  onClose: () => void;
}

export default function FormPublishModal({ formLink, onClose }: FormPublishModalProps) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none backdrop-blur-[3px]">
      <div className="bg-white dark:bg-neutral-800 text-black dark:text-white w-[90%] sm:w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-neutral-700 relative pointer-events-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white text-2xl sm:text-xl font-semibold"
        >
          ×
        </button>

        {/* Heading */}
        <div className="text-center mb-6 mt-2 sm:mt-0">
          <h2 className="text-xl sm:text-2xl font-semibold">Boom! Your form is live 🎉</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Time to sit back, relax, and let the responses roll in.
          </p>
        </div>

        {/* Share Box */}
        <div className="border border-gray-200 dark:border-neutral-600 rounded-lg p-4 bg-gray-50 dark:bg-neutral-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🔗 Share with link</p>
          
          <div className="flex items-center gap-2 flex-wrap">
            <input
              value={formLink}
              readOnly
              className="flex-1 min-w-[70%] px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 text-gray-800 dark:text-white"
            />
            <button
              onClick={() => navigator.clipboard.writeText(formLink)}
              className="p-2 bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 rounded-md"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4 text-gray-700 dark:text-white" />
            </button>
          </div>

          <button
            onClick={() => window.open(formLink, "_blank")}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-md"
          >
            Open in new tab
          </button>
        </div>
      </div>
    </div>
  );
}
