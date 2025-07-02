"use client";

import { useState } from "react";
import { updateFormSettings } from "@/app/action/forms";
import { FormSettings as FormSettingsType } from "@/lib/interface";

interface FormSettingsProps {
  formId: string;
  formSettings: FormSettingsType;
  setFormSettings: (settings: FormSettingsType) => void;
  onClose: () => void;
}

const FormSettings = ({
  formId,
  formSettings,
  setFormSettings,
  onClose,
}: FormSettingsProps) => {
  const [startDate, setStartDate] = useState<Date>(
    formSettings?.startDate ? new Date(formSettings.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    formSettings?.endDate ? new Date(formSettings.endDate) : new Date()
  );

  const handleChange = (e: { target: any }) => {
    const { name, value, type, checked } = e.target;
    setFormSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    const updatedSettings = {
      ...formSettings,
      startDate,
      endDate,
    };

    const result = await updateFormSettings(formId, updatedSettings);
    console.log("Settings updated:", result.data.settings);
    setFormSettings(result.data.settings);
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
              <div className="border border-gray-500 text-black rounded px-2 py-2">
                <input
                  type="date"
                  className="w-full bg-transparent border-none outline-none"
                  value={startDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setStartDate(
                      (prev) =>
                        new Date(
                          `${e.target.value}T${
                            prev.toTimeString().split(" ")[0]
                          }`
                        )
                    )
                  }
                />
              </div>

              <label className="font-medium">Start Time</label>
              <div className="border border-gray-500 text-black rounded px-2 py-2">
                <input
                  type="time"
                  className="w-full bg-transparent border-none outline-none"
                  value={startDate.toTimeString().split(" ")[0].slice(0, 5)}
                  onChange={(e) =>
                    setStartDate((prev) => {
                      const datePart = prev.toISOString().split("T")[0];
                      return new Date(`${datePart}T${e.target.value}`);
                    })
                  }
                />
              </div>
            </div>

            {/* End DateTime */}
            <div className="flex flex-col gap-2">
              <label className="font-medium">End Date</label>
              <div className="border border-gray-500 text-black rounded px-2 py-2">
                <input
                  type="date"
                  className="w-full bg-transparent border-none outline-none"
                  value={endDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setEndDate(
                      (prev) =>
                        new Date(
                          `${e.target.value}T${
                            prev.toTimeString().split(" ")[0]
                          }`
                        )
                    )
                  }
                />
              </div>

              <label className="font-medium">End Time</label>
              <div className="border border-gray-500 text-black rounded px-2 py-2">
                <input
                  type="time"
                  className="w-full bg-transparent border-none outline-none"
                  value={endDate.toTimeString().split(" ")[0].slice(0, 5)}
                  onChange={(e) =>
                    setEndDate((prev) => {
                      const datePart = prev.toISOString().split("T")[0];
                      return new Date(`${datePart}T${e.target.value}`);
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

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
                checked={formSettings.tab_switch_count || false}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "tab_switch_count",
                      type: "checkbox",
                      checked: e.target.checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                Allow Users To Receive A Copy Via Email
              </span>
              <input
                type="checkbox"
                className="scale-125"
                checked={formSettings.copy_via_email || false}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "copy_via_email",
                      type: "checkbox",
                      checked: e.target.checked,
                    },
                  })
                }
              />
            </div>
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
