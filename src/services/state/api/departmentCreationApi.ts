/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../api-setup/axiosInstance";
import { ENDPOINTS } from "../../../api-endpoints/endpoints";

export const getCreatedDepartments = async (data: any): Promise<any> => {
  const response = await axiosInstance.post(
    ENDPOINTS.getCreatedDepartments,
    data
  );
  return response.data.data;
};

export const createDepartmentLogin = async (data: any): Promise<any> => {
  const response = await axiosInstance.post(
    ENDPOINTS.createDepartmentLogin,
    data
  );
  return response.data;
};

export const updateDepartmentStatus = async (data: any): Promise<any> => {
  const response = await axiosInstance.post(
    ENDPOINTS.updateDepartmentStatus,
    data
  );
  return response.data;
};
