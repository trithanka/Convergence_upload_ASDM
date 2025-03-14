import React, { useEffect, useMemo, useState } from 'react'
import MasterTable from '../../components/MasterTable'
import { useQuery } from '@tanstack/react-query';
import { getTableData } from '../../services/state/api/tableDataApi';
import { sectorColumns } from '../../utils/tableColumns';
import { Loader } from 'lucide-react';
import ModalOpenButton from '../../components/ui/ModelOpenButton';
import { Add } from '@mui/icons-material';

const Sectors : React.FC = () => {
  const columns = useMemo(() => sectorColumns(), []);
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
    <div>sectors</div>
    <ModalOpenButton
              modalType={14}
              modalTitle="Add Sectors"
              bulkName="sector"
              Icon={Add}
            
            />
    <MasterTable columns={columns} data={filteredData} pageSize={5} />
    </>
  )
}

export default Sectors