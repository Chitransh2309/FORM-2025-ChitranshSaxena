"use client";

import React from "react";
import Dropdown from "./right-nav-dropdown";

export default function RightNav() {
  // const [type, isType] = useState("Text");

  return (
    <div className="m-10">
      <p className="mb-5 font-semibold">Description</p>
      <Dropdown />
    </div>
  );
}
