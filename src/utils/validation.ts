import Joi from "joi";
import { SchemeFormData } from "./formTypes";

export const SchemeValidation = Joi.object<SchemeFormData>({
  // selectedSchemeType: Joi.string()
  //   .valid("Type 1", "Type 2", "Type 3")
  //   .required()
  //   .messages({
  //     "any.required": "Scheme Type is required.",
  //     "string.empty": "Scheme Type is required.",
  //   }),

  // selectedFundingType: Joi.string()

  //   .required()
  //   .messages({
  //     "any.required": "Funding Type is required.",
  //     "string.empty": "Funding Type is required.",
  //   }),

  scheme: Joi.string().required().messages({
    "any.required": "Scheme Name is required.",
    "string.empty": "Scheme Name is required.",
  }),

  // schemeType: Joi.number().required().messages({
  //   "any.required": "Name is required.",
  //   "string.empty": "Name  is required.",
  // }),

  schemeCode: Joi.string().required().messages({
    "any.required": "Scheme Code is required.",
    "string.empty": "Scheme Code is required.",
  }),

 





  dateOfSanction: Joi.date().required().messages({
    "any.required": "Date of Sanction is required.",
    "date.base": "Invalid date format.",
  }),
  isSchemeFundingRatioDisabled: Joi.optional(),
});

export const courseSchema = Joi.object({
  fklSectorId: Joi.number().required().label("Sector Name").messages({
    "string.empty": "Sector Name is required.",
  }),
  qpnos: Joi.number().optional() ,
  vsCourseCode: Joi.string().optional().label("QPNOS Code").messages({
    "string.empty": "QPNOS Code is required.",
  }),
  vsCourseName: Joi.string().optional().label("Job Role Name").messages({
    "string.empty": "Job Role Name is required.",
  }),

  dtFromDate: Joi.optional(),
  dtToDate: Joi.optional(),
});

export const trainingPartnerSchema = Joi.object({
  vsTpName: Joi.string().required().label("Partner Name").messages({
    "string.empty": "Partner Name is required.",
    "any.required": "Partner Name is required.",
  }),
  // vsSpocName: Joi.string().required().label("SPOC Name").messages({
  //   "string.empty": "SPOC Name is required.",
  //   "any.required": "SPOC Name is required.",
  // }),

  // vsState: Joi.number().required().label("State").messages({
  //   "string.empty": "State is required.",
  //   "any.required": "State is required.",
  // }),
  // iSpocContactNum: Joi.string()
  //   .pattern(/^[0-9]{10}$/)
  //   .required()
  //   .label("Mobile")
  //   .messages({
  //     "string.empty": "Mobile number is required.",
  //     "string.pattern.base": "Mobile number must be 10 digits.",
  //     "any.required": "Mobile number is required.",
  //   }),
    // vsSpocEmail: Joi.string()
    // .email({ tlds: { allow: false } }) 
    // .required()
    // .label("Email")
    // .messages({
    //   "string.empty": "Email is required.",
    //   "string.email": "Email must be a valid email address.",
    //   "any.required": "Email is required.",
    // }),
  
  //   vsDistrict: Joi.number().required().label("Address").messages({
  //   "string.empty": "District is required.",
  //   "any.required": "District is required.",
  // }),

  vsAddress: Joi.string().required().label("Address").messages({
    "string.empty": "Address is required.",
    "any.required": "Address is required.",
  }),
  vsPAN: Joi.string().required().label("PAN").messages({
    "string.empty": "PAN Number is required.",
    "any.required": "PAN Number is required.",
  }),
  vsSmartId: Joi.optional() ,
  isVillageCity: Joi.optional(),

  vsCity: Joi.optional(),

  vsULB:Joi.optional(),

  vsBlock: Joi.optional(),

  vsVillage: Joi.optional(),
});

