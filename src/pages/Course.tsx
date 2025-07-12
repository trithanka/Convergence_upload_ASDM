
import React, { useEffect, useMemo, useState } from "react";
import CentralizedTable from "../components/CentralizedTable";
import ModalOpenButton from "../components/ui/ModelOpenButton";
import SearchInputBox from "../components/ui/SearchInputBox";
import { AlertCircle, CheckCircle, DownloadCloud, UploadCloud, X } from "lucide-react";
import { Add } from "@mui/icons-material";
import TemplateDownloadButton from "../components/ui/TemplateDownloadButton";
import { courseColumns } from "../utils/tableColumns";
import { getTableData } from "../services/state/api/tableDataApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useDebounce from "../services/state/useDebounce";
import SearchDropdown from "../components/ui/SearchDropdown";
import * as XLSX from "xlsx";
import Loader from "../components/ui/Loader";
import { courseDuplicateColumns } from "../utils/tableColumns";
import { Column } from "react-table";
import { useErrorStore } from "../services/useErrorStore";
const Course: React.FC = () => {


  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchKeyLabel, setSearchKeyLabel] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const [duplicateData, setDuplicateData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
        const [pageSize, setPageSize] = useState(25);
          const errorMessage = useErrorStore((state) => state.errorMessage);
                  const successMessage = useErrorStore((state) => state.successMessage);
                  const { bulkName } = useErrorStore();
                
                  const clearErrorMessage = useErrorStore((state) => state.clearErrorMessage);
                  const clearSuccessMessage = useErrorStore(
                    (state) => state.clearSuccessMessage
                  );
                  const { statusColor } = useErrorStore();
        

   const columns = useMemo<Column<any>[]>(() => courseColumns(navigate) as Column<any>[], [navigate]);
    const duplicateColumns = useMemo<Column<any>[]>(() => courseDuplicateColumns(navigate) as Column<any>[], [navigate]);

  const { data: fetchedData, isSuccess, isLoading } = useQuery({
    queryKey: ["courseData", "course", searchKey, debouncedSearchValue ,currentPage, pageSize,],
    queryFn: () => getTableData("course", searchKey, debouncedSearchValue,currentPage, pageSize,),
  });

  useEffect(() => {
    if (isSuccess) {
      if (fetchedData?.data?.data && fetchedData.data.data.length > 0) {
        setFilteredData(fetchedData.data.data);
        setTotalCount(fetchedData.data.total_count);
      } else {
        setFilteredData([]);
      }

      if (fetchedData?.data?.duplicate_course && fetchedData.data?.duplicate_course.length > 0) {
        setDuplicateData(fetchedData.data?.duplicate_course);
      } else {
        setDuplicateData([]);
      }
    }
  }, [fetchedData, isSuccess]);

  console.log("duplicate data courses are", duplicateData) 
  



  const exportToExcel = () => {
      if (!filteredData || filteredData.length === 0) {
        alert("No data available to export");
        return;
      }
  
      const headersMap = {
        vsCourseName: "Course Name",
        // vsSpocEmail: "SPOC Email",
        // iSpocContactNum: "SPOC Contact No",
      
        // vsBlock: "Block",
       
        // vsSpocName: "SPOC Name",
        // vsTcCode: "Center Code",
        vsCourseCode: "Course Code",
        dtFromDate: "Course Start Date",
        dtToDate: "Course End Date",
        vsSectorName : "Sector Name ",
        vsTcName: "Tc Name ",
    
      };
  
      const formattedData = filteredData.map((item) => {
        return Object.keys(headersMap).reduce<Record<string, any>>((acc, key) => {
          let value: any = item[key];
          if ((key === "dtFromDate" || key === "dtToDate") && value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
              const year = date.getFullYear();
              value = `${day}-${month}-${year}`;
            }
          }
          acc[headersMap[key as keyof typeof headersMap]] = value;
          return acc;
        }, {});
      });
  
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");
  
      XLSX.writeFile(workbook, "CourseData.xlsx");
    };
  

  // Handle search logic
  const handleSearch = (value: string) => {
    setSearchValue(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = fetchedData.data.filter((item: any) =>
      item.vsSchemeName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDropdownSelect = (option: { label: string; value: string }) => {
    setSearchKey(option.value);
    setSearchKeyLabel(option.label);
    setSearchValue("");
  };


  if (isLoading) {
    return <Loader />;
  }


  return (
    <>

      <div className="">
        <p className="text-2xl font-bold mb-4">List Of Job Roles</p>
        {bulkName === "course" && (
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
                { label: "Job Role Name", value: "vsCourseName" },
                { label: "Job Role Code", value: "vsCourseCode" },
               
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
              templateType={2}
              templateTitle="Course Template"
              Icon={DownloadCloud}
            />

            <ModalOpenButton
              modalType={11}
              modalTitle="Bulk Upload"
              bulkName="course"
              Icon={UploadCloud}

            />
            <ModalOpenButton
              modalType={2}
              modalTitle="Add Job Role"
              bulkName="course"
              Icon={Add}

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
                  onClick={() =>  exportToExcel()}
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
        Duplicate records are checked using 'Course Name' and 'Course Code' across multiple logins. These fields are the minimum required to identify duplicates.
      </div>
      <div className="pt-10">
        <p className="text-2xl font-bold mb-4">Cross-Department Duplicate Job Roles</p>
        <CentralizedTable columns={duplicateColumns} data={duplicateData} pageSize={5} />
      </div>
    </>
  );
}

export default Course

