import React, { useEffect, useMemo, useState } from "react";

import ModalOpenButton from "../components/ui/ModelOpenButton";
import { getSummaryReport } from "../services/state/api/summaryReportCreationApi";

import * as XLSX from "xlsx";
import {
  AlertCircle,
  CheckCircle,
  DownloadCloud,
  UploadCloud,
  // DownloadCloud,
  // UploadCloud,
  X,
} from "lucide-react";

import { Add } from "@mui/icons-material";


// import TemplateDownloadButton from "../components/ui/TemplateDownloadButton";
import Loader from "../components/ui/Loader";


import { useQuery } from "@tanstack/react-query";
import useDebounce from "../services/state/useDebounce";


// import SearchInputBox from "../components/ui/SearchInputBox";
// import SearchDropdown from "../components/ui/SearchDropdown";

// import * as XLSX from "xlsx";
import { useErrorStore } from "../services/useErrorStore";
import CentralizedTable from "../components/CentralizedTable";
import { summaryColumns } from "../utils/tableColumns";
import { Column } from "react-table"; // Ensure this matches the library you're using
import { useNavigate } from "react-router-dom";
import SearchInputBox from "../components/ui/SearchInputBox";
import TemplateDownloadButton from "../components/ui/TemplateDownloadButton";


const Candidates: React.FC = () => {
  const navigate = useNavigate();

  const columns = useMemo(() => summaryColumns(navigate), [navigate]);

  const errorMessage = useErrorStore((state) => state.errorMessage);
  const successMessage = useErrorStore((state) => state.successMessage);
  const { bulkName } = useErrorStore();


  const clearErrorMessage = useErrorStore((state) => state.clearErrorMessage);
  const clearSuccessMessage = useErrorStore(
    (state) => state.clearSuccessMessage
  );

  const { statusColor } = useErrorStore();
  // const { data : summaryData ,isLoading : isLoadingSummary ,error: errorSummary } =  useQuery({
  //   queryKey: ["summaryData"],
  //   queryFn: () => getSummaryReport({
  //     vsSchemeName: "Scheme Name",
  //     itotalTrainingCandidate: 0,
  //     itotalCertifiedCandidate: 0,
  //     itotalPlacedCandidate: 0,
  //     itotalTarget: 0,
  //     iMaleCount: 0,
  //     iFemaleCount: 0,
  //     iScCount: 0,
  //     iStHCount: 0,
  //     iStPCount: 0,
  //     iObcCount: 0,
  //     iGeneralCount: 0,
  //     iMinorityCount: 0,
  //     iTeaTribeCount: 0,
  //     iPwdCount: 0,
  //     iTotalJobRoleCount: 0,
  //     fklDepartmentId: 0,
  //     dtFinancialYear: "Financial Year",
  //   }),
  // }); 

  // console.log(summaryData);


  const [searchValue, setSearchValue] = useState<string>("");

  const [filteredData, setFilteredData] = useState([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [currentPage, setCurrentPage,] = useState(1);
  const [pageSize, setPageSize] = useState(25);









  const debouncedSearchValue = useDebounce(searchValue, 1000);


  const {
    data: summaryData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [
      "summaryData",
      debouncedSearchValue,
      currentPage,
      pageSize,
    ],
    queryFn: () => getSummaryReport({
      vsSchemeName: "Scheme Name",
      itotalTrainingCandidate: 0,
      itotalCertifiedCandidate: 0,
      itotalPlacedCandidate: 0,
      itotalTarget: 0,
      iMaleCount: 0,
      iFemaleCount: 0,
      iScCount: 0,
      iStHCount: 0,
      iStPCount: 0,
      iObcCount: 0,
      iGeneralCount: 0,
      iMinorityCount: 0,
      iTeaTribeCount: 0,
      iPwdCount: 0,
      iTotalJobRoleCount: 0,
      fklDepartmentId: 0,
      dtFinancialYear: "Financial Year",
      take: pageSize,
      skip: (currentPage - 1),
      search: searchValue
    }),
  });

  useEffect(() => {
    if (isSuccess) {
      if (summaryData && summaryData) {
        setFilteredData(summaryData as any);
        setTotalCount(summaryData.length || 0);
      } else if (Array.isArray(summaryData)) {
        setFilteredData(summaryData as any); 
      } else {
        setFilteredData([]);
        setTotalCount(0);
      }
    }
  }, [summaryData, isSuccess, searchValue]);


  const exportToExcel = () => {
    if (!summaryData || summaryData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      vsSchemeName: "Scheme Name",
      itotalTrainingCandidate: "Total Training Candidate",
      itotalCertifiedCandidate: "Total Certified Candidate",
      itotalPlacedCandidate: "Total Placed Candidate",
      itotalTarget: "Total Target",
      iMaleCount: "Male Count",
      iFemaleCount: "Female Count",
      iScCount: "SC Count",
      iStHCount: "ST H Count",
      iStPCount: "ST P Count",
      iObcCount: "OBC Count",
      iGeneralCount: "General Count",
      iMinorityCount: "Minority Count",
      iTeaTribeCount: "Tea Tribe Count",
      iPwdCount: "PwD Count",
      iTotalJobRoleCount: "Total Job Role Count",
      department_names: "Department",
      dtFinancialYear: "Financial Year",

    };

    const formattedData = filteredData.map((item) => {
      return Object.keys(headersMap).reduce((acc, key) => {
        const headerKey = key as keyof typeof headersMap;
        const itemKey = key as keyof typeof item;
        let value = item[itemKey] ?? "";
        acc[headersMap[headerKey]] = value;
        return acc;
      }, {} as Record<string, unknown>);
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");
    XLSX.writeFile(workbook, "SummaryReportData.xlsx");
  };



  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  if (isLoading) {
    return <Loader />;
  }
  console.log(summaryData); 

  return (
    <>
      <div className="">
        <p className="text-2xl font-bold mb-4">Summary Report </p>
        {bulkName === "report" && (
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

        {/* <div className="bg-yellow-100 m-7 text-red-700 text-sm  flex items-center justify-start p-4 rounded-sm w-full  mx-auto">
          <span className="text-red-500 text-2xl mr-2">⚠️</span>
          Only the last four digits of the candidate's Aadhar number should be
          Insert.{<br></br>}The Candidate Unique ID is generated using the first
          4 letters of the name, the last 4 digit of the Aadhaar number, DOB
          (YYYYMMDD), and gender (M/F) to ensure accuracy and uniqueness.
        </div> */}

        <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
          <div className="flex items-center space-x-4">
            {/* <SearchDropdown
              options={[
                { label: "All", value: "" },
                { label: "Candidate Name", value: "vsCandidateName" },
                { label: "Batch ID", value: "batchId" },
                { label: "Candidate ID", value: "candidateId" },
                { label: "Gender", value: "gender" },
                {
                  label: "Mobile Number",
                  value: "mobile",
                },
                {
                  label: "Qualification",
                  value: "qualification",
                },
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
            )} */}
          </div>

          <div className="flex gap-1">
            <TemplateDownloadButton
              templateType={12}
              templateTitle="Summary Template"
              Icon={DownloadCloud}
            />

            <ModalOpenButton
              modalType={11}
              modalTitle="Bulk Upload"
              bulkName="report"
              Icon={UploadCloud}
            />
            <ModalOpenButton
              modalType={15}
              modalTitle="Add Report"
              bulkName="Candidate"
              Icon={Add}
            />
          </div>
        </div>
      </div>
      {/* <div className="pt-10">
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
        <div className="py-2 text-lg text-green-600">
          Total Department Entries: {totalCount}
        </div> */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold"></p>
        <button
          className="p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={exportToExcel}
        >
          <DownloadCloud size={18} />
          Download Report
        </button>
      </div>
      {/* Table Component */}
      <SearchInputBox
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={`Search by scheme name ....`}
      />
      <div className="py-2 text-lg text-green-600">Total Count: {totalCount}</div>
      <CentralizedTable
        columns={columns as Column<any>[]}
        data={filteredData}
        pageSize={pageSize}
        currentPage={currentPage}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
      {/* </div> */}

      {/* <div className="bg-yellow-100 mt-8 text-red-700 text-sm  flex items-center justify-center p-4 rounded-sm w-full  mx-auto">
        <span className="text-red-500 text-2xl mr-2">⚠️</span>
        NOTE: Duplicate checks are performed using a generated unique ID, which
        is created only when an Aadhaar number is provided.
      </div> */}
      <div className="pt-10">
        <p className="text-2xl font-bold mb-4"></p>
        {/* <div className="py-3 text-lg text-green-600">
          Total Duplicate Entries: {totalDupCount}
        </div> */}
        <div className="mb-4 flex justify-between">
          {/* <div>
            <label className="mr-6">
              <input
                type="checkbox"
                name="vsCandidateName"
                checked={selectedDuplicates.vsCandidateName}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2"
                disabled
              />
              Candidate Name
            </label>
            <label className="mr-6">
              <input
                type="checkbox"
                name="vsDOB"
                checked={selectedDuplicates.vsDOB}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2"
                disabled
              />
              DOB
            </label>
            <label className="mr-6 ">
              <input
                type="checkbox"
                name="vsUUID"
                checked={selectedDuplicates.vsUUID}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2"
                disabled
              />
              UUID
            </label>
            <label>
              <input
                type="checkbox"
                name="vsGender"
                checked={selectedDuplicates.vsGender}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2 "
                disabled
              />
              Gender
            </label>
            <label>
              <input
                type="checkbox"
                name="vsMobile"
                checked={selectedDuplicates.vsMobile}
                onChange={handleCheckboxChange}
                className="transform scale-150 mr-2 ml-4"
              />
              Mobile
            </label>
          </div> */}

          {/* <div className="mb-4">
            <SearchDropdown
              options={[
                { label: "Own Department", value: "ownDept" },
                { label: "Cross Department", value: "crossDept" },
              ]}
              onSelect={(option) => setDuplicateType(option.value)}
              selected={duplicateType}
            />
          </div>

          <div>
            <button
              className="p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              onClick={exportToExcelDuplicate}
            >
              <DownloadCloud size={18} />
              Download Report
            </button>
          </div> */}
        </div>
        {/* <CentralizedTable
          columns={duplicateTablecolumns}
          data={duplicateData}
          pageSize={duplicatePageSize}
          currentPage={duplicateCurrentPage}
          totalCount={totalDuplicateCount}
          onPageChange={setDuplicateCurrentPage}
          onPageSizeChange={setDuplicatePageSize}
        /> */}
      </div>
    </>
  );
};

export default Candidates;
