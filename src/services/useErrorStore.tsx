import { create } from "zustand";

interface ErrorState {
  errorMessage: string;
  successMessage: string;
  bulkName: string;
  totalRows: number;
  insertedRows: number;
  statusColor: "g" | "y" | "r";
  setErrorMessage: (messages: { errorMessage: string; successMessage: string }) => void;
  setBulkName: (bulkName: string) => void;
  setTotalRows: (totalRows: number) => void;
  setInsertedRows: (insertedRows: number) => void;
  setStatusColor: (color: "g" | "y" | "r") => void;
  clearErrorMessage: () => void;
  clearSuccessMessage: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  errorMessage: "",
  successMessage: "",
  bulkName: "",
  totalRows: 0,
  insertedRows: 0,
  statusColor: "g", // Default to green

  setErrorMessage: ({ errorMessage, successMessage }) => set({ errorMessage, successMessage }),
  setBulkName: (bulkName) => set({ bulkName }),
  setTotalRows: (totalRows) => set({ totalRows }),
  setInsertedRows: (insertedRows) => set({ insertedRows }),
  setStatusColor: (color) => set({ statusColor: color }),

  clearErrorMessage: () => set({ errorMessage: "" }),
  clearSuccessMessage: () => set({ successMessage: "" }),
}));