export const trainingCenterSchema = Joi.object({
  // vsTpName: Joi.string().required().label("Training Partner Name").messages({
  //   "string.empty": "Training Partner Name is required.",
  //   "any.required": "Training Partner Name is required.",
  // }),
  // partnerCode: Joi.string().required().label("Partner Code").messages({
  //   "string.empty": "Partner Code is required.",
  //   "any.required": "Partner Code is required.",
  // }),
  fklTpId: Joi.string().optional().label("Training Center Name").messages({
    "string.empty": "Training Center Name is required.",
    "any.required": "Training Center Name is required.",
  }),
  vsTcName: Joi.string().optional().label("Training Center Name").messages({
    "string.empty": "Training Center Name is required.",
    "any.required": "Training Center Name is required.",
  }),
  vsTcCode: Joi.string().optional().label("Training Center Code").messages({
    "string.empty": "Training Center Code is required.",
    "any.required": "Training Center Code is required.",
  }),
  vsSpocEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .label("SPOC Email")
    .messages({
      "string.empty": "SPOC Email is required.",
      "string.email": "SPOC Email must be a valid email address.",
      "any.required": "SPOC Email is required.",
    }),
  vsSpocName: Joi.string().optional().label("SPOC Name").messages({
    "string.empty": "SPOC Name is required.",
    "any.required": "SPOC Name is required.",
  }),
  vsState: Joi.number().optional().label("State").messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),
  vsAddress : Joi.string().optional().label("Address").messages({
    "string.empty": "Address is required.",
    "any.required": "Address is required.",
  }),
  vsDistrict: Joi.number().optional().label("District").messages({
    "string.empty": "District is required.",
    "any.required": "District is required.",
  }),
  vsBlock: Joi.number().when("isVillageCity", {
    is: "Village",
    then: Joi.optional().label("Block").messages({
      "string.empty": "Block is required for villages.",
      "any.required": "Block is required for villages.",
    }),
    otherwise: Joi.optional(),
  }),
  vsVillage: Joi.string().when("isVillageCity", {
    is: "Village",
    then: Joi.optional().label("Village").messages({
      "string.empty": "Village is required.",
      "any.required": "Village is required.",
    }),
    otherwise: Joi.optional(),
  }),

 
  iSpocContactNum: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .label("Mobile")
    .messages({
      "string.empty": "Mobile number is required.",
      "string.pattern.base": "Mobile number must be 10 digits.",
      "any.required": "Mobile number is required.",
    }),
  smartId: Joi.optional(),
  vsLongitude: Joi.string().required().label("Longitude").messages({
    "string.empty": "Longitude is required.",
    "any.required": "Longitude is required.",
  }),
  vsLatitude: Joi.string().required().label("Latitude").messages({
    "string.empty": "Latitude is required.",
    "any.required": "Latitude is required.",
  }),
});

export const assessorSchema = Joi.object({
  // assosserId: Joi.number().required().label("Assessor ID").messages({
  //   "string.empty": "Assessor ID is required.",
  // }),
  vsAssessorName: Joi.string().required().label("Assessor Name").messages({
    "string.empty": "Assessor Name is required.",
  }),
  vsPAN: Joi.string().required().label("PAN").messages({
    "string.empty": "PAN is required.",
  }),
  fklCourseId: Joi.number().required().label("QPNOS").messages({
    "string.empty": "QPNOS is required.",
  }),
  vsEmail: Joi.string()
    .email({ tlds: { allow: false } })
    
    .label("Email")
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
  vsMobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .label("Mobile")
    .messages({
      "string.empty": "Mobile number is required.",
      "string.pattern.base": "Mobile number must be 10 digits.",
    }),
    vsAssessmentAgency: Joi.string().required().label("Assessor Agency").messages({
    "string.empty": "Assessment Agency is required.",
  }),
  dtValidUpTo: Joi.date().required().label("Valid Upto").messages({
    "date.base": "Valid Up To must be a valid date.",
  }),
});

