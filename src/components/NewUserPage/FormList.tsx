"use client";

import Workspace from "./Workspace";

export default function Formlist({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm?: (term: string) => void;
}) {
  return (
    <div className="h-screen">
      <Workspace searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  );
}
