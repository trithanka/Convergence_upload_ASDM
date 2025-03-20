// @ts-nocheck

import { Column } from "react-table";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import StatusToggleButton from "../pages/department-creation/components/StatusToggleButton";
import { Trash2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

interface SchemeData {
  pklSchemeId: string;
  vsSchemeName: string;
  vsSchemeType: string;
  vsSchemeCode: string;
  vsFundName: string;
  vsSchemeFundingType: string;
  vsSchemeFUndingRatio: string;
  sanctionOrderNo: string;
  dtSanctionDate: string;
  count: string;
  Action?: unknown;
}

export const schemeColumns: (
  navigate: ReturnType<typeof useNavigate>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
) => Column<SchemeData>[] = (_navigate) => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Scheme Name", accessor: "vsSchemeName" },
  
  { Header: "Scheme Type", accessor: "vsSchemeType" },
  { Header: "Scheme Code", accessor: "vsSchemeCode" },
  { Header: "Fund Name", accessor: "vsFundName" },
  { Header: "Fund Type", accessor: "vsSchemeFundingType" },
  { Header: "Fund Ratio", accessor: "vsSchemeFUndingRatio" },
  { Header: "Sanction Order Number", accessor: "sanctionOrderNo" },
  {
    Header: "Sanction Date",
    accessor: "dtSanctionDate",
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },
];

interface SchemeDuplicateData {
  vsSchemeName: string;
  vsSchemeType: string;
  vsFundingType: string;
  vsFundName: string;
  vsDepartmentName: string;
  Action?: unknown;
}

export const schemeDuplicateColumns: (
  navigate: ReturnType<typeof useNavigate>,
  duplicateQuery: string[] // Accept duplicateQuery here
) => Column<SchemeDuplicateData>[] = (_navigate, duplicateQuery) => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  
  {
    Header: "Scheme Name",
    accessor: "vsSchemeName",
    Cell: ({ value }) => (
      <span
        className={duplicateQuery.includes("vsSchemeName") ? "bg-yellow-200" : ""}
      >
        {value}
      </span>
    ),
  },
 
  {
    Header: "Scheme Type",
    accessor: "vsSchemeType",
    Cell: ({ value }) => (
      <span
        className={duplicateQuery.includes("vsSchemeType") ? "bg-yellow-200" : ""}
      >
        {value}
      </span>
    ),
  },
  {
    Header: "Fund Name",
    accessor: "vsFundName",
    Cell: ({ value }) => (
      <span
        className={duplicateQuery.includes("vsFundName") ? "bg-yellow-200" : ""}
      >
        {value}
      </span>
    ),
  },
  {
    Header: "Fund Type",
    accessor: "vsFundingType",
    Cell: ({ value }) => (
      <span
        className={duplicateQuery.includes("vsSchemeFundingType") ? "bg-yellow-200" : ""}
      >
        {value}
      </span>
    ),
  },
  {
    Header: "Department Name",
    accessor: "vsDepartmentName",
    Cell: ({ value }) => (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}> 
        {value?.split(",").map((item, index) => (
          <span 
            key={index} 
            style={{ 
              backgroundColor: "#cce5ff", // Highlight color (Yellow)
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            {item}
          </span>
        ))}
      </div>
    )
  }
  
  
  

];


interface TargetData {
  pklTargetId: number;
  vsSchemeCode: string;
  iTotalTarget: string;
  dtSanctionDate: string;
  vsTargetNo: number;
  TotalTarget: string;
  vsTargetType: string;
  Action: unknown;
}

export const targetColumns = (
  navigate: (path: string) => void
): Column<TargetData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Scheme Code", accessor: "vsSchemeCode" },
  { Header: "Target Order Number", accessor: "vsTargetNo" },
  { Header: "Target Type", accessor: "vsTargetType" },
  {
    Header: "Date Of Target",
    accessor: "dtSanctionDate",
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },
  { Header: "Total Target", accessor: "iTotalTarget" },
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/target/${row.original.pklTargetId}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface CourseData {
  id: string;
  vsCourseName: string;
  vsCourseCode: string;
  dtFromDate: string;
  dtToDate: string;
  JobRoleName: string;
  iTheoryDurationInHours: string;
  iPracticalDurationInHours: string;

  vsSectorName: string;
  Action: unknown;
}