export const trainerSchema = Joi.object({
  // trainerId: Joi.string().required().messages({
  //   "string.empty": "Trainer ID is required.",
  //   "any.required": "Trainer ID is required.",
  // }),
  vsTrainerName: Joi.string().required().messages({
    "string.empty": "Trainer Name is required.",
    "any.required": "Trainer Name is required.",
  }),

  fklCourseId: Joi.number().required().messages({
    "string.empty": "Course Name is required.",
    "any.required": "Course Name is required.",
  }),
 
  vsMobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits.",
      "any.required": "Mobile number is required.",
    }),
  vsEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .label("Email").optional()
    .messages({
      "string.email": "Email must be a valid email address."
    }),
    fklTcId:  Joi.number().required().messages({
      "string.empty": "Training Center is required.",
      "any.required": "Training Center is required.",
    }),
  vsPAN: Joi.string().required().messages({
    "string.empty": "ID Card (PAN/Voter) is required.",
    "any.required": "ID Card is required.",
  }),
});

export const batchSchema = Joi.object({
  iBatchNumber: Joi.string().required().label("Batch ID").messages({
    "string.empty": "Batch ID is required.",
  }),
  SDMSid: Joi.optional(),

  dtStartDate: Joi.date().required().label("Start Date").messages({
    "date.base": "Start Date To must be a valid date.",
  }),
  dtEndDate: Joi.date().required().label("End Date").messages({
    "date.base": "End Date To must be a valid date.",
  }),
  // fklSectorId: Joi.number().required().label("Sector ID").messages({
  //   "string.empty": "Sector ID is required.",
  // }),

  // QPNOS: Joi.string().required().label("QPNOS").messages({
  //   "string.empty": "QPNOS is required.",
  // }),
  fklCourseId: Joi.number().required().label("Course ID").messages({
    "string.empty": "Course ID is required.",
  }),
  fklTargetId: Joi.number().optional().label("Target ID").messages({
    "string.empty": "Target ID is required.",
  }),
  iBatchTarget: Joi.number().optional().label("Batch Target").messages({
    "string.empty": "Batch Target is required.",
  }),
  vsTrainerName: Joi.string().required().label("Trainer Name").messages({
    "string.empty": "Trainer Name is required.",
  }),
  vsPAN: Joi.string().required().label("PAN").messages({
    "string.empty": "PAN is required.",
  }),
  // fklTpId: Joi.number().required().label("Training Partner ID").messages({
  //   "string.empty": "Training Partner ID is required.",
  // }),
  fklTcId: Joi.number().required().label("Training Center ID").messages({
    "string.empty": "Training Center ID is required.",
  }),
 
});

export const assessmentValidationSchema = Joi.object({
  batchId: Joi.number().required().label("Batch ID").messages({
    "string.empty": "Batch ID is required.",
  }),

  bAssessed: Joi.number(),

  candidateId: Joi.number().required().messages({
    "string.base": `"candidateId" should be a type of 'text'`,
    "any.required": `"candidateId" is a required field`,
  }),
  accessorId: Joi.number().required().messages({
    "string.base": `"assessedId" should be a type of 'text'`,
    "any.required": `"assessedId" is a required field`,
  }),
  dtAssessmentDate: Joi.date().required().messages({
    "string.base": `"dtAssessmentDate" should be a type of 'text'`,
    "any.required": `"dtAssessmentDate" is a required field`,
  }),
  // agency: Joi.string().required().messages({
  //   "string.base": `"agency" should be a type of 'text'`,
  //   "any.required": `"agency" is a required field`,
  // }),
  // agencyMobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
  //   "string.pattern.base": "Mobile number must be 10 digits.",
  //   "any.required": "Mobile number is required.",
  // }),
  //   agencyEmail: Joi.string()
  //   .email({ tlds: { allow: false } })
  //   .required()
  //   .label("Email")
  //   .messages({
  //     "string.empty": "Email is required.",
  //     "string.email": "Email must be a valid email address.",
  //     "any.required": "Email is required.",
  //   }),
  vsResult: Joi.string(),
  // dtResultDate: Joi.date().required().messages({
  //   "string.base": `"dtResultDate" should be a type of 'text'`,
  //   "any.required": `"dtResultDate" is a required field`,
  // }),
  vsTotalMarks: Joi.optional(),

  // fklTcId: Joi.number().required().label("Training Center ID").messages({
  //   "string.empty": "Training Center ID is required.",
  // }),
  SDMSBatchId: Joi.optional().label("SDMS ID"),
  dtResultDate: Joi.string()
    .when("vsResult", {
      is: "Yes",
      then: Joi.required().messages({ "string.empty": "Result Date is required." }),
      otherwise: Joi.optional(),
    }),
  // fklTpId: Joi.number().optional().label("SDMS ID").messages({
  //   "string.empty": "SDMS ID is required.",
  // }),
  vsObtainedMarks: Joi.string().optional().label("Obtain Marks").messages({
    "string.empty": "SDMS ID is required.",
  }),
  vsMarksheetUrl: Joi.string().optional().label("Obtain Marks").messages({
    "string.empty": "SDMS ID is required.",
  }),
  vsCertificateUrl: Joi.string().optional().label("Obtain Marks").messages({
    "string.empty": "SDMS ID is required.",
  }),
});

