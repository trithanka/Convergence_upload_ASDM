import {
  AssessmentFormData,
  AssessorFormData,
  BatchFormData,
  candidateFormData,
  InvoiceFormData,
  PlacementFormData,
  SchemeFormData,
  targetFormData,
  TrainerFormData,
  TrainingCenterFormData,
  TrainingPartnerFormData,
} from "../../../utils/formTypes";
import { CourseFormData } from "../../../utils/formTypes";
import useAuthStore from "../../../utils/cookies";
import axiosInstance from "../api-setup/axiosInstance";

export const submitSchemeForm = async (data: SchemeFormData) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "scheme",
  };
  const response = await axiosInstance.post(
    "/manual-file-upload/",
    requestData
  );
  return response.data;
};

export const submitTrainingPartnerForm = async (
  data: TrainingPartnerFormData
) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "TP",
  };
  const response = await axiosInstance.post(
    "/manual-file-upload/",
    requestData
  );
  return response.data;
};

export const submitTargetForm = async (data: targetFormData) => {
  

  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const requestData = {
    ...data,
  
    fklDepartmentId: userDetails?.departmentId,
    queryType: "target",
  };

  const response = await axiosInstance.post(
    "/manual-file-upload/",
    requestData
  );
  return response.data;
};

export const submitCourseForm = async (data: CourseFormData) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "course",
  };
  const response = await axiosInstance.post("/manual-file-upload", requestData);
  return response.data;
};

export const submitCandidateForm = async (data: candidateFormData) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "candidate",
  };
  const response = await axiosInstance.post("/manual-file-upload", requestData);
  return response.data;
};

export const submitAssesmentForm = async (data: AssessmentFormData) => {
  const { userDetails } = useAuthStore.getState();


  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "assesment",
  };
  const response = await axiosInstance.post("/manual-file-upload", requestData);
  return response.data;
};

export const submitPlacementForm = async (data: PlacementFormData) => {
  const { userDetails } = useAuthStore.getState();

  

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "placement",
  };
  const response = await axiosInstance.post("/manual-file-upload", requestData);
  return response.data;
};

export const submitInvoiceForm = async (data: InvoiceFormData) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "invoice",
  };
  const response = await axiosInstance.post("/manual-file-upload", requestData);
  return response.data;
};

// export const submitDCreationForm = async (data: departmentCreationFormData) => {
//   const { userDetails } = useAuthStore.getState();

//   if (!userDetails) {
//     throw new Error("User details are not available in the store.");
//   }
//   const requestData = {
//     ...data,
//     fklDepartmentId: userDetails?.departmentId,
//     bEnable: 1,
//   };
//   const response = await axiosInstance.post("/manual-file-upload", requestData);
//   return response.data;
// };

export const submitTraningCenterForm = async (data: TrainingCenterFormData) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const { ...filteredData } = data;

  const requestData = {
    ...filteredData,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "TC",
  };

  const response = await axiosInstance.post(
    "/manual-file-upload/",
    requestData
  );
  return response.data;
};

export const submitAssessorForm = async (data: AssessorFormData) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "assessor",
  };
  const response = await axiosInstance.post("/manual-file-upload", requestData);
  return response.data;
};

export const submitTrainerForm = async (data: TrainerFormData) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "trainer",
  };
  const response = await axiosInstance.post("/manual-file-upload", requestData);
  return response.data;
};

export const submitBatchForm = async (data: BatchFormData) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const requestData = {
    ...data,
    fklDepartmentId: userDetails?.departmentId,
    queryType: "batch",
  };
  const response = await axiosInstance.post(
    "/manual-file-upload/",
    requestData
  );
  return response.data;
};
