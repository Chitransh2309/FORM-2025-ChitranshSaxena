import { ChaoticOrbit } from "ldrs/react";
import "ldrs/react/ChaoticOrbit.css";

export default function Loader() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      <ChaoticOrbit size="35" speed="1.5" color="#56A37D" />
    </div>
  );
}
