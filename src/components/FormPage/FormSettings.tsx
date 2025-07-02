'use client';

import { useState, useEffect } from 'react';
import { updateFormSettings } from '@/app/action/forms';
import { Form, FormSettings } from '@/lib/interface'; // Adjust the import path as necessary

interface FormSettingsProps {
  formId: string;
  initialSettings?: FormSettings;
  onClose: () => void;
}

const FormSettings = ({
  formId,
  initialSettings,
  onClose,
}: FormSettingsProps) => {
  const [settings, setSettings] = useState<FormSettings>(initialSettings || {});
  const [startDate, setStartDate] = useState<Date>(
    initialSettings?.startDate
      ? new Date(initialSettings.startDate)
      : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    initialSettings?.endDate ? new Date(initialSettings.endDate) : new Date()
  );

  const handleChange = (e: { target: any }) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    const result = await updateFormSettings({ formId : formId, settings: settings});
    console.log('Settings updated:', result);
    setSettings(result.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Form Settings</h2>
          <button
            onClick={onClose}
            className="text-xl text-black font-bold hover:text-red-500"
          >
            x
          </button>
        </div>

        {/* Form Availability */}
        <div className="border border-gray-500 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-lg text-gray-900">Form Availability</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Start DateTime */}
            <div className="flex flex-col gap-2">
              <label className="font-medium">Start Date</label>
              <div className="border border-gray-500 fill-gray-500 text-black rounded px-2 py-2 flex-1">
                <input
                  type="date"
                  className="w-full bg-transparent border-none outline-none"
                  value={startDate.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setStartDate(
                      (prev) =>
                        new Date(
                          `${e.target.value}T${
                            prev.toTimeString().split(' ')[0]
                          }`
                        )
                    )
                  }
                />
              </div>

              <label className="font-medium">Start Time</label>
              <div className="border border-gray-500 fill-gray-500 text-black rounded px-2 py-2 flex-1">
                <input
                  type="time"
                  className="w-full bg-transparent border-none outline-none"
                  value={startDate.toTimeString().split(' ')[0].slice(0, 5)}
                  onChange={(e) =>
                    setStartDate((prev) => {
                      const datePart = prev.toISOString().split('T')[0];
                      return new Date(`${datePart}T${e.target.value}`);
                    })
                  }
                />
              </div>
            </div>

            {/* End DateTime */}
            <div className="flex flex-col gap-2">
              <label className="font-medium">End Date</label>
              <div className="border border-gray-500 fill-gray-500 text-black rounded px-2 py-2 flex-1">
                <input
                  type="date"
                  className="w-full bg-transparent border-none outline-none"
                  value={endDate.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setEndDate(
                      (prev) =>
                        new Date(
                          `${e.target.value}T${
                            prev.toTimeString().split(' ')[0]
                          }`
                        )
                    )
                  }
                />
              </div>

              <label className="font-medium">End Time</label>
              <div className="border border-gray-500 fill-gray-500 text-black rounded px-2 py-2 flex-1">
                <input
                  type="time"
                  className="w-full bg-transparent border-none outline-none"
                  value={endDate.toTimeString().split(' ')[0].slice(0, 5)}
                  onChange={(e) =>
                    setEndDate((prev) => {
                      const datePart = prev.toISOString().split('T')[0];
                      return new Date(`${datePart}T${e.target.value}`);
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Controls
        <div className="border border-gray-500 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-lg text-gray-900">User Controls</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Select User
              </label>
              <div className="border border-gray-500 fill-gray-500 text-black rounded px-2 py-2 flex-1">
                <select className="w-full bg-transparent border-none outline-none">
                  <option value="">select email id</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Assign Roles
              </label>
              <div className="border border-gray-500 fill-gray-500 text-black rounded px-2 py-2 flex-1">
                <select className="w-full bg-transparent border-none outline-none">
                  <option value="">select role</option>
                </select>
              </div>
            </div>
          </div>
        </div> */}

        {/* General Settings */}
        <div className="border border-gray-500 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-lg text-gray-900">General</h3>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                Count Number of Tab Switches
              </span>
              <input
                type="checkbox"
                className="scale-125"
                checked={settings.tab_switch_count === 0 || false}
                onChange={(e) => {
                  handleChange({
                    target: {
                      name: 'tab_switch_count',
                      type: 'checkbox',
                      checked: e.target.checked,
                    },
                  });
                  setSettings((prev) => ({
                    ...prev,
                    tab_switch_count: e.target.checked ? 0 : undefined,
                  }));
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                Allow Users To Receive A Copy Via Email
              </span>
              <input
                type="checkbox"
                checked={settings.copy_via_email || false}
                onChange={(e) => {
                  handleChange({
                    target: {
                      name: 'tab_switch_count',
                      type: 'checkbox',
                      checked: e.target.checked,
                    },
                  });
                  setSettings((prev) => ({
                    ...prev,
                    copy_via_email: e.target.checked ? true : false,
                  }));
                }}
                className="scale-125"
              />
            </div>
            {/* <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                Close Form
              </span>
              <input
                type="checkbox"
                checked={settings.endDate || false}
                   onChange={(e) => {
                  handleChange({
                    target: {
                      name: 'tab_switch_count',
                      type: 'checkbox',
                      checked: e.target.checked,
                    },
                  });
                  setSettings((prev) => ({
                    ...prev,
                    tab_switch_count: e.target.checked ? 0 : undefined,
                  }));
                }}
                className="scale-125"
              />
            </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 bg-[#61A986] text-white rounded-lg hover:bg-[#4d8a6b] cursor-pointer"
            onClick={handleSave}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSettings;
