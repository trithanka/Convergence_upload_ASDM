
export interface SummaryReportData {
    vsSchemeName: string;
    itotalTrainingCandidate: number;
    itotalCertifiedCandidate: number;
    itotalPlacedCandidate: number;
    itotalTarget: number;
    iMaleCount: number;
    iFemaleCount: number;
    iScCount: number;
    iStHCount: number;
    iStPCount: number;
    iObcCount: number;
    iGeneralCount: number;
    iMinorityCount: number;
    iTeaTribeCount: number;
    iPwdCount: number;
    iTotalJobRoleCount: number;
    fklDepartmentId: number;
    dtFinancialYear: string;
    department_names?: string;
    data ?: any;
    take?: number;
    skip?: number;
    search?: string;
    totalCount ?: number;
  }
