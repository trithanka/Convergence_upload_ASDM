import React, { useEffect, useMemo, useState } from 'react'
import MasterTable from '../../components/MasterTable'
import { useQuery } from '@tanstack/react-query';
import { getTableData } from '../../services/state/api/tableDataApi';
import { departmentColumns } from '../../utils/tableColumns';
import { Loader } from 'lucide-react';

const Departments : React.FC = () => {
  const columns = useMemo(() => departmentColumns(), []);
  const [filteredData, setFilteredData] = useState([]);




  const {
    data: fetchedData,
    isLoading,
    isSuccess,
   
  } = useQuery({
    queryKey: ["assessmentData"],
    queryFn: () => getTableData("assesment"),
   
  });

  useEffect(() => {
    if (isSuccess) {
      if (fetchedData?.data?.data && fetchedData.data.data.length > 0) {
        setFilteredData(fetchedData.data.data);
     
      } else {
        setFilteredData([]);
      }
    }
  }, [fetchedData, isSuccess]);


  if (isLoading) {
    return <Loader />;
  }


  return (
    <>
    <div>Departments</div>
    <MasterTable columns={columns} data={filteredData} pageSize={5} />
    </>
  )
}

export default Departments