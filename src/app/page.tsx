import Image from "next/image";

import LeftPanel from "./components/left-panel";
import { Homemade_Apple } from "next/font/google";

export default function Home() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <LeftPanel />
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex items-center justify-center w-full h-screen">
          Hello. This is the form project cycle 2025.
        </div>
      </div>
    </div>
  );
}
