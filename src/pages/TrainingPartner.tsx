import React, { useEffect, useMemo, useState } from "react";
import CentralizedTable from "../components/CentralizedTable";
import {
  DuplicateTrainingColumns,
  trainingColumns as getTrainingColumns,
} from "../utils/tableColumns"; // Rename the import
import ModalOpenButton from "../components/ui/ModelOpenButton";
import SearchInputBox from "../components/ui/SearchInputBox";
import {
  AlertCircle,
  CheckCircle,
  DownloadCloud,
  UploadCloud,
  X,
} from "lucide-react";
import { Add } from "@mui/icons-material";
import TemplateDownloadButton from "../components/ui/TemplateDownloadButton";
import { useNavigate } from "react-router-dom";
import useDebounce from "../services/state/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "../services/state/api/tableDataApi";
import SearchDropdown from "../components/ui/SearchDropdown";
import Loader from "../components/ui/Loader";
import { Column } from "react-table";
import * as XLSX from "xlsx";
import { useErrorStore } from "../services/useErrorStore";

const TrainingPartner: React.FC = () => {
  const navigate = useNavigate();
  const columns = useMemo<Column<any>[]>(
    () => getTrainingColumns(navigate) as Column<any>[],
    [navigate]
  );

  const [filteredData, setFilteredData] = useState([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchKeyLabel, setSearchKeyLabel] = useState<string>("");
  const [duplicateData, setDuplicateData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const successMessage = useErrorStore((state) => state.successMessage);
     const { statusColor } = useErrorStore();
  const { bulkName } = useErrorStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
  const clearErrorMessage = useErrorStore((state) => state.clearErrorMessage);
  const clearSuccessMessage = useErrorStore(
    (state) => state.clearSuccessMessage
  );
  const [selectedDuplicates, setSelectedDuplicates] = useState<{
    vsPan: boolean;
  }>({
    vsPan: true,
  });

  const duplicateQuery = Object.keys(selectedDuplicates)
    .filter((key) => selectedDuplicates[key as keyof typeof selectedDuplicates])
    .map((key) => key as string);

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const CrossDuplicateTrainingColumns = useMemo<Column<any>[]>(
    () => DuplicateTrainingColumns(navigate, duplicateQuery) as Column<any>[],
    [navigate, duplicateQuery]
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setSelectedDuplicates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const {
    data: fetchedData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["tpData", searchKey, debouncedSearchValue,  , currentPage, pageSize,...duplicateQuery],
    queryFn: () =>
      getTableData("TP", searchKey, debouncedSearchValue, currentPage, pageSize, duplicateQuery),
  });

  useEffect(() => {
    if (isSuccess) {
      if (fetchedData?.data?.data && fetchedData.data.data.length > 0) {
        setFilteredData(fetchedData.data.data);
        setTotalCount(fetchedData.data.total_count);
      } else {
        setFilteredData([]);
      }

      if (
        fetchedData?.data?.duplicate_tp &&
        fetchedData.data?.duplicate_tp.length > 0
      ) {
        setDuplicateData(fetchedData.data?.duplicate_tp);
      } else {
        setDuplicateData([]);
      }
    }
  }, [fetchedData, isSuccess]);

  console.log("duplicate data are", duplicateData);

  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      vsTpName: "Candidate Name",
      vsSpocName: "SPOC Name",
      vsSpocEmail: "SPOC Email",
      iSpocContactNum: "SPOC Contact",
      vsAddress: "Address",
      vsSmartId: "Smart ID",
      vsPan: "PAN",
      vsDepartmentName : "Department Name"
    };

    const formattedData = filteredData.map((item) => {
      return Object.keys(headersMap).reduce((acc, key) => {
        const headerKey = key as keyof typeof headersMap;
        const itemKey = key as keyof typeof item;
        acc[headersMap[headerKey]] = item[itemKey] ?? "N/A"; // If value is missing, replace it with "N/A"
        return acc;
      }, {} as Record<string, unknown>);
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");

    XLSX.writeFile(workbook, "TrainingPartnerData.xlsx");
  };

  const exportToExcelDuplicate = () => {
    if (
      !fetchedData.data?.duplicate_tp ||
      fetchedData.data?.duplicate_tp.length === 0
    ) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      vsTpName: "TP Name",
      vsPan: "PAN",

      departmentNames: "Department Name",
    };

    const formattedData = fetchedData?.data?.duplicate_tp.map(
      (item: { [x: string]: unknown }) => {
        return Object.keys(headersMap).reduce((acc, key) => {
          acc[headersMap[key as keyof typeof headersMap]] = item[key];
          return acc;
        }, {} as Record<string, unknown>);
      }
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");

    XLSX.writeFile(workbook, "TrainingPartnerDuplicateData.xlsx");
  };

  const handleDropdownSelect = (option: { label: string; value: string }) => {
    setSearchKey(option.value);
    setSearchKeyLabel(option.label);
    setSearchValue("");
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="">
        <p className="text-2xl font-bold mb-4">List Of Training Partners</p>
        {bulkName === "TP" && (
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
            <SearchDropdown
              options={[
                { label: "All", value: "" },
                { label: "TP name", value: "vsTpName" },
                { label: "Mobile", value: "iSpocContactNum" },
                { label: "SPOC Name", value: "vsSpocName" },
                { label: "Smart ID", value: "vsSmartId" },
                { label: "District", value: "vsDistrict" },
                { label: "State", value: "vsState" },
                { label: "Block", value: "vsBlock" },
                { label: "ULB", value: "vsULB" },
              ]}
              onSelect={handleDropdownSelect}
              selected={searchKey}
            />
            {searchKey && (
              <>
                <SearchInputBox
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={`Enter ${searchKeyLabel}`}
                />
                <button
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-800"
                  onClick={() => {
                    setSearchValue("");
                    setSearchKey("");
                    setSearchKeyLabel("");
                    setFilteredData(fetchedData?.data?.data || []);
                  }}
                >
                  Clear
                </button>
              </>
            )}
          </div>
          <div className="flex gap-1">
            <TemplateDownloadButton
              templateType={3}
              templateTitle="TP Template"
              Icon={DownloadCloud}
            />

            <ModalOpenButton
              modalType={11}
              modalTitle="Bulk Upload"
              bulkName="TP"
              Icon={UploadCloud}
            />
            <ModalOpenButton
              modalType={3}
              modalTitle="Add Training Partner"
              bulkName="TP"
              Icon={Add}
            />
          </div>
        </div>
        <div className="py-2 text-lg text-green-600">
          Total Count: {totalCount}
        </div>
      </div>
      <div className="pt-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold">Training Partner Entries</p>
          <button
            className="p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            onClick={exportToExcel}
          >
            <DownloadCloud size={18} />
            Download Report
          </button>
        </div>

        <CentralizedTable columns={columns} data={filteredData}  pageSize={pageSize}
          currentPage={currentPage}
          totalCount={totalCount}

          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize} />
      </div>
      <div className="bg-yellow-100 mt-8 text-red-700 text-sm  flex items-center justify-center p-4 rounded-sm w-full  mx-auto">
        <span className="text-red-500 text-2xl mr-2">⚠️</span>
        Duplicate records are identified based on matching 'Training Paretner
        Name' and 'PAN No' across multiple logins, highlighting common entries
        found in different departments.
      </div>

      <div className="pt-5">
        <p className="text-2xl font-bold mb-4">
          Cross-Department Duplicate Training Partners
        </p>
        <div className="mb-4 flex justify-between">
          <div>
            <label className="mr-6">
              <input
                type="checkbox"
                name="vsPan"
                checked={selectedDuplicates.vsPan}
                onChange={handleCheckboxChange}
                disabled
                className="transform scale-150 mr-2"
              />
              PAN
            </label>
          </div>
          <div>
            <button
              className="p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              onClick={exportToExcelDuplicate}
            >
              <DownloadCloud size={18} />
              Download Report
            </button>
          </div>
        </div>
        <CentralizedTable
          columns={CrossDuplicateTrainingColumns}
          data={duplicateData}
          pageSize={25}
        />
      </div>
    </>
  );
};

export default TrainingPartner;
