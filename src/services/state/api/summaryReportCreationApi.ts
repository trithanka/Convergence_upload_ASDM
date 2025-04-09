
import { SummaryReportData } from "../../../types/summaryReport";
import useAuthStore from "../../../utils/cookies";
import axiosInstance from "../api-setup/axiosInstance";
interface ApiResponse {
  status: string;
  statusCode: number;
  data: SummaryReportData[];
  total: number;
  pages: number;
  message: string;
}

export const submitSForm = async (data: SummaryReportData) => {
    const { userDetails } = useAuthStore.getState();
  
    if (!userDetails) {
      throw new Error("User details are not available in the store.");
    }
    const requestData = {
      ...data,
      fklDepartmentId: userDetails?.departmentId,
    
     
    };
    const response = await axiosInstance.post("/convergence/candidateForm", requestData);
    return response.data;
   

  };
  


  const fetchSummaryReport = async (  data: SummaryReportData): Promise<ApiResponse> => {
    const { userDetails } = useAuthStore.getState();
    if (!userDetails) {
      throw new Error("User details are not available in the store.");
    }
    const requestData = {
      ...data,
      fklDepartmentId: userDetails?.departmentId,
      
    };
    const response = await axiosInstance.post(
      "/convergence/get-summary-reports",
      requestData  
      
    );
    return response.data.data;
  };


export const getSummaryReport = async (data: SummaryReportData) => {
  const response = await fetchSummaryReport(data);
  console.log(response.data);
  return response.data;
};
