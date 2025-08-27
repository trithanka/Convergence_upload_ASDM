import { useMutation } from "@tanstack/react-query";
import { candidateFormData } from "../../../utils/formTypes";

import Cookies from "js-cookie";

export type CandidateFormData = candidateFormData & {
  id?: string;
};

export type CandidateResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

export const useUpdateCandidateAPI = () => {
  const token = Cookies.get("token");
  return useMutation<CandidateResponse, Error, CandidateFormData>({
    mutationFn: async (data: CandidateFormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/manual-file-upload/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update candidate");
      }
      
      return response.json();

    },
  });
};
