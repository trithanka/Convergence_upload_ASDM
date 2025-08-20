import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../../utils/cookies";
import axiosInstance from "../api-setup/axiosInstance";

interface GetCandidateByIdPayload {
    candidateId: string;
}

export const getCandidateById = async (payload: GetCandidateByIdPayload) => {
    const token = useAuthStore.getState().token;
    const response = await axiosInstance.post(
        `/get-department/getCandidateById`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.data;
};

export const useGetCandidateById = (candidateId: string, enabled = true) => {
    return useQuery({
        queryKey: ["getCandidateById", candidateId],
        queryFn: () => getCandidateById({ candidateId }),
        enabled: !!candidateId && enabled,
    });
};
