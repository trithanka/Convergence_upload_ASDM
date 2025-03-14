import { useState } from "react";
import { Menu } from "lucide-react";
import logo from "../../assets/ASDMLOGO.png";
import useAuthStore from "../../utils/cookies";

const Header = ({
  isSidebarCollapsed,
  toggleSidebar,
  isSysAdmin,
}: {
  isSidebarCollapsed: boolean;
  toggleSidebar: React.MouseEventHandler<HTMLButtonElement>;
  isSysAdmin?: boolean;
}) => {
  const { userDetails, clearAuth } = useAuthStore(); // Access clearAuth from the store
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state

  const handleLogout = () => {
    window.location.reload()
    clearAuth(); // Clear cookies and reset state
    window.location.reload()
    setShowDropdown(false); // Close dropdown after logout
  };

  return (
    <div
      className={`bg-white transition-all duration-300 w-full border ${isSidebarCollapsed ? "" : ""
        } sticky top-0 z-50`}
    >
      <div className="flex items-center justify-between p-4 sticky">
        <div className="flex-grow flex gap-4 items-center">
          {isSysAdmin ? (
            <img src={logo} className="w-16 h-16" />
          ) : (
            <>
              <button onClick={toggleSidebar}>
                <Menu />
              </button>
              <div className="text-blue-500 font-bold text-xl ">
                CONVERGENCE
              </div>




            </>
          )}
        </div>
        <div className="relative flex items-center gap-3">
          {/* <button>
            <Bell />
          </button> */}
          {userDetails ? (
            <div className="relative">
              <div className="relative flex items-center gap-3 border px-4 py-1 rounded-lg shadow-sm bg-gray-50 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
              >
                <span className="text-sm  text-gray-700 capitalize font-bold">
                  {userDetails.vsDepartmentName}
                </span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {userDetails.username}
                </span>
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg">
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Guest</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
