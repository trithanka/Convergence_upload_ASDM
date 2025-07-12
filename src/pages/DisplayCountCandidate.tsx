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
