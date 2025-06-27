import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import ToggleSwitch from "./Toggle";

function Navbar() {
  return (
    <div className="bg-gradient-to-r from-green-100 via-[#f1f8f5] to-green-100  flex justify-end items-center gap-4 px-6 py-4">
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
