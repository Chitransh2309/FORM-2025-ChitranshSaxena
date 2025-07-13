"use client";

import { useState } from "react";
import Contact from "./Contact";

export default function ContactButton({ user_ID }: { user_ID: string }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="hover:underline bg-transparent border-none p-0 cursor-pointer text-inherit font-inherit"
      >
        Contact Us
      </button>

      {show && <Contact user_ID={user_ID} onClose={() => setShow(false)} />}
    </>
  );
}
