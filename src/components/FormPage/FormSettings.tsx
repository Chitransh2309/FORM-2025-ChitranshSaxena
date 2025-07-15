"use client";

import { useState } from "react";
import { updateFormSettings } from "@/app/action/forms";
import { addEditor, addViewer } from "@/app/action/addEditorAndViewer";
import { FormSettings as FormSettingsType } from "@/lib/interface";

// ─────────────────────────────────────────────────────────────────────────
// types ------------------------------------------------------------------
type FormSettingsKey = keyof FormSettingsType;

interface FormSettingsInputEvent {
  target: {
    name: FormSettingsKey;
    type: string;
    value?: string | number | boolean;
    checked?: boolean;
  };
}

interface FormSettingsProps {
  formId: string;
  formSettings: FormSettingsType;
  setFormSettings: React.Dispatch<React.SetStateAction<FormSettingsType>>;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────
const FormSettings = ({
  formId,
  formSettings,
  setFormSettings,
  onClose,
}: FormSettingsProps) => {
  /* dates */
  const [startDate, setStartDate] = useState<Date>(
    formSettings?.startDate ? new Date(formSettings.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    formSettings?.endDate ? new Date(formSettings.endDate) : new Date()
  );

  /* role-based sharing */
  const [editorEmail, setEditorEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"editor" | "viewer">(
    "editor"
  );

  /* generic field handler */
  const handleChange = (e: FormSettingsInputEvent) => {
    const { name, value, type, checked } = e.target;
    setFormSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* save */
  const handleSave = async () => {
    const updated = {
      ...formSettings,
      startDate,
      endDate,
      timingEnabled: formSettings?.timingEnabled ?? true,
    };

    const res = await updateFormSettings(formId, updated);
    setFormSettings(res.data.settings);

    if (editorEmail.trim()) {
      const fn = selectedRole === "editor" ? addEditor : addViewer;
      const out = await fn(formId, editorEmail.trim());
      if (!out?.success)
        alert(`Failed to add ${selectedRole}: ${out?.message}`);
    }

    onClose();
  };

  /* ──────────────────────────────────────────── render ─────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-[#2c2c2c] rounded-2xl shadow-xl w-full max-w-3xl
                   p-6 overflow-y-auto max-h-[90vh] text-black dark:text-white"
      >
        {/* header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Form Settings</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* availability */}
        <div
          className="border border-gray-500 dark:border-gray-600
                     rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Form Availability</h3>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formSettings?.timingEnabled ?? true}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "timingEnabled",
                      type: "checkbox",
                      checked: e.target.checked,
                    },
                  })
                }
              />
              <div
                className="w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full
                           peer peer-checked:bg-[#61A986] after:content-['']
                           after:absolute after:top-[2px] after:left-[2px]
                           after:bg-white after:dark:bg-gray-200 after:rounded-full
                           after:h-5 after:w-5 after:transition-all
                           peer-checked:after:translate-x-full"
              />
            </label>
          </div>

          {formSettings?.timingEnabled && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* start */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Start Date</label>
                <div
                  className="border border-gray-500 dark:border-gray-600
                             rounded-xl px-2 py-2"
                >
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none"
                    value={
                      isNaN(startDate.getTime())
                        ? ""
                        : startDate.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setStartDate((prev) => {
                        const timePart = isNaN(prev.getTime())
                          ? "00:00:00.000Z"
                          : prev.toISOString().split("T")[1];
                        const sel = new Date(`${e.target.value}T${timePart}`);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (sel < today) {
                          alert("Start date cannot be in the past.");
                          return prev;
                        }
                        return sel;
                      })
                    }
                  />
                </div>

                <label className="font-medium">Start Time</label>
                <div
                  className="border border-gray-500 dark:border-gray-600
                             rounded-xl px-2 py-2"
                >
                  <input
                    type="time"
                    className="w-full bg-transparent outline-none"
                    value={
                      isNaN(startDate.getTime())
                        ? ""
                        : startDate.toTimeString().slice(0, 5)
                    }
                    onChange={(e) =>
                      setStartDate((prev) => {
                        const datePart = isNaN(prev.getTime())
                          ? new Date().toISOString().split("T")[0]
                          : prev.toISOString().split("T")[0];
                        const newStart = new Date(
                          `${datePart}T${e.target.value}`
                        );
                        if (newStart < new Date()) {
                          alert("Start time cannot be in the past.");
                          return prev;
                        }
                        return newStart;
                      })
                    }
                  />
                </div>
              </div>

              {/* end */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">End Date</label>
                <div
                  className="border border-gray-500 dark:border-gray-600
                             rounded-xl px-2 py-2"
                >
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none"
                    value={
                      isNaN(endDate.getTime())
                        ? ""
                        : endDate.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setEndDate((prev) => {
                        const tp = isNaN(prev.getTime())
                          ? "00:00:00.000Z"
                          : prev.toISOString().split("T")[1];
                        const sel = new Date(`${e.target.value}T${tp}`);
                        if (sel < startDate) {
                          alert("End date must be after start date.");
                          return prev;
                        }
                        return sel;
                      })
                    }
                  />
                </div>

                <label className="font-medium">End Time</label>
                <div
                  className="border border-gray-500 dark:border-gray-600
                             rounded-xl px-2 py-2"
                >
                  <input
                    type="time"
                    className="w-full bg-transparent outline-none"
                    value={
                      isNaN(endDate.getTime())
                        ? ""
                        : endDate.toTimeString().slice(0, 5)
                    }
                    onChange={(e) =>
                      setEndDate((prev) => {
                        const datePart = isNaN(prev.getTime())
                          ? new Date().toISOString().split("T")[0]
                          : prev.toISOString().split("T")[0];
                        const newEnd = new Date(
                          `${datePart}T${e.target.value}`
                        );
                        const sameDay =
                          datePart === startDate.toISOString().split("T")[0];
                        if (
                          sameDay &&
                          newEnd.getTime() - startDate.getTime() < 60000
                        ) {
                          alert(
                            "End time must be at least 1 minute after start time."
                          );
                          return prev;
                        }
                        return newEnd;
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* user controls */}
        <div
          className="border border-gray-500 dark:border-gray-600
                     rounded-xl p-4 mb-6"
        >
          <h3 className="font-bold text-lg">User Controls</h3>

          <div className="grid grid-cols-2 mt-4 gap-4">
            <div>
              <label className="font-medium">Select User</label>
              <div
                className="border border-gray-500 dark:border-gray-600
                           rounded-xl px-2 py-2"
              >
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Type Email ID"
                  value={editorEmail}
                  onChange={(e) => setEditorEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="font-medium">Assign Role</label>
              <div
                className="border border-gray-500 dark:border-gray-600
                           rounded-xl px-2 py-2"
              >
                <select
                  className="w-full bg-transparent outline-none"
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as "editor" | "viewer")
                  }
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* general toggles */}
        <div
          className="border border-gray-500 dark:border-gray-600
                     rounded-xl p-4 mb-6"
        >
          <h3 className="font-bold text-lg">General</h3>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">
                Count Number of Tab Switches
              </span>
              <input
                type="checkbox"
                className="scale-125"
                checked={formSettings?.tab_switch_count || false}
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
              <span className="text-sm font-bold">
                Allow Users To Receive A Copy Via Email
              </span>
              <input
                type="checkbox"
                className="scale-125"
                checked={formSettings?.copy_via_email || false}
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

        {/* action buttons */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-5 py-2 bg-gray-200 dark:bg-gray-600
                       text-gray-800 dark:text-white rounded-lg
                       hover:bg-gray-300 dark:hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-[#61A986] hover:bg-[#4d8a6b]
                       text-white rounded-lg"
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
