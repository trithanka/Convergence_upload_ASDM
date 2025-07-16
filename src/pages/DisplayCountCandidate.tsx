import React, { useEffect, useMemo, useState } from "react";
import Loader from "../components/ui/Loader";
import { getTableData } from "../services/state/api/tableDataApi";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../services/state/useDebounce";
import { Column } from "react-table";
import { ArrowLeft } from "lucide-react";



import SearchInputBox from "../components/ui/SearchInputBox";
import SearchDropdown from "../components/ui/SearchDropdown";

import { getMasterData } from "../services/state/api/masterApi";
import CentralizedTable from "../components/CentralizedTable";
import { candidateColumns } from "../utils/tableColumns";
import { useNavigate } from "react-router-dom";
import DownloadDropdownButton from "../components/downloadDown";
import { format, formatDate } from "date-fns";
import * as XLSX from "xlsx";


const DisplayCountCandidate: React.FC = () => {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchKeyLabel, setSearchKeyLabel] = useState<string>("");
  const columns = useMemo(() => candidateColumns(navigate), [navigate]);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [filteredData, setFilteredData] = useState([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  // Get selectedBatchId from localStorage when component mounts
  useEffect(() => {
    const batchId = localStorage.getItem("selectedBatchId");
    if (batchId) {
      setSelectedBatchId(batchId);
      console.log("Retrieved Batch ID from localStorage:", batchId);
    }
  }, []);

  const [selectedDuplicates, setSelectedDuplicates] = useState<{
    vsCandidateName: boolean;
    vsDOB: boolean;
    vsUUID: boolean;
    vsMobile: boolean;
    vsGender: boolean;
  }>({
    vsCandidateName: true,
    vsDOB: true,
    vsUUID: true,
    vsMobile: false,
    vsGender: true,
  });



  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setSelectedDuplicates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  console.log(handleCheckboxChange);

  const duplicateQuery = Object.keys(selectedDuplicates)
    .filter((key) => selectedDuplicates[key as keyof typeof selectedDuplicates])
    .map((key) => key as string);

  const debouncedSearchValue = useDebounce(searchValue, 1000);


  // Fetch gender data for dropdown
  const { data: genderData } = useQuery({
    queryKey: ["masterData", "gender"],
    queryFn: () => getMasterData("gender"),
  });



  // Create gender options from fetched data
  const genderOptions = useMemo(() => {
    if (!genderData?.data?.result?.gender) return [];
    return genderData.data.result.gender.map(
      (gender: { pklGenderId: number; vsGenderName: string }) => ({
        label: gender.vsGenderName,
        value: String(gender.pklGenderId),
      })
    );
  }, [genderData]);

  // Use the search key and debounced search value directly
  // The search value will be set appropriately by the handlers

  const {
    data: fetchedData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [
      "candidateData",
      searchKey,
      debouncedSearchValue,
      currentPage,
      pageSize,
      selectedBatchId,      
      ...duplicateQuery,
   
    
    ],
    queryFn: () => {
      // Create the payload with batch ID
      const payload = {
        queryType: "candidate",
        searchKey,
        searchValue: debouncedSearchValue,
        currentPage,
        pageSize,
        batchId: selectedBatchId, // Include the batch ID from localStorage
        duplicateQuery,
        duplicateCurrentPage: 1,
        duplicatePageSize: 25,
        duplicateType: "ownDept"
      };

      console.log("API Payload with Batch ID:", payload);

      return getTableData(
        "candidate",
        searchKey,
        debouncedSearchValue,
        currentPage,
        pageSize,
        duplicateQuery,
        1, // duplicateCurrentPage
        25, // duplicatePageSize
        "ownDept", // duplicateType
        selectedBatchId // Pass the batch ID
      );
    },
  });
  useEffect(() => {
    if (isSuccess) {
      if (fetchedData?.data?.data && fetchedData.data.data.length > 0) {
        setFilteredData(fetchedData.data.data);
        setTotalCount(fetchedData.data.total_count);
     
      } else {
        setFilteredData([]);
      }
    }
  }, [fetchedData, isSuccess]);


  const { data: DownloadData } = useQuery({
    queryKey: ["DownloadData",totalCount],
    queryFn: () => getTableData("candidate" ,"","",1,totalCount,[],1,totalCount,"ownDept",selectedBatchId),
    enabled: !!totalCount,
  });


  const handleDropdownSelect = (option: { label: string; value: string }) => {
    setSearchKey(option.value);
    setSearchKeyLabel(option.label);
    setSearchValue("");
    setSelectedGender("");
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };



  const handleGenderSelect = (option: { label: string; value: string }) => {
    setSelectedGender(option.value);
    setSearchValue(option.value); // Set this as the search value

    // Send payload with selected gender
    console.log("Selected Gender payload:", {
      genderId: option.value,
      genderLabel: option.label,
      timestamp: new Date().toISOString(),
      action: "gender_filter_selected"
    });
  };

  const handleBackToBatches = () => {
    // Clear the selected batch ID from localStorage
    localStorage.removeItem("selectedBatchId");
    // Navigate back to the batch page
    navigate("/batch");
  };

  const handleDownload = (value: number) => {
    console.log("Download value:", value);
    if (value === 1) {
       exportToExcel2();
    } else {
      exportToExcel();
    }
  };

  const exportToExcel2 = () => {
    console.log(DownloadData);
    if (!DownloadData || DownloadData.length === 0) {
      alert("No data available to export");
      return;
    }


    const headersMap = {
      vsCandidateName: "Candidate Name",
      vsDOB: "Date Of Birth",
      UUID: "UUID(Aadhar last 4 DIGIT)",
      // vsMobile: "Mobile",
      vsDepartmentName: "Department Name",
      // vsFatherName: "FATHER 2",
      vsGenderName: "Gender",
      // vsQualificaion: "Education attained",
      // UUID: "UUID",
      religion: "Religion",
      caste: "Caste",
      vsQualification: "Qualification",
      disability: "Disability",
      teaTribe: "Tea Tribe",
      BPLcardHolder: "BPL Card Holder",
      Minority: "Minority",
      batchNo: "Batch No",
      dropout: "Batch Dropout",
      // SDMSBatchId: "SDMS Batch ID",
      startDate: "Batch Start Date",
      endDate: "Batch End Date",
      courseName: "Course Name",
      // courseCode: "Course Code",
      TC: "TC Name ",
      // tcPartnerCode: "TP Code",
      // tcSpocName: "TC SPOC Name",
      // tcSpocContactNo: "TC SPOC Contact No",
      tcAddress: "TC Address",
      // tcSpocEmail: "SPOC Email",
      // tcVillage: "TC Village",
      // tcCity: "TC City",
      // tcState: "TC State",
      // tcDistrict: "TC District",
      // tcBlock: "TC Block",
      // tcUlb: "TC ULB",
      // smartId: "Smart ID",
      // tcLongitude: "TC Longitude",
      // tcLatitude: "TC Latitude",
      // tcAssembly: "TC Asembly",
      // tcLoksabha: "TC Loksabha",
      TP:"TP Name",
      // tpCode: "TP Code",
      // tpSpocName: "TP SPOC Name",
      // tpSpocContactNo: "TP SPOC Contact No",
      // tpSpocEmail: "TP SPOC Email",
      // state: "State",
      // district: "Dsitrict",
      tpAddress:"TP Address",
      // tpVillage: "TP VIllage",
      // tpCity: "TP CIty",
      // tpBlock: "TP BLock",
      // tpULB: "TP ULB",
      // tpSmartId: "TP Smart ID",
      sector: "Sector",
      vsResult : "Result",
      candidatePlaced: "Candidate PLaced",
      // employeerName: "Employee Name",
      // EmployeerContactNumber: "Employer Contact Number",
      placementType: "Placement Type",
      // placementState: "Placement State",
      // placementDistrict: "Placement District",
    };
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      try {
        return format(new Date(dateString), "dd/MM/yyyy");
      } catch {
        return dateString;
      }
    };

    const formattedData = DownloadData.data.data.map((item :any) => {
      return Object.keys(headersMap).reduce((acc, key) => {
        const headerKey = key as keyof typeof headersMap;
        const itemKey = key as keyof typeof item ;
        let value = item[itemKey] ?? " ";
        
        // Format dates
        if (["vsDOB", "startDate", "endDate"].includes(key)) {
          acc[headersMap[headerKey]] = formatDate(value as string);
          return acc;
        }
        
        acc[headersMap[headerKey]] = value;
        return acc;
      }, {} as Record<string, unknown>);
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");

    XLSX.writeFile(workbook, "CandidateData.xlsx");
  }; 


  const exportToExcel = () => {
    if (!fetchedData || fetchedData.length === 0) {
      alert("No data available to export");
      return;
    }

    const headersMap = {
      vsCandidateName: "Candidate Name",
      vsDOB: "Date Of Birth",
      UUID: "UUID(Aadhar last 4 DIGIT)",
      // vsMobile: "Mobile",
      vsDepartmentName: "Department Name",
      // vsFatherName: "FATHER 2",
      vsGenderName: "Gender",
      // vsQualificaion: "Education attained",
      // UUID: "UUID",
      religion: "Religion",
      caste: "Caste",
      vsQualification: "Qualification",
      disability: "Disability",
      teaTribe: "Tea Tribe",
      BPLcardHolder: "BPL Card Holder",
      Minority: "Minority",
      batchNo: "Batch No",
      dropout: "Batch Dropout",
      // SDMSBatchId: "SDMS Batch ID",
      startDate: "Batch Start Date",
      endDate: "Batch End Date",
      courseName: "Course Name",
      // courseCode: "Course Code",
      TC: "TC Name ",
      // tcPartnerCode: "TP Code",
      // tcSpocName: "TC SPOC Name",
      // tcSpocContactNo: "TC SPOC Contact No",
      tcAddress: "TC Address",
      // tcSpocEmail: "SPOC Email",
      // tcVillage: "TC Village",
      // tcCity: "TC City",
      // tcState: "TC State",
      // tcDistrict: "TC District",
      // tcBlock: "TC Block",
      // tcUlb: "TC ULB",
      // smartId: "Smart ID",
      // tcLongitude: "TC Longitude",
      // tcLatitude: "TC Latitude",
      // tcAssembly: "TC Asembly",
      // tcLoksabha: "TC Loksabha",
      TP:"TP Name",
      // tpCode: "TP Code",
      // tpSpocName: "TP SPOC Name",
      // tpSpocContactNo: "TP SPOC Contact No",
      // tpSpocEmail: "TP SPOC Email",
      // state: "State",
      // district: "Dsitrict",
      tpAddress:"TP Address",
      // tpVillage: "TP VIllage",
      // tpCity: "TP CIty",
      // tpBlock: "TP BLock",
      // tpULB: "TP ULB",
      // tpSmartId: "TP Smart ID",
      sector: "Sector",
      vsResult : "Result",
      candidatePlaced: "Candidate PLaced",
      // employeerName: "Employee Name",
      // EmployeerContactNumber: "Employer Contact Number",
      placementType: "Placement Type",
      // placementState: "Placement State",
      // placementDistrict: "Placement District",
    };

    const formattedData = fetchedData.data.data.map((item :any) => {
      return Object.keys(headersMap).reduce((acc, key) => {
        const headerKey = key as keyof typeof headersMap;
        const itemKey = key as keyof typeof item ;
        let value = item[itemKey] ?? " ";
        
        // Format dates
        if (["vsDOB", "startDate", "endDate"].includes(key)) {
              acc[headersMap[headerKey]] =  formatDate(value as string  , "dd/MM/yyyy");
          return acc;
        }
        
        acc[headersMap[headerKey]] = value;
        return acc;
      }, {} as Record<string, unknown>);
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schemes");

    XLSX.writeFile(workbook, "CandidateData.xlsx");
  }; 



  

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold">List Of Candidates</p>
          <button
            onClick={handleBackToBatches}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Batches
          </button>
        </div>
        {selectedBatchId && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
            <p className="text-blue-800 font-medium">
              Showing candidates for Batch ID: <span className="font-bold">{selectedBatchId}</span>
            </p>
          </div>
        )}
       

        

        <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
          <div className="flex items-center space-x-4">
            {/* Main search type dropdown */}
            <SearchDropdown
              options={[
              
                { label: "Candidate Name", value: "vsCandidateName" },
                { label: "Gender", value: "gender" },
              ]}
              onSelect={handleDropdownSelect}
              selected={searchKey}
              placeholder="Search by field"
            />

            {/* Conditional rendering based on search type */}
            {searchKey === "vsCandidateName" && (
              <>
                <SearchInputBox
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={`Enter ${searchKeyLabel}`}
                />
              </>
            )}
            {searchKey === "gender" && (
              <>
                <SearchDropdown
                  options={genderOptions}
                  onSelect={handleGenderSelect}
                  selected={selectedGender}
                  placeholder="Select Gender"
                />
              </>
            )}

            {/* Clear button - show when any search is active */}
            {searchKey && (
              <button
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-800"
                onClick={() => {
                  setSearchValue("");
                  setSearchKey("");
                  setSearchKeyLabel("");
                
                  setSelectedGender("");
                  setFilteredData(fetchedData?.data?.data || []);
                }}
              >
                Clear
              </button>
            )}
          </div>
         
        </div>
        </div>
       <div className="pt-10">
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold">Department Entries</p>
        
        </div>
        <div className="py-2 text-lg text-green-600">
          Total Department Entries: {totalCount}
        </div>
        <div className="flex justify-end mb-4">
        <DownloadDropdownButton
          options={[
            { label: "All Value", value: 1 },
            { label: "Display Value", value: 2},
          ]}
          onDownload={handleDownload}
          placeholder="Select Download Type"
          buttonLabel="Download"
        />
        </div>
        {/* Table Component */}
        <CentralizedTable
          columns={columns as Column<any>[]}
          data={filteredData}
          pageSize={pageSize}
          currentPage={currentPage}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    

    
    </>
  );
};

export default DisplayCountCandidate;
