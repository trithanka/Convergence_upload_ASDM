export interface SchemeFormData {
  schemeType: number;
  // selectedFundingType: string;
  scheme: string;
  schemeCode: string;
  fundName: string;
  schemeFundingType: string | number;
  schemeFundingRatio: string | number;
  sanctionOrderNo: string;
  dateOfSanction: string;
  otherSchemeName: string;
  isSchemeFundingRatioDisabled?: boolean;
  // selectedScheme: string
}

export interface CreateDepartmentLoginData {
  departmentName: string;
  loginName: string;
  password: string;
  phoneNumber: number;
}

export interface CourseFormData {
  dtFromDate: string;
  dtToDate: string;
  fklSectorId: string;
  vsCourseCode: string;
  vsCourseName: string;
  iTheoryDurationInHours: number;
  iPracticalDurationInHours: number;
}

export interface TrainingPartnerFormData {
  vsTpName: string;
  vsSpocEmail: string;
  iSpocContactNum: string;
  vsSpocName: string;
  vsState: number;
  vsDistrict: number;
  vsBlock: number;
  vsVillage: string;
  vsAddress: string;
  vsSmartId: string;
  isVillageCity: string;
  vsCity: string;
  vsULB: number;
  vsPAN: string;
}

export interface TrainingCenterFormData {
  // vsTpName: string;
  partnerCode: string;
  vsTcName: string;
  fklTpId: string
  // vsTcCode: string;
  vsLongitude: string;
  vsLatitude: string;
  vsSpocEmail: string;
  vsSpocName: string;
  iSpocContactNum: string;
  smartId: string;
  vsState: number;
  vsULB: number;
  vsCity: number;
  vsDistrict: number;
  vsBlock: number;
  vsVillage: string;
  vsAddress: string;
  isVillageCity: string;
  fklAssemblyConstituencyId: number;
  fklLoksabhaConstituencyId: number;
}

export interface AssessorFormData {
  // assosserId: number;
  vsAssessorName: string;
  vsEmail: string;
  vsMobile: string;
  vsAssessmentAgency: string;
  dtValidUpTo: string;
  vsPAN: string;
  fklCourseId: string | number;
}

export interface TrainerFormData {
  // trainerId: string;
  fklTcId: number;
  vsTcName: string;
  vsTrainerName: string;
  vsMobile: string;
  vsEmail: string;
  fklCourseId: number;
  vsPAN: string;
}

export interface BatchFormData {
  iBatchNumber: number;
  SDMSid: string;
  dtStartDate: string;
  dtEndDate: string;
  // fklSectorId: number;
  // QPNOS: string;
  fklTargetId : number;
  iBatchTarget: number;
  fklCourseId: number;
  fklTpId: number;
  fklTcId: number;
  fklTrainerId: number;
}

export type AssessmentFormData = {
  batchId: number;
  bAssessed :  number;
   candidateId: number;

  dtAssessmentDate: string;
  // agency: string;
  // agencyMobile: string;
  // agencyEmail: string;
  accessorId: number;
  vsAccessorName: string;
  vsResult: string;
  dtResultDate: string;
  vsCertificationStatus: string;
   vsTotalMarks: string;
  // obtainedMarks: number;
  // marksheetUrl: string;
  // certificateUrl: string;
  // fklTpId: number;
  // fklTcId: number;
  SDMSBatchId: string;
   vsObtainedMarks: string;
   vsMarksheetUrl: string;
   vsCertificateUrl: string;
};

export interface PlacementFormData {
  batchId: number;
  // fklTpId: number;
  // fklTcId: number;
  candidateId: number;
  // bIsCandidatePlaced: number;
  vsPlacementType: string;
  vsEmployeerName: string;
  vsEmployeerContactNumber: number;
  vsPlacementState: number;
  vsPlacementDistrict: number;
  vsMonthlySalary: number;
  dtAppointmentDate:string;
}

export interface InvoiceFormData {
  fklInvoiceType: number;
  vsInvoiceTranche: string;
  vsInvoiceNo: string;
  vsInvoiceDate: string;
  iTotalCandidate: number;
  fRate: string;
  fAmount: string;
  fklTcId: number;
  fklBatchId: number;
}

export interface targetFormData {
  vsTargetNo: string;
  vsSchemeCode: string;
  dtTargetDate: string;
  iTotalTarget: number;
  targetType: number

}

export interface candidateFormData {
  candidateId: string;
  vsCandidateName: string;
  vsDOB: string;
  iAge: string;
  vsFatherName: string;
  vsGender: number;
  fklIdType: number;
  vsUUID: string;
  fklReligionId: number;
  fklCategoryId: number;
  vsMobile: string;
  vsEmail: string;
  vsEducationAttained: string | number;
  bDisability: number;
  bTeaTribe: number;
  bBPLcardHolder: number;
  bMinority: number;
  batchId: number;

  //current address
  vsRAddress: string;
  vsRState: number;
  vsRDistrict: number;
  vsRBlock: number;
  vsRUlb: number;
  isRCityVillage: string;
  vsRPostOffice: string;
  vsRPolice: string;
  vsRPIN: string;
  vsRCouncilContituency: number;
  vsRAssemblyContituency: number;
  vsRVillageCity: string;

  //present address
  vsPAddress: string;
  vsPDistrict: number;
  vsPBlock: number;
  vsPUlb: number;
  vsPVillageCity: string;
  vsPPostOffice: string;
  vsPPolice: string;
  vsPPIN: number;
  vsPCouncilContituency: number;
  vsPAssemblyContituency: number;
  iSameAddress: number;
  vsPState: number;

  //bank details
  vsBankHolderName: string;

  vsAccountNumber: string;
  vsBankName: number;
  vsBranchName: number;
  vsBankIFSC: string;
}
