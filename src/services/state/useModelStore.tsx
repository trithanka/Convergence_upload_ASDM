import { create } from 'zustand';

type ModalState = {
  isOpen: boolean;
  modalType: number | null;
  modalTitle: string;
  bulkName: string;


  openModal: (type: number, title: string, bulkName: string  ) => void;
  closeModal: () => void;
};

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  modalTitle: '',
  bulkName: '',
 

  openModal: (type: number, title: string , bulkName: string , ) => set({ isOpen: true, modalType: type, modalTitle: title , bulkName:bulkName }),
  closeModal: () => set({ isOpen: false, modalType: null, modalTitle: '', bulkName: ''  }), 
}));

export default useModalStore;
