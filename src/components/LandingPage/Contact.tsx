"use client";

import React, { useState } from "react";
import { Instagram, Mail as MailIcon, X } from "lucide-react";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

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
        alert("Failed to send: " + (data.message || "Unknown error"));
        return;
      }

      alert("Message sent!");
      onClose();
    } catch (err) {
      alert("Something went wrong: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 ${manrope.className} hidden sm:flex`}
    >
      <div className="w-[793px] h-[617px] bg-white dark:bg-[#000000] border-[5px] border-[#4B795F] rounded-[25px] shadow-[inset_0px_4px_40px_3px_#4B795F] relative transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black dark:text-white hover:text-red-400 transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex w-full justify-start items-center px-10 md:flex-row h-full rounded-[25px] overflow-hidden">
          {/* Left: Contact Info */}
          <div className="absolute flex w-full justify-start bg-[#CCCCCC] dark:bg-[#CCCCCC] md:h-[50%] md:w-[40%] p-10 flex-col gap-12 rounded-[10px]">
            <h2 className="text-3xl font-bold text-black text-center">Contact us</h2>

            <div className="flex items-center gap-3 text-black">
              <Instagram className="w-5 h-5" strokeWidth={2} />
              <a
                href="https://www.instagram.com/acmvit?igsh=MTRmM2g0aWhxYzg0cA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium"
              >
                acmvit
              </a>
            </div>

            <div className="flex items-center gap-3 text-black">
              <MailIcon className="w-5 h-5" strokeWidth={2} />
              <a
                href="mailto:form.ktech800@gmail.com"
                className="text-base font-medium underline"
              >
                form.ktech800@gmail.com
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full flex justify-end">
            <div className="flex justify-end items-end bg-[#4B795F] w-[85%] h-2/3 p-4 pr-20 flex-col text-white rounded-[10px] dark:bg-[#4B795F]">
              <div className="flex flex-col justify-end w-1/2">
                <h2 className="text-3xl font-bold mt-6 mb-2 text-white">Get in touch</h2>
                <p className="text-sm mb-5 text-white">Feel free to drop us a line below!</p>

                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    disabled={loading}
                    className="w-full p-3 mb-4 rounded bg-[#D1D1D1] text-black placeholder:text-gray-600"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    disabled={loading}
                    className="w-full p-3 mb-4 rounded bg-[#D1D1D1] text-black placeholder:text-gray-600"
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here"
                    rows={4}
                    required
                    disabled={loading}
                    className="w-full p-3 mb-5 rounded bg-[#D1D1D1] text-black placeholder:text-gray-600"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 mb-6 py-2 bg-[#D1D1D1] text-black font-bold rounded hover:opacity-90 transition"
                  >
                    {loading ? "Sending..." : "SEND"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    /// Mobile Version
    
    <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center p-4 ${manrope.className} sm:hidden">
  <div className="relative p-8 max-w-md w-full bg-white dark:bg-[#000000] border-[5px] border-[#4B795F] rounded-[25px] shadow-[inset_0px_4px_40px_3px_#4B795F] transition-colors">

    {/* Close button fixed to top-right */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-black dark:text-white hover:text-red-400 transition"
    >
      <X className="w-6 h-6" />
    </button>

    <div className="bg-[#4B795F] p-6 rounded-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-white text-3xl font-bold mb-2">Get in touch</h1>
        <p className="text-green-100 text-sm">Feel free to drop us a line below!</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          disabled={loading}
          className="w-full p-3 rounded bg-[#D1D1D1] text-black placeholder-gray-600 focus:outline-none focus:ring-2  transition"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          disabled={loading}
          className="w-full p-3 rounded bg-[#D1D1D1] text-black placeholder-gray-600 focus:outline-none focus:ring-2  transition"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          rows={4}
          required
          disabled={loading}
          className="w-full p-3 rounded bg-[#D1D1D1] text-black placeholder-gray-600 resize-none focus:outline-none focus:ring-2  transition"
        />

        <div className="w-full flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 p-3 bg-[#CCCCCC] hover:bg-[#BBBBBB] text-black font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2  focus:ring-offset-2 focus:r"
          >
            {loading ? "Sending..." : "SEND"}
          </button>
        </div>
      </form>

      {/* Contact Info */}
      <div className="bg-[#CCCCCC] p-4 rounded-lg">
        <h2 className="text-black text-xl font-bold mb-3">Contact us</h2>
        <div className="space-y-2">
          <div className="flex items-center text-black">
            <Instagram className="w-5 h-5 mr-3" />
            <a
              href="https://www.instagram.com/acmvit?igsh=MTRmM2g0aWhxYzg0cA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium"
            >
              acmvit
            </a>
          </div>

          <div className="flex items-center text-black">
            <MailIcon className="w-5 h-5 mr-3" />
            <a
              href="mailto:form.ktech800@gmail.com"
              className="text-base font-medium underline"
            >
              form.ktech800@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
}