export const placementValidationSchema = Joi.object({
  batchId: Joi.number().required().messages({
    "string.base": `"Batch ID" should be a type of 'text'`,
    "any.required": `"Batch ID" is a required field`,
  }),
  dtAppointmentDate: Joi.string().optional(),

  candidateId: Joi.number().required().messages({
    "string.base": `"Candidate ID" should be a type of 'text'`,
    "any.required": `"Candidate ID" is a required field`,
  }),
  // bIsCandidatePlaced: Joi.number().required().messages({
  //   "string.base": `"Is Cnadidate Placed" should be a type of 'text'`,
  //   "any.required": `"Is Cnadidate Placed"" is a required field`,
  // }),
  vsPlacementType: Joi.string()
    .when("bIsCandidatePlaced", {
      is: 1, // If bIsCandidatePlaced is 1, then this field is required
      then: Joi.string().required().messages({
        "string.base": `"Placement Type" should be a type of 'text'`,
        "any.required": `"Placement Type" is required when candidate is placed`,
      }),
      otherwise: Joi.string().allow("").optional(), // Not required if bIsCandidatePlaced is 0
    }),
  vsEmployeerName: Joi.optional(),
  
  // vsEmployeerName: Joi.string().required().messages({
  //   "string.base": `"Employe Name" should be a type of 'text'`,
  //   "any.required": `"Employe Name" is a required field`,
  // }),
  vsEmployeerContactNumber: Joi.optional(),

   vsPlacementState: Joi.optional(),
   vsPlacementDistrict: Joi.optional(),
  vsMonthlySalary: Joi.optional(),
  // fklTcId: Joi.number().required().label("Training Center ID").messages({
  //   "string.empty": "Training Center ID is required.",
  // }),
  // fklTpId: Joi.number().optional().label("SDMS ID").messages({
  //   "string.empty": "SDMS ID is required.",
  // }),
});

export const invoiceValidationSchema = Joi.object({
  fklInvoiceType: Joi.number().required().messages({
    "string.base": `"Invoice Type" should be a type of 'text'`,
    "any.required": `"Invoice Type" is a required field`,
  }),
  vsInvoiceTranche: Joi.string().required().messages({
    "string.base": `"Invoice Tranche" should be a type of 'text'`,
    "any.required": `"Invoice Tranche" is a required field`,
  }),
  vsInvoiceNo: Joi.string().required().messages({
    "string.base": `"Monthly Salary" should be a type of 'text'`,
    "any.required": `"Monthly Salary" is a required field`,
  }),
  vsInvoiceDate: Joi.date().required().messages({
    "any.required": "Date of Invoice is required.",
    "date.base": "Invalid date format.",
  }),
  iTotalCandidate: Joi.number().integer().min(0).required().messages({
    "number.base": "No of Candidates must be a valid number.",
    "number.integer": "No of Candidates must be an integer.",
    "number.min": "No of Candidates cannot be negative.",
    "any.required": "No of Candidates is required.",
  }),

  fRate: Joi.optional(),
  fAmount: Joi.optional(),
 
  fklTcId: Joi.number().required().label("Training Center ID").messages({
    "string.empty": "Training Center ID is required.",
  }),
  fklBatchId: Joi.number().required().label("Batch ID").messages({
    "string.empty": "Batch ID is required.",
  }),
});

