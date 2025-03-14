import { useState } from "react";
import { updateDepartmentStatus } from "../../../services/state/api/departmentCreationApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatusToggleButton = ({ initialStatus, pklTargetId }: any) => {
  const [isEnabled, setIsEnabled] = useState(initialStatus);
  const queryClient = useQueryClient();

  const handleToggle = async () => {
    const newStatus = isEnabled ? 0 : 1;
    setIsEnabled(newStatus);
    mutation.mutate({ departmentId: pklTargetId, bEnable: newStatus });
  };

  const mutation = useMutation({
    mutationFn: updateDepartmentStatus,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries();
      } else {
        toast.error("Something went wrong!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error updating department!");
      setIsEnabled((prev: boolean) => !prev);
    },
  });

  return (
    // <button
    //   onClick={handleToggle}
    //   className={`px-3 py-1 rounded text-white ${
    //     isEnabled ? "bg-red-500" : "bg-green-500"
    //   }`}
    // >
    //   {isEnabled ? "Disable" : "Enable"}
    // </button>
    <button
      onClick={handleToggle}
      className={`transition ease-in-out duration-300 w-12 rounded-full focus:outline-none ${
        isEnabled ? "bg-green-300" : "bg-gray-200"
      }`}
    >
      <div
        className={`transition ease-in-out duration-300 rounded-full h-6 w-6 bg-white shadow ${
          isEnabled ? "transform translate-x-full" : ""
        }`}
      ></div>
    </button>
  );
};

export default StatusToggleButton;
