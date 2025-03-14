
import useAuthStore from '../../../utils/cookies';
import axiosInstance from '../api-setup/axiosInstance';




export const getMasterData = async (queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
  const response = await axiosInstance.post(
    "/master/get",
    {
      fklDepartmentId: userDetails.departmentId,
      queryType, 
    },
   
  );

  return response.data;
};

export default { getMasterData };



export const getDistrictByState = async (stateId: number|null, queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    stateId, 
    queryType
  });

  return response.data;
};


export const gettrainerByTc = async (TcID: number|null, queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    TcID, 
    queryType
  });

  return response.data;
};

export const getTargetById = async (fklTargetId: number|null, queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    fklTargetId, 
    queryType
  });

  return response.data;
};


export const getCourseByTc = async (fklTcId: number|null, queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    fklTcId, 
    queryType
  });

  return response.data;
};




export const getTcByTp = async (fklTpId: number|null, queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    fklTpId, 
    queryType
  });

  return response.data;
};

export const getCandidateByBatch = async (batchId: number|null, queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    batchId, 
    queryType
  });

  return response.data;
};

export const getsdmsByBatch = async (pklBatchId: number|null, queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    pklBatchId, 
    queryType
  });

  return response.data;
};


export const getCourses = async (fklTpId: number|null, queryType: string , fklSectorId: number| null) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    fklTpId, 
    fklSectorId,
    queryType
  });

  return response.data;
};

export const getBatch = async ( queryType: string , fklTcId: number| null) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    fklTcId,
    queryType
  });

  return response.data;
};



export const getULBblockByDistrict = async (districtId: number|null, queryType: string) => {
  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }

  const response = await axiosInstance.post("/master/get", {
    fklDepartmentId: userDetails.departmentId,
    districtId, 
    queryType
  });

  return response.data;
};

export const getSchemeById = async (schemeId: string) => {

  const { userDetails } = useAuthStore.getState();

  if (!userDetails) {
    throw new Error("User details are not available in the store.");
  }
    const response = await axiosInstance.post("/get-department/getSchemeById",   {
      fklDepartmentId: userDetails.departmentId,
      schemeId, 
    },
  )
    return response.data;
  };

  export const getPartnerById = async (tpId: string) => {

    const { userDetails } = useAuthStore.getState();
  
    if (!userDetails) {
      throw new Error("User details are not available in the store.");
    }
      const response = await axiosInstance.post("/get-department/getTp/id",   {
        fklDepartmentId: userDetails.departmentId,
        tpId, 
      },
    )
      return response.data;
    };

    export const getBranchByBank = async (fklBankId: number|null, queryType: string) => {
      const { userDetails } = useAuthStore.getState();
    
      if (!userDetails) {
        throw new Error("User details are not available in the store.");
      }
    
      const response = await axiosInstance.post("/master/get", {
        fklDepartmentId: userDetails.departmentId,
        fklBankId, 
        queryType
      });
    
      return response.data;
    };

    export const getIfscByBranch = async (pklBranchId: number|null, queryType: string) => {
      const { userDetails } = useAuthStore.getState();
    
      if (!userDetails) {
        throw new Error("User details are not available in the store.");
      }
    
      const response = await axiosInstance.post("/master/get", {
        fklDepartmentId: userDetails.departmentId,
        pklBranchId, 
        queryType
      });
    
      return response.data;
    };
  