export const targetSchema = Joi.object({
  vsTargetNo: Joi.string().required().label("Sanction No").messages({
    "string.empty": "Sector Name is required.",
  }),
  vsSchemeCode: Joi.string().required().label("Scheme Code").messages({
    "string.empty": "Scheme Code is required.",
  }),
  dtTargetDate: Joi.string().required().label("Sanction Date").messages({
    "string.empty": "Sanction Date is required.",
  }),


  iTotalTarget: Joi.number().required().label("Total Target").messages({
    "number.base": "Total Target must be a number.",
    "any.required": "Total Target is required.",
  }),
  targetType: Joi.number().required().label("Total Target").messages({
    "number.base": "Total Target must be a number.",
    "any.required": "Total Target is required.",
  }),
 
});

export const candidateSchema = Joi.object({
  // candidateId: Joi.string().required().label("Candidate ID").messages({
  //   "any.required": "Candidate ID is required.",
  // }),
  batchId: Joi.number(),
  vsCandidateName: Joi.string().optional().label("Candidate Name").messages({
    "string.empty": "Candidate Name is required.",
  }),
  bAssessed : Joi.number().optional(),
  vsResult : Joi.string().optional(),
  vsPlacementType : Joi.optional(),
  vsDOB: Joi.date().optional().label("Date of Birth").messages({
    "date.base": "Date of Birth must be a valid date.",
    "any.required": "Date of Birth is required.",
  }),
  // iAge: Joi.number().integer().min(0).optional().label("Age").messages({
  //   "number.base": "Age must be a number.",
  //   "number.min": "Age must be a positive number.",
  //   "any.required": "Age is required.",
  // }),
  // vsFatherName: Joi.optional(),
  vsGender: Joi.number().required().label("Gender").messages({
    "any.only": "Gender must be Male, Female, or Other.",
    "any.required": "Gender is required.",
  }),
  fklIdType: Joi.optional().messages({
    "any.required": "ID Type is required.",
  }),
  fklReligionId: Joi.number().required().label("Religion ID").messages({
    "any.required": "Religion ID is required.",
  }),
  fklCategoryId: Joi.number().required().label("Category ID").messages({
    "any.required": "Category ID is required.",
  }),
  vsUUID: Joi.when("fklIdType", {
    is: 1, 
    then: Joi.string().required().label("UUID").messages({
      "any.required": "UUID is required.",
    }),
    otherwise: Joi.string().optional(), 
  }),
  // vsMobile: Joi.string()
  // .pattern(/^[0-9]{10}$/)
  // .optional()
  // .label("Mobile")
  // .messages({
  //   "string.empty": "Mobile number is required.",
  //   "string.pattern.base": "Mobile number must be 10 digits.",
  // }),
  // vsEmail: Joi.optional(),

  vsEducationAttained: Joi.required().messages({
    "any.required": "Qualification is required.",
  }),

  bDisability: Joi.optional(),
  bTeaTribe: Joi.optional(),
  bBPLcardHolder: Joi.optional(),
  bMinority: Joi.optional(),
  bDropout: Joi.optional(),
  placed: Joi.optional(),
  declared: Joi.optional(),

  
  isRCityVillage: Joi.optional(),
 
  // Present Address
  vsRAddress: Joi.optional(),
  
  vsRState: Joi.optional(),
  vsRDistrict: Joi.optional(),
  vsRBlock: Joi.optional(),
  vsRULB: Joi.optional(),

  vsRVillageCity: Joi.optional(),
  vsRPostOffice: Joi.optional(),
  vsRPIN: Joi.optional(),
  vsRCouncilContituency: Joi.optional(),
  vsRPolice: Joi.optional(),
  vsRAssemblyContituency: Joi.optional(),
  iSameAddress: Joi.optional(),

  // Present Address
  vsPAddress: Joi.optional(),
  vsPDistrict: Joi.optional(),
  vsPBlock: Joi.optional(),
  vsPUlb: Joi.optional(),
  vsPVillageCity: Joi.optional(),
  vsPState: Joi.optional(),
  vsPPostOffice: Joi.optional(),
  vsPPolice: Joi.optional(),
  vsPPIN: Joi.optional(),
  vsPCouncilContituency: Joi.optional(),
  vsPAssemblyContituency: Joi.optional(),
  
  // Bank Details
  vsBankHolderName: Joi.optional(),
  vsAccountNumber: Joi.optional(),
  vsBankName: Joi.optional(),
  vsBranchName: Joi.optional(),
  vsBankIFSC: Joi.optional(),
});

