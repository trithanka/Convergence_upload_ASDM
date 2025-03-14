import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CentralizedTable from "../components/CentralizedTable";
import { schemeColumns } from "../utils/tableColumns";
import { getTableData } from "../services/state/api/tableDataApi";
import SearchDropdown from "../components/ui/SearchDropdown";
import SearchInputBox from "../components/ui/SearchInputBox";
import ModalOpenButton from "../components/ui/ModelOpenButton";
import {
  AlertCircle,
  CheckCircle,
  DownloadCloud,
  UploadCloud,
  X,
} from "lucide-react";
import { Add } from "@mui/icons-material";
import TemplateDownloadButton from "../components/ui/TemplateDownloadButton";
import Loader from "../components/ui/Loader";
import useDebounce from "../services/state/useDebounce";
import { schemeDuplicateColumns } from "../utils/tableColumns";
import * as XLSX from "xlsx";
import { useErrorStore } from "../services/useErrorStore";
import { Column } from "react-table";

const Scheme: React.FC = () => {
  const navigate = useNavigate();

  const columns = useMemo<Column<any>[]>(() => schemeColumns(navigate) as Column<any>[], [navigate]);




  const [searchKey, setSearchKey] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchKeyLabel, setSearchKeyLabel] = useState<string>("");
  const [filteredData, setFilteredData] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [duplicatePageSize, setDuplicatePageSize] = useState(25);
  const [duplicateCurrentPage, setDuplicateCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalDuplicateCount, setSuplicateTotalCount] = useState(0);

  const errorMessage = useErrorStore((state) => state.errorMessage);
  const successMessage = useErrorStore((state) => state.successMessage);
  const { bulkName } = useErrorStore();
  const clearErrorMessage = useErrorStore((state) => state.clearErrorMessage);
  const clearSuccessMessage = useErrorStore(
    (state) => state.clearSuccessMessage
  );
  const { statusColor } = useErrorStore();
  const [selectedDuplicates, setSelectedDuplicates] = useState<{
    vsSchemeName: boolean;
    vsFundName: boolean;
    vsSchemeFundingType: boolean;
    vsSchemeType: boolean;
  }>({
    vsSchemeName: true,
    vsFundName: true,
    vsSchemeFundingType: false,
    vsSchemeType: false,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setSelectedDuplicates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const duplicateQuery = Object.keys(selectedDuplicates)
    .filter((key) => selectedDuplicates[key as keyof typeof selectedDuplicates])
    .map((key) => key as string);

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const duplicateTablecolumns = useMemo<Column<any>[]>(
    () => schemeDuplicateColumns(navigate, duplicateQuery) as Column<any>[],
    [navigate, duplicateQuery]
  );


  const {
    data: fetchedData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [
      "schemeData",
      searchKey,
      debouncedSearchValue,

      currentPage,
      pageSize,
      ...duplicateQuery,
      duplicatePageSize,
      duplicateCurrentPage
    ],
    queryFn: () =>
      getTableData("scheme", searchKey, debouncedSearchValue, currentPage, pageSize, duplicateQuery, duplicateCurrentPage, duplicatePageSize),
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
        fetchedData?.data?.duplicate_schemes &&
        fetchedData.data.duplicate_schemes.length > 0
      ) {
        setDuplicateData(fetchedData.data.duplicate_schemes);
        setSuplicateTotalCount(fetchedData.total_count);
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
      vsSchemeName: "Scheme Name",
      vsSchemeType: "Scheme Type",
      vsSchemeCode: "Scheme Code",
      vsFundName: "Fund Name",
      vsSchemeFundingType: "Funding Type",
      vsSchemeFUndingRatio: "Funding Ratio",
      sanctionOrderNo: "Sanction Order No",
      dtSanctionDate: "Sanction Date",
      vsDepartmentName: "Department Name",
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

    XLSX.writeFile(workbook, "SchemesData.xlsx");
  };

  const exportToExcelDuplicate = () => {
    if (!duplicateData || duplicateData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      vsSchemeName: "Scheme Name",
      vsSchemeType: "Scheme Type",
      vsFundName: "Fund Name",
      vsFundingType: "Funding Type",
      vsDepartmentName: "Department Name",
    };

    const formattedData = duplicateData.map((item) => {
      return Object.keys(headersMap).reduce((acc, key) => {
        acc[headersMap[key as keyof typeof headersMap]] = item[key];
        return acc;
      }, {} as Record<string, unknown>);
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");

    XLSX.writeFile(workbook, "SchemesDuplicateData.xlsx");
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
      <div>
        <p className="text-2xl font-bold mb-4">List Of Schemes</p>
        {bulkName === "scheme" && (
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
                { label: "Scheme Name", value: "vsSchemeName" },
                { label: "Scheme Code", value: "vsSchemeCode" },
                { label: "Fund Name", value: "vsFundName" },
                { label: "Sanction Date (yyyy/mm/dd)", value: "dtSanctionDate" },
              ]}
              onSelect={handleDropdownSelect}
              selected={searchKey}
            />

            {searchKey && (
              <>
                {searchKey === "dtSanctionDate" ? (
                  // Date input field when "Sanction Date" is selected
                  <SearchInputBox
                    type="date"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={`Enter ${searchKeyLabel}`}
                  />
                ) : (
                  // Text input for other selections
                  <SearchInputBox
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={`Enter ${searchKeyLabel}`}
                  />
                )}

                <button
                  className="p-2 px-4 bg-red-500 text-white rounded hover:bg-red-800"
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
              templateType={0}
              templateTitle="Scheme Template"
              Icon={DownloadCloud}
            />
            <ModalOpenButton
              modalType={11}
              modalTitle="Bulk Upload"
              bulkName="scheme"
              Icon={UploadCloud}
            />
            <ModalOpenButton
              modalType={0}
              modalTitle="Add scheme"
              bulkName="scheme"
              Icon={Add}
            />
          </div>
        </div>
        <div className="py-2 text-lg text-green-600">
          Total Count: {totalCount}
        </div>
      </div>

      <div className="pt-10">
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

        {/* Table Component */}
        <CentralizedTable columns={columns}
          data={filteredData}
          pageSize={pageSize}
          currentPage={currentPage}
          totalCount={totalCount}

          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize} />
      </div>

      <div className="bg-yellow-100 mt-8 text-red-700 text-sm  flex items-center justify-center p-4 rounded-sm w-full  mx-auto">
        <span className="text-red-500 text-2xl mr-2">⚠️</span>
        NOTE: Data in the 'Cross-Department Duplicate Schemes' table is filtered
        based on essential identity parameters, including Scheme Name, Fund
        Name. Users may also apply an additional filter using the Scheme Type
        and Fund Type to narrow down results further.
      </div>

      <div className="pt-10">
        <p className="text-2xl font-bold mb-4">Duplicate Check By </p>
        <div className="mb-4 flex justify-between">
          <div>
            <label className="mr-6">
              <input
                type="checkbox"
                name="vsSchemeName"
                checked={selectedDuplicates.vsSchemeName}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2"
                disabled
              />
              Scheme Name
            </label>
            <label className="mr-6 ">
              <input
                type="checkbox"
                name="vsFundName"
                checked={selectedDuplicates.vsFundName}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2"
                disabled
              />
              Fund Name
            </label>
            <label className="mr-6">
              <input
                type="checkbox"
                name="vsSchemeType"
                checked={selectedDuplicates.vsSchemeType}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2"
              />
              Scheme Type
            </label>

            <label>
              <input
                type="checkbox"
                name="vsSchemeFundingType"
                checked={selectedDuplicates.vsSchemeFundingType}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2"
              />
              Funding Type
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
          columns={duplicateTablecolumns}
          data={duplicateData}
          pageSize={duplicatePageSize}
          currentPage={duplicateCurrentPage}
          totalCount={totalDuplicateCount}

          onPageChange={setDuplicateCurrentPage}
          onPageSizeChange={setDuplicatePageSize}
        />

      </div>
    </>
  );
};

export default Scheme;
