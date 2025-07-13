"use client";

import React, { useState } from "react";

interface ContactProps {
  onClose: () => void;
  user_ID: string;
}

export default function Contact({ onClose, user_ID }: ContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_ID, name, email, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Error saving contact:", data.message);
        alert("Failed to save contact: " + (data.message || "Unknown error"));
        return;
      }

      // Optional: show a toast/snackbar instead of alert
      alert("Contact saved successfully!");
      onClose(); // Close popup
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to save contact.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded shadow-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold dark:text-white mb-4">
          Contact Us
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              disabled={loading}
              className="mt-1 w-full p-2 border rounded"
            />
          </label>

          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              disabled={loading}
              className="mt-1 w-full p-2 border rounded"
            />
          </label>

          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              placeholder="Your message"
              disabled={loading}
              className="mt-1 w-full p-2 border rounded"
            />
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