export const courseColumns = (
  navigate: (path: string) => void
): Column<CourseData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Sector Name", accessor: "vsSectorName" },
  { Header: "Job Role Name", accessor: "vsCourseName" },
  { Header: "QPNOS Code", accessor: "vsCourseCode" },
  {
    Header: "From Date",
    accessor: "dtFromDate",
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },
  {
    Header: "To Date",
    accessor: "dtToDate",
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },

  { Header: "Total Theory Hours", accessor: "iTheoryDurationInHours" },
  { Header: "Total Practical Hours", accessor: "iPracticalDurationInHours" },

  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/target/${row.original.id}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];



interface CourseDuplicateData {
  id: string;
  vsCourseName: string;
  vsCourseCode: string;
  departmentNames: string;
  
  Action: unknown;
}

export const courseDuplicateColumns = (
  navigate: (path: string) => void
): Column<CourseDuplicateData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },

  { Header: "Job Role Name", accessor: "vsCourseName" },
  { Header: "QPNOS Code", accessor: "vsCourseCode" },
  {
    Header: "Department Name",
    accessor: "departmentNames",
    Cell: ({ value }) => (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}> 
        {value?.split(",").map((item, index) => (
          <span 
            key={index} 
            style={{ 
              backgroundColor: "#cce5ff", // Highlight color (Yellow)
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            {item}
          </span>
        ))}
      </div>
    )
  }
  
  

  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/target/${row.original.id}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface TrainingPartnerData {
  id: string;
  vsTpName: string;
 
  iSpocContactNum: string;
  department_names: string;
  vsSpocName: string;
  vsState: number;
  vsDistrict: number;
  vsBlock: number;
  vsPan: string
  vsVillage: string;
  vsAddress: string;
  vsSmartId: string;
  isVillageCity: string;
  vsCity: string;
  vsULB: number;
  pklTpId: string;
  count: number;
  Action: unknown;
}

export const trainingColumns: (
  navigate: ReturnType<typeof useNavigate>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
) => Column<TrainingPartnerData>[] = (_navigate) => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },

  { Header: "Partner Name", accessor: "vsTpName" },
  { Header: "PAN", accessor: "vsPan" },
  { Header: "SPOC Name", accessor: "vsSpocName" },
 
  { Header: "SPOC Contact", accessor: "iSpocContactNum" },
  { Header: "Address", accessor: "vsAddress" },
  { Header: "State", accessor: "vsState" },
  { Header: "District", accessor: "vsDistrict" },

];

