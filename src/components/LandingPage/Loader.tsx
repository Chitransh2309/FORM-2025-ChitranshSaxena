import { ChaoticOrbit } from "ldrs/react";
import "ldrs/react/ChaoticOrbit.css";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25">
      <ChaoticOrbit size="35" speed="1.5" color="white" />
    </div>
  );
}
