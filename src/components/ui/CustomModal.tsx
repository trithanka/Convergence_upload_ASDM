// src/components/ui/CustomModal.tsx
import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import useModalStore from '../../services/state/useModelStore';
import Scheme from './Modals/SchemeModal';
import BulkUploadModal from './Modals/BulkUploadModal';
import Traget from './Modals/TargetModal'
import CourseModal from './Modals/CourseModal';
import TrainingPartnerModal from './Modals/TrainingPartnerModal';
import { X } from 'lucide-react';
import BatchModal from './Modals/BatchModal';
import CandidateModal from './Modals/CandidateModal';
import TrainerModal from "./Modals/TrainerModal";
import AssessorsModal from './Modals/AssessorsModal';
import AssessmentModal from './Modals/AssessmentModal';
import PlacementModal from './Modals/PlacementModal';
import InvoiceModal from './Modals/InvoiceModal';
import TrainingCenterModel from './Modals/TrainingCenterModel';
import LoginCreationModal from './Modals/LoginCreationModal';
import SectorModal from './Modals/SectorModal';


const CustomModal: React.FC = () => {
  const { isOpen, modalType, modalTitle, bulkName,  closeModal} = useModalStore();



  const renderModalContent = () => {
    switch (modalType) {
      case 0:
        return <Scheme />;
      case 1:
        return <Traget />;
      case 2:
        return <CourseModal />;
      case 3:
        return <TrainingPartnerModal />;
      case 4:
        return <BatchModal />;
      case 5:
        return <CandidateModal />;
      case 6:
        return <TrainerModal />;
      case 7:
        return <AssessorsModal />;
      case 8:
        return <AssessmentModal />;
      case 9:
        return <PlacementModal />;
      case 10:
        return <InvoiceModal />;
      case 11:
        return <BulkUploadModal bulkName={bulkName} />; 
      case 12:
        return <TrainingCenterModel />;
      case 13:
        return <LoginCreationModal />;
        case 14:
          return <SectorModal />;


      default:
        return <p>No content available</p>;
    }
  };

  console.log("modal title is", modalTitle);

  return (
    <Modal open={isOpen} onClose={closeModal} className='relative flex items-center justify-center'>
      <Box className="fixed bg-white w-fit border shadow-md rounded-xl mx-24"
      >
        <div className='p-4 flex gap-4 justify-between'>

          <Typography variant="h5" component="h2" mb={2}>
            {modalTitle}
          </Typography>
          <button className=" text-theme-primary hover:text-theme-primary-hover" onClick={closeModal}>
            <X />
          </button>
        </div>
        {renderModalContent()}
     
      </Box>
    </Modal>
  );
};

export default CustomModal;
