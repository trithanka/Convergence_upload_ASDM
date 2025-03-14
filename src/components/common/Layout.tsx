import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex overflow-hidden  ">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className=" w-full h-screen overflow-auto flex flex-col ">
        <Header isSidebarCollapsed={isSidebarCollapsed}  toggleSidebar={toggleSidebar}/>
        <main className=" p-6 bg-gray-100 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