export const departmentCreationSchema = Joi.object({
  departmentName: Joi.string().required().label("Department Name").messages({
    "string.empty": "Department Name is required.",
  }),
  departmentName1: Joi.string(),
  loginName: Joi.string().required().label("Login Name").messages({
    "string.empty": "Login Name is required.",
  }),
  // password: Joi.string().required().label("Password").messages({
  //   "string.empty": "Password is required.",
  // }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .label("Phone Number")
    .messages({
      "string.empty": "Phone Number is required.",
      "string.pattern.base": "Phone Number must be a valid 10-digit number.",
    }),
});



export const summaryReportSchema = Joi.object({
  vsSchemeName: Joi.string().required().label("Scheme Name").messages({
    "string.empty": "Scheme Name is required.",
  }),
  itotalTrainingCandidate: Joi.number().required().label("Total Training Candidate").messages({
    "number.base": "Total Training Candidate must be a number.",
    "any.required": "Total Training Candidate is required.",
  }),
  itotalCertifiedCandidate: Joi.number().required().label("Total Certified Candidate").messages({
    "number.base": "Total Certified Candidate must be a number.",
    "any.required": "Total Certified Candidate is required.",
  }), itotalPlacedCandidate: Joi.number().required().label("Total Placed Candidate").messages({
    "number.base": "Total Placed Candidate must be a number.",
    "any.required": "Total Placed Candidate is required.",
  }),
  itotalTarget: Joi.number().required().label("Total Target").messages({
    "number.base": "Total Target must be a number.",
    "any.required": "Total Target is required.",
  }),
  iMaleCount: Joi.number().required().label("Male Count").messages({
    "number.base": "Male Count must be a number.",
    "any.required": "Male Count is required.",
  }),
  iFemaleCount: Joi.number().required().label("Female Count").messages({
    "number.base": "Female Count must be a number.",
    "any.required": "Female Count is required.",
  }),
  iScCount: Joi.number().required().label("SC Count").messages({
    "number.base": "SC Count must be a number.",
    "any.required": "SC Count is required.",
  }),
  iStHCount: Joi.number().required().label("ST H Count").messages({
    "number.base": "ST H Count must be a number.",
    "any.required": "ST H Count is required.",
  }),
  iStPCount: Joi.number().required().label("ST P Count").messages({
    "number.base": "ST P Count must be a number.",
    "any.required": "ST P Count is required.",
  }),
  iObcCount: Joi.number().required().label("OBC Count").messages({
    "number.base": "OBC Count must be a number.",
    "any.required": "OBC Count is required.",
  }), iGeneralCount: Joi.number().required().label("General Count").messages({
    "number.base": "General Count must be a number.",
    "any.required": "General Count is required.",
  }),
  iMinorityCount: Joi.number().required().label("Minority Count").messages({
    "number.base": "Minority Count must be a number.",
    "any.required": "Minority Count is required.",
  }),
  iTeaTribeCount: Joi.number().required().label("Tea Tribe Count").messages({
    "number.base": "Tea Tribe Count must be a number.",
    "any.required": "Tea Tribe Count is required.",
  }),
  iPwdCount: Joi.number().required().label("PWD Count").messages({
    "number.base": "PWD Count must be a number.",
    "any.required": "PWD Count is required.",
  }), iTotalJobRoleCount: Joi.number().required().label("Total Job Role Count").messages({
    "number.base": "Total Job Role Count must be a number.",
    "any.required": "Total Job Role Count is required.",
  }),
  fklDepartmentId: Joi.number().required().label("Department ID").messages({
    "number.base": "Department ID must be a number.",
    "any.required": "Department ID is required.",
  }),
  dtFinancialYear: Joi.string().required().label("Financial Year").messages({
    "string.empty": "Financial Year is required.",
  }),
});