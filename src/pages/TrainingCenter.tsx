import React, { useEffect, useMemo, useState } from "react";
import CentralizedTable from "../components/CentralizedTable";
import { centerColumns } from "../utils/tableColumns";
import ModalOpenButton from "../components/ui/ModelOpenButton";
import SearchInputBox from "../components/ui/SearchInputBox";
import { AlertCircle, CheckCircle, DownloadCloud, Plus, UploadCloud, X } from "lucide-react";
import TemplateDownloadButton from "../components/ui/TemplateDownloadButton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTableData } from "../services/state/api/tableDataApi";
import useDebounce from "../services/state/useDebounce";
import SearchDropdown from "../components/ui/SearchDropdown";
import Loader from "../components/ui/Loader";
import { centerDuplicateColumns } from "../utils/tableColumns";
import { Column } from "react-table";
import * as XLSX from "xlsx";
import { useErrorStore } from "../services/useErrorStore";

const TrainingCenter: React.FC = () => {
  const navigate = useNavigate();
  const columns = useMemo<Column<any>[]>(() => centerColumns(navigate) as Column<any>[], [navigate]);

  const duplicateColumns = useMemo<Column<any>[]>(() => centerDuplicateColumns(navigate) as Column<any>[], [navigate]);

  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchKeyLabel, setSearchKeyLabel] = useState<string>("");
  const [duplicateData, setDuplicateData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const successMessage = useErrorStore((state) => state.successMessage);
  const { bulkName } = useErrorStore();
  const clearErrorMessage = useErrorStore((state) => state.clearErrorMessage);
  const clearSuccessMessage = useErrorStore((state) => state.clearSuccessMessage);
  const { statusColor } = useErrorStore();

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const {
    data: fetchedData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["tcData", searchKey, debouncedSearchValue, , currentPage, pageSize],
    queryFn: () => getTableData("TC", searchKey, debouncedSearchValue, currentPage, pageSize),
  });

  useEffect(() => {
    if (isSuccess) {
      if (fetchedData?.data?.data && fetchedData.data.data.length > 0) {
        setFilteredData(fetchedData.data.data);
        setTotalCount(fetchedData.data.total_count);
      } else {
        setFilteredData([]);
      }

      if (fetchedData?.data?.duplicate_tc && fetchedData.data?.duplicate_tc.length > 0) {
        setDuplicateData(fetchedData.data?.duplicate_tc);
      } else {
        setDuplicateData([]);
      }
    }
  }, [fetchedData, isSuccess]);

  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      vsTcName: "Training Center Name",
      vsSpocEmail: "SPOC Email",
      iSpocContactNum: "SPOC Contact No",
      vsState: "State",
      vsDistrict: "District",
      vsBlock: "Block",
      vsAddress: "Address",
      vsSpocName: "SPOC Name",
      iPartnerCode: "Partner Code",
      vsLongitude: "Longitude",
      vsLatitude: "Latitude",
      vsDepartmentName: "Department Name"
    };

    const formattedData = filteredData.map((item) => {
      return Object.keys(headersMap).reduce<Record<string, any>>((acc, key) => {
        let value: any = item[key];


        if (key === "dtSanctionDate" && value) {
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
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");

    XLSX.writeFile(workbook, "TrainingCenterData.xlsx");
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
        <p className="text-2xl font-bold mb-4">List Of Training Centeres</p>
        {bulkName === "TC" && (
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
                { label: "TC Name", value: "vsTcName" },
                { label: "Partner Code", value: "iPartnerCode" },

                // { label: "TP ID", value: "fklTpId" },
                // { label: "District", value: "vsDistrict" },
                // { label: "Assembly Constituency", value: "fklAssemblyConstituencyId" },
                // { label: "Loksabha Constituency", value: "fklLoksabhaConstituencyId" },

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
              templateType={4}
              templateTitle="TC Template"
              Icon={DownloadCloud}
            />
            <ModalOpenButton
              modalType={11}
              modalTitle="Bulk Upload"
              bulkName="TC"
              Icon={UploadCloud}
            />
            <ModalOpenButton
              modalType={12}
              modalTitle="Add Centers"
              bulkName="TC"
              Icon={Plus}
            />
          </div>
        </div>
        <div className="py-2 text-lg text-green-600">Total Count: {totalCount}</div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold">Department Entries</p>
          <button
            className="p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            onClick={exportToExcel}
          >
            <DownloadCloud size={18} />
            Download Report
          </button>
        </div>
        <CentralizedTable columns={columns} data={filteredData} pageSize={pageSize}
          currentPage={currentPage}
          totalCount={totalCount}

          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize} />
      </div>
      <div className="bg-yellow-100 mt-8 text-red-700 text-sm  flex items-center justify-center p-4 rounded-sm w-full  mx-auto">
        <span className="text-red-500 text-2xl mr-2">⚠️</span>
        Note: The data in the "Cross-Department Duplicate Training Centers" table is filtered based on a 100-meter radius of the insert a location and the associated training partners.
      </div>
      <div className="pt-10">
        <p className="text-2xl font-bold mb-4">Cross-Department Duplicate Training Centeres</p>
        <CentralizedTable columns={duplicateColumns} data={duplicateData} pageSize={5} />
      </div>
    </>
  );
};

export default TrainingCenter;
