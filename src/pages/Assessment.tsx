import ModalOpenButton from "../components/ui/ModelOpenButton";

import { AlertCircle, CheckCircle, DownloadCloud, UploadCloud, X } from "lucide-react";
import { Add } from "@mui/icons-material";
import TemplateDownloadButton from "../components/ui/TemplateDownloadButton";
import Loader from "../components/ui/Loader";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { assessmentColumns } from "../utils/tableColumns";
import { useNavigate } from "react-router-dom";
import { getTableData } from "../services/state/api/tableDataApi";
import SearchInputBox from "../components/ui/SearchInputBox";
import SearchDropdown from "../components/ui/SearchDropdown";
import useDebounce from "../services/state/useDebounce";
import CentralizedTable from "../components/CentralizedTable";
import { Column } from "react-table";
import { useErrorStore } from "../services/useErrorStore";
import * as XLSX from "xlsx";


const Assesment: React.FC = () => {
  const navigate = useNavigate();



  const columns = useMemo<Column<any>[]>(() => assessmentColumns(navigate) as Column<any>[], [navigate]);


  const [searchKey, setSearchKey] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchKeyLabel, setSearchKeyLabel] = useState<string>("");
  const [filteredData, setFilteredData] = useState([]);
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
    isLoading,
    isSuccess,

  } = useQuery({
    queryKey: ["assessmentData", searchKey, debouncedSearchValue, currentPage, pageSize],
    queryFn: () => getTableData("assesment", searchKey, debouncedSearchValue, currentPage, pageSize),

  });

  useEffect(() => {
    if (isSuccess) {
      if (fetchedData?.data?.data && fetchedData.data.data.length > 0) {
        setFilteredData(fetchedData.data.data);
        setTotalCount(fetchedData.data.total_count)
      } else {
        setFilteredData([]);
      }
    }
  }, [fetchedData, isSuccess]);


  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      vsAccessorName: "Accessor Name",
      vsResult: "Result",
      dtResultDate: "Result Date",
      vsTotalMarks: "TTotal Marks",
      vsObtainedMarks: "Obtained Marks",
      dtCreatedAt: "Created At",
      QPNOS: "QPNOS",
      SDMSid: "SDMS Id",
      dtStartDate: "Start Date",
      dtEndDate: "End Date",
      vsMarksheetUrl: "Marksheet URL",
      vsCertificateUrl: "Certificate URL",
      vsDepartmentName: "Department Name"
    };

    const formattedData = filteredData.map((item) => {
      return Object.keys(headersMap).reduce<Record<string, any>>((acc, key) => {
        let value: any = item[key];




        acc[headersMap[key as keyof typeof headersMap]] = value;
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assessment");

    XLSX.writeFile(workbook, "AssessmentData.xlsx");
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
        <p className="text-2xl font-bold mb-4">List Of Assessment</p>
        {bulkName === "assessment" && (
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
                { label: "Scheme Type", value: "vsSchemeType" },
                { label: "Fund Name", value: "vsFundName" },
                { label: "Sanction Date (yyyy/mm/dd)", value: "dtSanctionDate" }
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
              templateType={9}
              templateTitle="Assessment Template"
              Icon={DownloadCloud}
            />

            <ModalOpenButton
              modalType={11}
              modalTitle="Bulk Upload"
              bulkName="assessment"
              Icon={UploadCloud}

            />
            <ModalOpenButton
              modalType={8}
              modalTitle="Add Assessment"
              bulkName="Assessment"
              Icon={Add}

            />
          </div>
        </div>
        <div className="py-2 text-lg text-green-600">Showing : {totalCount} Results</div>
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
    </>
  );
};


export default Assesment;
