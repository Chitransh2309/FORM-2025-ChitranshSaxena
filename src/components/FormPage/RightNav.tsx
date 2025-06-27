"use client";

import React from "react";
import Dropdown from "./RightNavDropdown";

export default function RightNav() {
  // const [type, isType] = useState("Text");

  return (
    <div className="p-4 mt-8">
      <p className="mb-5 font-semibold">Description</p>
      <Dropdown />
    </div>
  );
}
