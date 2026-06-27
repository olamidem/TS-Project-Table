import SideBar from "./SideBar";
import Table from "./Table";

const DashBoard = () => {
  return (
    <div className="flex h-screen">
      {/* SideBar */}
      <SideBar />
      <div className="flex-1 bg-gray-900">
        {/* Project Table */}
        <Table />
      </div>
    </div>
  );
};

export default DashBoard;
