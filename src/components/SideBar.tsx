import { FaFolder, FaUser } from "react-icons/fa";
import { TbSettings } from "react-icons/tb";

const SideBar = () => {
  return (
    <div className="w-16 fixed h-screen border border-[#242424] p-4 flex flex-col items-center space-y-8">
      <div className="text-white">Logo</div>
      <div className="text-gray-400">
        <FaFolder className="text-yellow-500"/>
      </div>
      <div className="text-gray-400">
        <FaUser />
      </div>
      <div className="text-gray-400">
        <TbSettings />
      </div>
    </div>
  );
};

export default SideBar;
