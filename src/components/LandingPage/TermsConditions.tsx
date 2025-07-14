"use client";

import { X } from "lucide-react";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50">
      <div
        className="w-[90%] max-w-2xl max-h-[80vh] border-[2px] border-[#5B5B99] rounded-[25px] relative hover:scale-[1.05] transition-transform duration-300 px-8 pb-6 pt-4 flex flex-col justify-between text-gray-900 dark:text-white bg-white dark:bg-gray-900"
        style={{
          boxShadow: "inset 0 0 25px 8px rgba(91, 91, 153, 0.6)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">Terms and Conditions</h2>

        {/* Scrollable Content */}
        <div className="overflow-y-auto text-sm pr-2 space-y-4 max-h-[60vh]">
          <div>
            <h3 className="font-bold">1. Overview</h3>
            <p>
              You accept these terms of service, all relevant laws and regulations...
            </p>
          </div>

          <div>
            <h3 className="font-bold">2. Use License</h3>
            <p>
              One copy of the content on the FormSpace website may be downloaded temporarily...
            </p>
            <ul className="list-disc ml-5">
              <li>Alter or duplicate the content</li>
              <li>Use for public exhibition</li>
              <li>Reverse engineer software</li>
              <li>Mirror content on another server</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold">3. Disclaimer</h3>
            <p>
              The information is provided &qout;as is&qout;... FormSpace disclaims all guarantees.
            </p>
          </div>

          <div>
            <h3 className="font-bold">4. Material Accuracy</h3>
            <p>
              There may be typographical or technical errors. FormSpace may update content.
            </p>
          </div>

          <div>
            <h3 className="font-bold">5. Links</h3>
            <p>
              FormSpace is not responsible for linked websites&apos; content.
            </p>
          </div>

          <div>
            <h3 className="font-bold">6. Fair Usage</h3>
            <p>
              Use the platform responsibly. Do not misuse.
            </p>
          </div>

          <div>
            <h3 className="font-bold">7. Adjustments</h3>
            <p>
              Terms may change at any time without notice.
            </p>
          </div>

          <div>
            <h3 className="font-bold">8. Governing Law</h3>
            <p>
              Governed by Indian law and jurisdiction.
            </p>
          </div>
        </div>

        {/* Accept Button */}
        <button
          onClick={onClose}
          className="mt-6 py-2 bg-[#61A986] text-white rounded hover:bg-green-700 cursor-pointer"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
