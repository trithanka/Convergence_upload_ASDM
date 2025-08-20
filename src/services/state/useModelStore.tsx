import { create } from 'zustand';


type ModalState = {
  isOpen: boolean;
  modalType: number | null;
  modalTitle: string;
  bulkName: string;
  candidateId?: string | null;
  openModal: (type: number, title: string, bulkName: string, candidateId?: string) => void;
  closeModal: () => void;
};

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  modalTitle: '',
  bulkName: '',
  candidateId: null,
  openModal: (type: number, title: string, bulkName: string, candidateId?: string) => set({
    isOpen: true,
    modalType: type,
    modalTitle: title,
    bulkName: bulkName,
    candidateId: candidateId || null,
  }),
  closeModal: () => set({ isOpen: false, modalType: null, modalTitle: '', bulkName: '', candidateId: null }),
}));

export default useModalStore;
