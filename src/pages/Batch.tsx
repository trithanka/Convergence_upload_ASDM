
import React, { useEffect, useMemo, useState } from "react";
import CentralizedTable from "../components/CentralizedTable";
import ModalOpenButton from "../components/ui/ModelOpenButton";

import { AlertCircle, CheckCircle, DownloadCloud, UploadCloud, X } from "lucide-react";
import { Add } from "@mui/icons-material";
import TemplateDownloadButton from "../components/ui/TemplateDownloadButton";
import { batchColumns } from "../utils/tableColumns";
import { getTableData } from "../services/state/api/tableDataApi";
import SearchDropdown from "../components/ui/SearchDropdown";
import Loader from "../components/ui/Loader";
import useDebounce from "../services/state/useDebounce";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { Column } from "react-table";
import { useErrorStore } from "../services/useErrorStore";
import axiosInstance from "../services/state/api-setup/axiosInstance";
import useAuthStore from "../utils/cookies";
import DownloadDropdownButton from "../components/downloadDown";



const Batch: React.FC = () => {

  const [searchValue,] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [searchKey,] = useState<string>("");

  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const successMessage = useErrorStore((state) => state.successMessage);
  const { bulkName } = useErrorStore();


  const clearErrorMessage = useErrorStore((state) => state.clearErrorMessage);
  const clearSuccessMessage = useErrorStore(
    (state) => state.clearSuccessMessage
  );
  const { statusColor } = useErrorStore();

  const columns = useMemo<Column<any>[]>(() => batchColumns(navigate) as Column<any>[], [navigate]);


  const { data: fetchedData, isSuccess, isLoading } = useQuery({
    queryKey: ["batchData", "batch", searchKey, debouncedSearchValue],
    queryFn: () => getTableData("batch", searchKey, debouncedSearchValue),
  });

  useEffect(() => {
    if (isSuccess && fetchedData?.data?.data) {
      setFilteredData(fetchedData.data.data);
      setTotalCount(fetchedData.data.total_count);
    }
  }, [fetchedData, isSuccess]);

  console.log("totalCount", totalCount);

  // Create batch ID options from fetched data
  const batchIdOptions = useMemo(() => {
    if (!fetchedData?.data?.data) return [];

    // Get unique batch IDs and create options
    const uniqueBatchIds = [...new Set(fetchedData.data.data.map((item: any) => item.iBatchNumber))];
    return uniqueBatchIds.map((batchId: unknown) => ({
      label: `Batch ${batchId}`,
      value: String(batchId)
    }));
  }, [fetchedData]);


  const { data: DownloadData } = useQuery({
    queryKey: ["DownloadData", totalCount],
    queryFn: () => getTableData("batch", "", "", 1, totalCount, [], 1, totalCount, "ownDept"),
    enabled: !!totalCount,
  });
  console.log("DownloadData", DownloadData);


  const handleDownload = (value: number) => {
    if (value === 1) {
      exportToExcel2();
    } else {
      exportToExcel();
    }
  }

  const exportToExcel2 = () => {
    if (!DownloadData || DownloadData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      iBatchNumber: "Batch ID",
      iBatchTarget: "Batch Target",
      dtStartDate: "Start Date",
      dtEndDate: "End Date",
      tcName: "Training Center Name",
      tcAddress: "Training Center Address",
      vsCourseName: "Course Name",
      vsTargetNo: "Target No",
      // vsSchemeType: "Scheme Type",

      // vsFundName: "Fund Name",
      // vsSchemeFundingType: "Funding Type",
      // vsSchemeFUndingRatio: "Funding Ratio",
      // sanctionOrderNo: "Sanction Order No",
      // dtSanctionDate: "Sanction Date",
      // vsDepartmentName: "Department Name",
    };

    const formattedData = DownloadData.data.data.map((item: any) => {
      return Object.keys(headersMap).reduce<Record<string, any>>((acc, key) => {
        let value: any = item[key];


        if (key === "dtStartDate" || key === "dtEndDate" && value) {
          const date = new Date(value);
          value = isNaN(date.getTime())
            ? value
            : date.toLocaleDateString("en-GB");
        }

        acc[headersMap[key as keyof typeof headersMap]] = value;
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Apply cell protection to system-generated fields (read-only)
    // Lock Batch ID, Start Date, End Date, Training Center Name, Training Center Address, Course Name
    const protectedFields = ["Batch ID", "Start Date", "End Date", "Training Center Name", "Training Center Address", "Course Name"];

    // Set protection for header row
    protectedFields.forEach((header) => {
      const colIndex = Object.values(headersMap).indexOf(header);
      if (colIndex !== -1) {
        const colLetter = XLSX.utils.encode_col(colIndex);
        // Lock header cell
        if (!worksheet[`${colLetter}1`]) {
          worksheet[`${colLetter}1`] = {};
        }
        worksheet[`${colLetter}1`].l = { locked: true };

        // Lock all data cells in this column
        for (let row = 2; row <= formattedData.length + 1; row++) {
          const cellRef = `${colLetter}${row}`;
          if (!worksheet[cellRef]) {
            worksheet[cellRef] = {};
          }
          worksheet[cellRef].l = { locked: true };
        }
      }
    });

    // Allow editing for user input fields (Batch Target, Target No)
    const editableFields = ["Batch Target", "Target No"];
    editableFields.forEach((header) => {
      const colIndex = Object.values(headersMap).indexOf(header);
      if (colIndex !== -1) {
        const colLetter = XLSX.utils.encode_col(colIndex);
        // Unlock header cell
        if (!worksheet[`${colLetter}1`]) {
          worksheet[`${colLetter}1`] = {};
        }
        worksheet[`${colLetter}1`].l = { locked: false };

        // Unlock all data cells in this column
        for (let row = 2; row <= formattedData.length + 1; row++) {
          const cellRef = `${colLetter}${row}`;
          if (!worksheet[cellRef]) {
            worksheet[cellRef] = {};
          }
          worksheet[cellRef].l = { locked: false };
        }
      }
    });

    // Enable sheet protection
    worksheet['!protect'] = {
      password: 'mypassword',
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      deleteColumns: false,
      deleteRows: false,
      sort: false,
      autoFilter: false,
      pivotTables: false
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");

    XLSX.writeFile(workbook, "batchdata.xlsx");

  }





  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      iBatchNumber: "Batch ID",
      iBatchTarget: "Batch Target",
      dtStartDate: "Start Date",
      dtEndDate: "End Date",
      tcName: "Training Center Name",
      tcAddress: "Training Center Address",
      vsCourseName: "Course Name",
      vsTargetNo: "Target No",
      // vsSchemeType: "Scheme Type",

      // vsFundName: "Fund Name",
      // vsSchemeFundingType: "Funding Type",
      // vsSchemeFUndingRatio: "Funding Ratio",
      // sanctionOrderNo: "Sanction Order No",
      // dtSanctionDate: "Sanction Date",
      // vsDepartmentName: "Department Name",
    };

    const formattedData = filteredData.map((item) => {
      return Object.keys(headersMap).reduce<Record<string, any>>((acc, key) => {
        let value: any = item[key];


        if (key === "dtStartDate" || key === "dtEndDate" && value) {
          const date = new Date(value);
          value = isNaN(date.getTime())
            ? value
            : date.toLocaleDateString("en-GB");
        }

        acc[headersMap[key as keyof typeof headersMap]] = value;
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Apply cell protection to system-generated fields (read-only)
    // Lock Batch ID, Start Date, End Date, Training Center Name, Training Center Address, Course Name
    const protectedFields = ["Batch ID", "Start Date", "End Date", "Training Center Name", "Training Center Address", "Course Name"];

    // Set protection for header row
    protectedFields.forEach((header) => {
      const colIndex = Object.values(headersMap).indexOf(header);
      if (colIndex !== -1) {
        const colLetter = XLSX.utils.encode_col(colIndex);
        // Lock header cell
        if (!worksheet[`${colLetter}1`]) {
          worksheet[`${colLetter}1`] = {};
        }
        worksheet[`${colLetter}1`].l = { locked: true };

        // Lock all data cells in this column
        for (let row = 2; row <= formattedData.length + 1; row++) {
          const cellRef = `${colLetter}${row}`;
          if (!worksheet[cellRef]) {
            worksheet[cellRef] = {};
          }
          worksheet[cellRef].l = { locked: true };
        }
      }
    });

    // Allow editing for user input fields (Batch Target, Target No)
    const editableFields = ["Batch Target", "Target No"];
    editableFields.forEach((header) => {
      const colIndex = Object.values(headersMap).indexOf(header);
      if (colIndex !== -1) {
        const colLetter = XLSX.utils.encode_col(colIndex);
        // Unlock header cell
        if (!worksheet[`${colLetter}1`]) {
          worksheet[`${colLetter}1`] = {};
        }
        worksheet[`${colLetter}1`].l = { locked: false };

        // Unlock all data cells in this column
        for (let row = 2; row <= formattedData.length + 1; row++) {
          const cellRef = `${colLetter}${row}`;
          if (!worksheet[cellRef]) {
            worksheet[cellRef] = {};
          }
          worksheet[cellRef].l = { locked: false };
        }
      }
    });

    // Enable sheet protection
    worksheet['!protect'] = {
      password: 'mypassword',
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      deleteColumns: false,
      deleteRows: false,
      sort: false,
      autoFilter: false,
      pivotTables: false
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");

    XLSX.writeFile(workbook, "batchdata.xlsx");
  };






  // Function to send batch selection payload to API
  const sendBatchSelectionPayload = async (payload: any) => {
    try {
      const { userDetails } = useAuthStore.getState();

      if (!userDetails) {
        throw new Error("User details are not available.");
      }

      const requestData = {
        ...payload,
        fklDepartmentId: userDetails.departmentId,
        queryType: "batch_selection"
      };

      const response = await axiosInstance.post("/batch-selection/", requestData);
      console.log("Batch selection payload sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending batch selection payload:", error);
      throw error;
    }
  };



  const handleBatchIdSelect = async (option: { label: string; value: string }) => {
    setSelectedBatchId(option.value);

    // Filter data based on selected batch ID
    if (fetchedData?.data?.data) {
      const filtered = fetchedData.data.data.filter((item: any) =>
        item.iBatchNumber === option.value
      );
      setFilteredData(filtered);
    }

    // Create and send the payload
    const payload = {
      batchId: option.value,
      batchLabel: option.label,
      timestamp: new Date().toISOString(),
      action: "batch_selected"
    };

    console.log("Selected Batch ID payload:", payload);

    // Send payload to API
    try {
      await sendBatchSelectionPayload(payload);
    } catch (error) {
      console.error("Failed to send batch selection payload:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }


  return (
    <>

      <div className="">
        <p className="text-2xl font-bold mb-4">List Of Batches</p>
        {bulkName === "batch" && (
          <>
            {successMessage && (
              <div
                className={`m-2 text-sm flex items-center justify-between p-4 rounded-sm w-full mx-auto relative
      ${statusColor === "g" ? "bg-green-100 text-green-600" : ""}
      ${statusColor === "y" ? "bg-blue-100 text-blue-600" : ""}
      ${statusColor === "r" ? "bg-red-100 text-red-600" : ""}`}
              >
                <div className="flex items-center">
                  {statusColor === "g" && (
                    <CheckCircle className="w-5 h-5 text-green-700 mr-2" />
                  )}
                  {statusColor === "y" && (
                    <AlertCircle className="w-5 h-5 text-blue-900 mr-2" />
                  )}
                  {statusColor === "r" && (
                    <AlertCircle className="w-5 h-5 text-red-700 mr-2" />
                  )}

                  <p
                    style={{ color: statusColor }}
                    dangerouslySetInnerHTML={{
                      __html: successMessage
                        ? successMessage.replace(/\n/g, "<br />")
                        : successMessage,
                    }}
                  ></p>
                </div>
                <button
                  onClick={clearSuccessMessage}
                  className="absolute right-4 top-2"
                >
                  <X
                    className={`w-5 h-5 cursor-pointer 
          ${statusColor === "g" ? "text-green-700" : ""}
          ${statusColor === "y" ? "text-yellow-700" : ""}
          ${statusColor === "r" ? "text-red-700" : ""}`}
                  />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-100  text-red-700 text-sm flex items-center justify-between p-4 rounded-sm w-full  relative">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-700 mr-2" />
                  <p
                    style={{ color: "red" }}
                    dangerouslySetInnerHTML={{
                      __html: errorMessage.replace(/\n/g, "<br />"),
                    }}
                  ></p>
                </div>
                <button
                  onClick={clearErrorMessage}
                  className="absolute right-4 top-2"
                >
                  <X className="w-5 h-5 text-red-700 cursor-pointer" />
                </button>
              </div>
            )}
          </>
        )}
        <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
          <div className="flex items-center space-x-4">
            {/* Search by field dropdown */}
            {/* <SearchDropdown
              options={[
                { label: "Batch Number", value: "iBatchNumber" },
              ]}
              onSelect={handleDropdownSelect}
              selected={searchKey}
              placeholder="Search by field"
            /> */}

            {/* Batch ID selection dropdown */}
            <SearchDropdown
              options={batchIdOptions}
              onSelect={handleBatchIdSelect}
              selected={selectedBatchId}
              placeholder="Select Batch ID"
            />

            {
              selectedBatchId && (
                <button
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-800"
                  onClick={() => {
                    setSelectedBatchId("");
                    setFilteredData(fetchedData?.data?.data || []);
                  }}
                >
                  Clear
                </button>
              )
            }





          </div>
          <div className="flex gap-1">
            <TemplateDownloadButton
              templateType={7}
              templateTitle="Batch Template"
              Icon={DownloadCloud}
            />

            <ModalOpenButton
              modalType={11}
              modalTitle="Bulk Upload"
              bulkName="batch"
              Icon={UploadCloud}

            />
            <ModalOpenButton
              modalType={4}
              modalTitle="Add Batch"
              bulkName="Batch"
              Icon={Add}

            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold">Batch Entries </p>


        <DownloadDropdownButton
          options={[
            { label: "All Value", value: 1 },
            { label: "Display Value", value: 2 },
          ]}
          onDownload={handleDownload}
        />



      </div>

      <CentralizedTable columns={columns} data={filteredData} pageSize={5} />
    </>
  );
}

export default Batch


