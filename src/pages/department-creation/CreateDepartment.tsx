/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import CentralizedTable from "../../components/CentralizedTable";
import { departmentListColumns } from "../../utils/tableColumns";
import { getCreatedDepartments } from "../../services/state/api/departmentCreationApi";
import ModalOpenButton from "../../components/ui/ModelOpenButton";
import { Add } from "@mui/icons-material";
// import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
// import { Department } from "../../types/departmentCreation";
import { Column } from "react-table";


const CreateDepartment = () => {
  const [selectedDepartmentId  ] = useState(null);
  const { data, refetch } = useQuery({
    queryKey: ["getCreatedDepartments"],
    queryFn: () =>
      getCreatedDepartments({ departmentId: selectedDepartmentId }),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const departmentColumns = useMemo<Column<any>[]>(() => departmentListColumns as Column<any>[], []);



  useEffect(() => {
    refetch();
  }, [refetch, selectedDepartmentId]);

  // const handleDepartmentChange = (_: unknown, newValue: any) => {
  //   // If a department is selected, set its department ID
  //   setSelectedDepartmentId(newValue?.pklDepartmentId || null);
  //   refetch(); // Refetch data based on the selected department ID
  // };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        {/* <Autocomplete
          disablePortal
          getOptionLabel={(option: Department) =>
            option?.vsDepartmentName?.charAt(0)?.toUpperCase() +
            option?.vsDepartmentName?.slice(1)
          }
          options={data?.departmentNameList || []}
          sx={{ width: 300 }}
          onChange={handleDepartmentChange}
          renderInput={(params) => (
            <TextField
              {...params}
              className="capitalize"
              label="Select Department"
            />
          )}
        /> */}
        <ModalOpenButton
          modalType={13}
          modalTitle="Add Login Creation"
          bulkName="LoginCreation"
          Icon={Add}
          disabled={true} 
        />
      </div>
      <div className="w-full">
        <CentralizedTable
          columns={departmentColumns}
          data={data?.departmentData}
          pageSize={5}
          hideRowsPerPage={true}
        />
      </div>
    </div>
  );
};

export default CreateDepartment;
