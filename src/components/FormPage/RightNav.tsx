"use client";

import React from "react";
import Dropdown from "./RightNavDropdown";

export default function RightNav() {
  return (
    <div className=" p-6 w-full h-full overflow-y-auto">
      <p className="mb-4 font-semibold text-lg">Description</p>
      <Dropdown />
    </div>
  );
}
