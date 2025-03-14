import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const SystemAdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex overflow-hidden">
      <div className=" w-full h-screen overflow-auto flex flex-col ">
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          isSysAdmin
        />
        <main className=" p-6 bg-gray-100 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SystemAdminLayout;
