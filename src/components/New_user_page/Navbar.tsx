import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import ToggleSwitch from "./Toggle";

function Navbar() {
  return (
    <div className="flex justify-end items-center gap-4 bg-white px-6 py-4 border-b">
      <ToggleSwitch />
      <button className="cursor-pointer text-gray-600 hover:text-gray-800">
        <HiOutlineQuestionMarkCircle size={24} />
      </button>
      <button className="cursor-pointer text-gray-600 hover:text-gray-800">
        <FaRegCircleUser size={24} />
      </button>
    </div>
  );
}
export default Navbar;
