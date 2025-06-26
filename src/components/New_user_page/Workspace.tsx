"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Formsorter from "./Formsorter";
import Drafts from "./Drafts";
import Published from "./Published";
import Newuser from "./Newuser";
import { getFormsForUser } from "@/app/action/forms";
import { Form } from "@/lib/interface";

export default function Workspace() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForms() {
      const res = await getFormsForUser();
      setForms(res);
      setLoading(false);
    }

    fetchForms();
  }, []);

  const drafts = forms.filter((f) => !f.isActive);
  const published = forms.filter((f) => f.isActive);

  console.log("Drafts:", drafts);
  console.log("Published:", published);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <Formsorter />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          Loading...
        </div>
      ) : drafts.length === 0 && published.length === 0 ? (
        <Newuser />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Drafts forms={drafts} />
          <Published forms={published} />
        </div>
      )}
    </div>
  );
}