export const DuplicateTrainingColumns = (
  navigate: (path: string) => void,
  duplicateQuery: string[],
  isCrossDepartmentDuplicate: boolean = false
): Column<TrainingPartnerData>[] => {
  const columns: Column<TrainingPartnerData>[] = [
    { Header: "Sl No", accessor: (_row, rowIndex) => rowIndex + 1 },
    // {
    //   Header: "Centers",
    //   accessor: "count",
    // },
    { Header: "Partner Name", accessor: "vsTpName" },
    {
      Header: "PAN",
      accessor: "vsPan",
      Cell: ({ value }) => (
        <span
          className={`capitalize ${duplicateQuery.includes("vsPan") ? "bg-yellow-200 font-bold p-1 rounded" : ""}`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Department Name",
      accessor: "departmentNames",
      Cell: ({ value }) => (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}> 
          {value?.split(",").map((item, index) => (
            <span 
              key={index} 
              style={{ 
                backgroundColor: "#cce5ff", // Highlight color (Yellow)
                padding: "5px 10px",
                borderRadius: "5px",
                fontWeight: "bold"
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )
    }
    
   
  ];
  // if (!isCrossDepartmentDuplicate) {
  //   columns.push(
  //     {
  //       Header: "Action",
  //       accessor: "Action",
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       Cell: ({ row }) => {
  //         const [open, setOpen] = useState(false);

  //       const handleDelete = () => {
  //         setOpen(false);
  //       };

  //       return (
  //         <>
  //           <button className="text-red-500" onClick={() => setOpen(true)}>
  //             <Trash2 className="w-5 h-5" />
  //           </button>

  //           {/* MUI Confirm Dialog */}
  //           <Dialog open={open} onClose={() => setOpen(false)}>
  //             <DialogTitle>Confirm Deletion</DialogTitle>
  //             <DialogContent>Are you sure to delete the TP?</DialogContent>
  //             <DialogActions>
  //               <Button onClick={() => setOpen(false)} color="primary">
  //                 Cancel
  //               </Button>
  //               <Button onClick={handleDelete} color="error">
  //                 Yes, Delete
  //               </Button>
  //             </DialogActions>
  //           </Dialog>
  //         </>
  //       );
  //     },
  //   });
  // }
  return columns;
};

interface TrainingCenterData {
  pklTcId: number;
  vsTcName: string;
  vsTcCode: string;
  vsSpocName: string;
  iPartnerCode: string;
  Action: unknown;
}

export const centerColumns = (
  navigate: (path: string) => void
): Column<TrainingCenterData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Training Center Name", accessor: "vsTcName" },
  // { Header: "TC Code", accessor: "vsTcCode" },
  { Header: "SPOC Name", accessor: "vsSpocName" },
  { Header: "Partner Code", accessor: "iPartnerCode" }, 
  { Header: "District", accessor: "vsDistrict" },
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/target/${row.original.pklTcId}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface TrainingCenterDuplicateData {
  pklTcId: number;
  vsTcName: string;
  vsDistrict: string;
  vsLocation: string;
  vsDepartmentName: string;
  Action: unknown;
}

export const centerDuplicateColumns = (
  navigate: (path: string) => void
): Column<TrainingCenterDuplicateData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "TC Name", accessor: "vsTcName" },
  { Header: "Tp Name", accessor: "vsTpName" },
  { Header: "District", accessor: "vsDistrictName" },
  {
    Header: "Latitude/Longitude",
    accessor: "location",
    Cell: ({ row }) => `${row.vsLatitude} , ${row.vsLongitude}`
  },
  
  { Header: "Partner Code", accessor: "iPartnerCode" },
  
  {
    Header: "Department Name",
    accessor: "vsDepartmentName",
    Cell: ({ value }) => (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}> 
        {value?.split(",").map((item, index) => (
          <span 
            key={index} 
            style={{ 
              backgroundColor: "#cce5ff", // Highlight color (Yellow)
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            {item}
          </span>
        ))}
      </div>
    )
  }
  
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/target/${row.original.pklTcId}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface BatchData {
  pklBatchId: string;
  SDMSid: string;
  iBatchNumber: string;
  dtStartDate: string;
  dtEndDate: string;
  tcName: string;
  Action: unknown;
}

export const batchColumns = (
  navigate: (path: string) => void
): Column<BatchData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "TC Name", accessor: "tcName" },
  { Header: "Batch Number", accessor: "iBatchNumber" },
  { Header: "SDMS  ID", accessor: "SDMSid" },
  { Header: "Start Date", accessor: "dtStartDate", Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"), },
  { Header: "End Date", accessor: "dtEndDate", Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"), },
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/batch/${row.original.pklBatchId}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface AssessorsData {
  id: number;
  vsAssosserName: string;
  vsEmail: string;
  Mobile: string;
  vsMobile: string;
  vsAssesmentAgency: string;
  dtValidUpTo: string;
  Action: unknown;
}

export const assessorsColumns = (
  navigate: (path: string) => void
): Column<AssessorsData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Assessor Name", accessor: "vsAssosserName" },
  { Header: "PAN", accessor: "vsPan" },

  { Header: "Mobile", accessor: "vsMobile" },
  { Header: "Assessor Agency", accessor: "vsAssesmentAgency" },
  {
    Header: "Valid Upto",
    accessor: "dtValidUpTo",
    Cell: ({ value }: { value: string }) => moment(value).format("YYYY-MM-DD"),
  },
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/assessors/${row.original.id}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface AssessorsDuplicateData {
  id: number;
  AssessorName: string;
  vsPAN: string;
  departmentNames: string;
 
  Action: unknown;
}

export const assessorsDuplicateColumns = (
  navigate: (path: string) => void
): Column<AssessorsDuplicateData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Assessor Name", accessor: "AssessorName" },
  { Header: "PAN", accessor: "vsPAN" },

  {
    Header: "Department Name",
    accessor: "departmentNames",
    Cell: ({ value }) => (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}> 
        {value?.split(",").map((item, index) => (
          <span 
            key={index} 
            style={{ 
              backgroundColor: "#cce5ff", // Highlight color (Yellow)
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            {item}
          </span>
        ))}
      </div>
    )
  }
  
  
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/assessors/${row.original.id}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface TrainerData {
  pklConvTrainerId: number;
  // trainerId: string;
  vsTrainerName: string;
  vsEmail: string;
  vsMobile: string;
  vsPAN: string;
  Action: unknown;
}

export const trainerColumns = (
  navigate: (path: string) => void
): Column<TrainerData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  // { Header: "Trainer ID", accessor: "trainerId" },
  { Header: "Trainer Name", accessor: "vsTrainerName" },
  { Header: "Mobile", accessor: "vsMobile" },
  { Header: "Email", accessor: "vsEmail" },
  { Header: "IDCard", accessor: "vsPAN" },
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/trainer/${row.original.pklConvTrainerId}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface TrainerDuplicateData {
 
  // trainerId: string;
  TrainerName: string;
  vsPAN: string;
  departmentNames: string;
 
}

export const trainerDuplicateColumns = (
  navigate: (path: string) => void
): Column<TrainerDuplicateData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Trainer Name", accessor: "TrainerName" },
  { Header: "PAN", accessor: "vsPAN" },
  {
    Header: "Department Name",
    accessor: "departmentNames",
    Cell: ({ value }) => (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}> 
        {value?.split(",").map((item, index) => (
          <span 
            key={index} 
            style={{ 
              backgroundColor: "#cce5ff", // Highlight color (Yellow)
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            {item}
          </span>
        ))}
      </div>
    )
  }
  
 
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() => navigate(`/trainer/${row.original.pklConvTrainerId}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface AssessmentData {
  pklConvAssessmentId: string;
  batchId: string;
  SDMSBatchId: string;
  // candidateId: string;
  // dtAssessmentDate: string;
  // vsAgency: string;
  vsTotalMarks: string;
  vsObtainedMarks: string;
  // vsMarksheetUrl: string;
  // vsCertificateUrl: string;
  // vsAccessorName: string;
  vsResult: string;
  dtResultDate: string;
  Action: unknown;
}

export const assessmentColumns = (
  navigate: (path: string) => void
): Column<AssessmentData>[] => [
  // { Header: "SlNo.", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Batch ID", accessor: "batchId" },
  { Header: "SDMS Batch ID", accessor: "SDMSBatchId" },
  // { Header: "Candidate ID", accessor: "candidateId" },
  {
    Header: "Assessment Date",
    accessor: "dtAssessmentDate",
    Cell: ({ value }) => moment(value).format("YYYY-MM-DD") ?? "N/A",
  },
  // { Header: "Agency", accessor: "vsAgency" },

  // { Header: "Accessor Name", accessor: "vsAccessorName" },
  {
    Header: "Result Date",
    accessor: "dtResultDate",
    Cell: ({ value }) =>
      value ? moment(value).format("YYYY-MM-DD") : "N/A", // Check if value exists before formatting
  },
  // {
  //   Header: "Marksheet",
  //   accessor: "vsMarksheetUrl",
  //   Cell: ({ row }) => (
  //     <a
  //       href={row.original.vsMarksheetUrl}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </a>
  //   ),
  // },
  // {
  //   Header: "Certificate",
  //   accessor: "vsCertificateUrl",
  //   Cell: ({ row }) => (
  //     <a
  //       href={row.original.vsCertificateUrl}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </a>
  //   ),
  // },
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() =>
  //         navigate(`/assessment/${row.original.pklConvAssessmentId}`)
  //       }
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface PlacementData {
  pklConvPlacementId: string;
  batchId: string;
  candidateId: string;
  bIsCandidatePlaced: string;
  vsEmployeerName: string;
  vsPlacementType: string;
  vsCandidateName: string;
  Action: unknown;
}

export const placementColumns = (
  navigate: (path: string) => void
): Column<PlacementData>[] => [
  // { Header: "SlNo.", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Batch ID", accessor: "batchId" },
  { Header: "Candidate ID", accessor: "candidateId" },
  { Header: "Candidate Name", accessor: "vsCandidateName" },
  { Header: "Is Placed", accessor: "bIsCandidatePlaced" },
  { Header: "Placement Type", accessor: "vsPlacementType" },
  { Header: "Employer Name", accessor: "vsEmployeerName" },

  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() =>
  //         navigate(`/placement/${row.original.pklConvPlacementId}`)
  //       }
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface PlacementDuplicateData {
  vsCandidateName: string;
  vsDOB: string;
  departmentNames: string;
 
  Action: unknown;
}

export const placementDuplicateColumns = (
  navigate: (path: string) => void
): Column<PlacementDuplicateData>[] => [
  // { Header: "SlNo.", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Candidate Name", accessor: "vsCandidateName" },
  { Header: "DOB", accessor: "vsDOB" },
  {
    Header: "Department Name",
    accessor: "departmentNames",
    Cell: ({ value }) => (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}> 
        {value?.split(",").map((item, index) => (
          <span 
            key={index} 
            style={{ 
              backgroundColor: "#cce5ff", // Highlight color (Yellow)
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            {item}
          </span>
        ))}
      </div>
    )
  }
  

  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }) => (
  //     <button
  //       onClick={() =>
  //         navigate(`/placement/${row.original.pklConvPlacementId}`)
  //       }
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface DepartmentListData {
  id: string;
  BatchId: string;
  departmentName: string;
  adminName: string;
  phoneNumber: string;
  createdDate: string;
  userName: string;
  bEnable: number;
  dtLastLogin: string;
  password: string;
  Action: unknown;
  pklDepartmentId: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const departmentListColumns: Column<DepartmentListData>[] = [
 
  {
    Header: "Department Name",
    accessor: "departmentName",
    Cell: ({ value }) => <span className="capitalize">{value ?? "N/A"}</span>,
  },
  {
    Header: "User Name",
    accessor: "userName",
    Cell: ({ value }) => value ?? "N/A",
  },
  {
    Header: "Created By",
    accessor: "createdBY",
    Cell: ({ value }) => value ?? "N/A",
  },
  {
    Header: "Created At",
    accessor: "createdDate",
    Cell: ({ value }) => moment(value).format("YYYY-MM-DD") ?? "N/A",
  },
  // {
  //   Header: "Created By",
  //   accessor: "adminName",
  //   Cell: ({ value }) => value ?? "N/A",
  // },
 
  {
    Header: "Last Login",
    accessor: "dtLastLogin",
    Cell: ({ value }) => value ?? "-",
    // Cell: ({ row }) => {
    //   if (!row || !row) {
    //     return <span style={{ color: "red" }}>No Data</span>;
    //   }
  
    //   console.log("Row Original Data:", row);
  
    //   return (
    //     <div className="flex flex-col items-center">
    //       <span style={{ color: row.bEnable === 0 ? "red" : "green" }}>
    //         {row.bEnable === 0 ? "Inactive" : "Active"}
    //       </span>
    //       <StatusToggleButton
    //         initialStatus={row.bEnable}
    //         pklTargetId={row.pklDepartmentId}
    //       />
    //     </div>
    //   );
    // },
  }
  
  
  
  
  
  
  
];

interface InvoiceData {
  pklConvInvoiceId: string;
  vsInvoiceTranche: string;
  vsInvoiceDate: string;
  vsInvoiceNo: string;
  fAmount: string;
  fRate: string;
  iTotalCandidate: string;

  Action: unknown;
}

export const invoiceColumns = (
  navigate: (path: string) => void
): Column<InvoiceData>[] => [
  // { Header: "sl no", accessor: (_row, rowIndex) => rowIndex + 1 },
  { Header: "Invoice Tranche", accessor: "vsInvoiceTranche" },
  {
    Header: "Date",
    accessor: "vsInvoiceDate",
    Cell: ({ value }) => moment(value).format("YYYY-MM-DD") ?? "N/A",
  },
  { Header: "Invoice Number", accessor: "vsInvoiceNo" },
  { Header: "Amount", accessor: "fAmount" },
  { Header: "Rate", accessor: "fRate" },
  { Header: "Total Candidate", accessor: "iTotalCandidate" },
  {
    Header: "Action",
    accessor: "Action",
    Cell: ({ row }) => (
      <button
        onClick={() => navigate(`/invoice/${row.original.pklConvInvoiceId}`)}
        className="text-blue-500 hover:underline"
      >
        View
      </button>
    ),
  },
];

export interface CandidateData {
  candidateId: string;
  iBatchNumber: string;
  vsCandidateName: string;
  department_names?: string;
  duplicate_count?: string;
  vsDOB: string;
  iAge: string;
  pklGenderId: string;
  vsMobile: string;
  pklQualificationId: string;
  vsCandidateKey?: string;
  caste?: string;
  vsGenderName?: string;
  vsQualification?: string;
  Action?: unknown;
}

export const candidateColumns = (
  navigate: (path: string) => void
): Column<CandidateData>[] => [
  {
    Header: "Candidate Name",
    accessor: "vsCandidateName",
    Cell: ({ value }: CellProps<CandidateData, string | undefined>) => (
      <span className="capitalize">{value || "N/A"}</span>
    ),
  },
  {
    Header: "Date Of Birth",
    accessor: "vsDOB",
    Cell: ({ value }: { value: string | undefined }) =>
      value ? moment.utc(value).format("DD-MM-YYYY") : "N/A",
  },
  
  
  
  
  {
    Header: "Caste",
    accessor: "caste",
    Cell: ({ value }: CellProps<CandidateData, string | undefined>) => value || "N/A",
  },
  {
    Header: "Gender",
    accessor: "vsGenderName",
    Cell: ({ value }: CellProps<CandidateData, string | undefined>) => value || "N/A",
  },
  {
    Header: "Mobile",
    accessor: "vsMobile",
    Cell: ({ value }: CellProps<CandidateData, string | undefined>) => value || "N/A",
  },
  {
    Header: "Qualification",
    accessor: "vsQualification",
    Cell: ({ value }: CellProps<CandidateData, string | undefined>) => value || "N/A",
  },
  {
    Header: "Aadhar (Last 4 Digit)",
    accessor: "UUID",
    Cell: ({ value }: CellProps<CandidateData, string | undefined>) => value || "N/A",
  },
  // {
  //   Header: "Action",
  //   accessor: "Action",
  //   Cell: ({ row }: CellProps<CandidateData, unknown>) => (
  //     <button
  //       onClick={() => navigate(`/candidate/${row.original.candidateId}`)}
  //       className="text-blue-500 hover:underline"
  //     >
  //       View
  //     </button>
  //   ),
  // },
];

interface DepartmentData {
  Id: number;
  vsDepartmentName: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const departmentColumns = (): Column<DepartmentData>[] => [
  {
    Header: "ID",
    accessor: (_row: DepartmentData, rowIndex: number) => rowIndex + 1,
  },
  { Header: "Department Name", accessor: "vsDepartmentName" },
];


export const CrossCandidateColumns = (
  navigate: (path: string) => void,
  duplicateQuery: string[]
): Column<CandidateData>[] => [
 
  {
    Header: "Candidate Name",
    accessor: "vsCandidateName",
    Cell: ({ value }) => (
      <span
        className={`capitalize ${duplicateQuery.includes("vsCandidateName") ? "bg-yellow-200 font-bold p-1 rounded" : ""}`}
      >
        {value}
      </span>
    ),
  },
  {
    Header: "Date Of Birth",
    accessor: "vsDOB",
    Cell: ({ value }: { value: string }) => (
      <span className={duplicateQuery.includes("vsDOB") ? "bg-yellow-200 font-bold p-1 rounded" : ""}>
        {moment(value).format("DD-MM-YYYY")}
      </span>
    ),
  },
  {
    Header: "UUID",
    accessor: "vsUUID",
    Cell: ({ value }: { value: string }) => (
      <span className={duplicateQuery.includes("vsUUID") ? "bg-yellow-200 font-bold p-1 rounded" : ""}>
      {value}
      </span>
    ),
  },
  {
    Header: "Gender",
    accessor: "vsGenderName",
    Cell: ({ value }) => (
      <span
        className={`capitalize ${duplicateQuery.includes("vsGender") ? "bg-yellow-200 font-bold p-1 rounded" : ""}`}
      >
        {value}
      </span>
    ),
  },
  // {
  //   Header: "Phone",
  //   accessor: "vsMobile",
  //   Cell: ({ value }: { value: string }) => (
  //     <span className={duplicateQuery.includes("vsMobile") ? "bg-yellow-200 font-bold p-1 rounded" : ""}>
  //       {value}
  //     </span>
  //   ),
  // },
  {
    Header: "Department Name",
    accessor: "vsDepartmentName",
    Cell: ({ value }) => (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {value?.split(",").map((item, index) => (
          <span
            key={index}
            style={{
              backgroundColor: duplicateQuery.includes("departmentNames") ? "#ffeb3b" : "#cce5ff", // Highlight if selected
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    ),
  },
];



export const DuplicateCandidateColumns = (
  navigate: (path: string) => void,
  isCrossDepartmentDuplicate: boolean = false
): Column<CandidateData>[] => {
  const columns: Column<CandidateData>[] = [
    { Header: "ID", accessor: (_row, rowIndex) => rowIndex + 1 },
    {
      Header: "Candidate Name",
      accessor: "vsCandidateName",
        Cell: ({ value }) => value ? value : "N/A",
      Cell: ({ value }) => <span className="capitalize">{value}</span>,
    },
    {
      Header: "Date Of Birth",
      accessor: "vsDOB",
        Cell: ({ value }) => value ? value : "N/A",
      Cell: ({ value }: { value: string }) =>
        moment(value).format("DD-MM-YYYY"),
    },
    { Header: "Age", accessor: "iAge",  Cell: ({ value }) => value ? value : "N/A" },
    { Header: "Gender", accessor: "pklGenderId",  Cell: ({ value }) => value ? value : "N/A" },
    { Header: "Mobile", accessor: "vsMobile",  Cell: ({ value }) => value ? value : "N/A" },
    { Header: "Qualification", accessor: "pklQualificationId",  Cell: ({ value }) => value ? value : "N/A" },
    {
      Header: "Department",
      accessor: "department_names",
        Cell: ({ value }) => value ? value : "N/A",
      Cell: ({ value }) => {
        return value ? value : "N/A";
      },
    },
  ];
  if (!isCrossDepartmentDuplicate) {
    columns.push({
      Header: "Action",
      accessor: "Action",
      Cell: ({ row }) => {
        const [open, setOpen] = useState(false);

        const handleDelete = () => {
          console.log("Deleting scheme:", row.original);
          setOpen(false);
        };

        return (
          <>
            <button className="text-red-500" onClick={() => setOpen(true)}>
              <Trash2 className="w-5 h-5" />
            </button>

            {/* MUI Confirm Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                Are you sure to delete the candidate?
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDelete} color="error">
                  Yes, Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        );
      },
    });
  }
  return columns;
};

interface SectorData {
  Id: number;
  vsSectorName: string;
}

export const sectorColumns = (): Column<SectorData>[] => [
  {
    Header: "ID",
    accessor: (_row: SectorData, rowIndex: number) => rowIndex + 1,
  },
  { Header: "Sector Name", accessor: "vsSectorName" },
];
