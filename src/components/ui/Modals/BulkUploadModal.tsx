import React, { useState } from "react";
import DropInput from "../DropInput";
import Button from "../Button";
import { toast } from "react-toastify";

import * as XLSX from "xlsx";
import useAuthStore from "../../../utils/cookies";
import axiosInstance from "../../../services/state/api-setup/axiosInstance";
import { useErrorStore } from "../../../services/useErrorStore";
import useModalStore from "../../../services/state/useModelStore";
import { useQueryClient } from "@tanstack/react-query";

interface BulkUploadModalProps {
  bulkName: string;
  onUploadError?: (errorMessage: string) => void;
}



const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  bulkName,

}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useErrorStore.getState();
  const { closeModal } = useModalStore();

  const handleClearFile = () => {
    setFile(null);
    console.log("File cleared");
  };

  const queryClient = useQueryClient()

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file before uploading.");
      return;
    }

    const { userDetails } = useAuthStore.getState();
    if (!userDetails || !userDetails?.departmentId) {
      toast.error("User details or department ID is missing.");
      console.error("User details are invalid or missing departmentId.");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data instanceof ArrayBuffer) {
          if (
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type === "application/vnd.ms-excel"
          ) {
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            console.log("Parsed Excel data:", jsonData);

            // Set total rows in Zustand
            useErrorStore.getState().setTotalRows(jsonData.length);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", bulkName);
            formData.append("fklDepartmentId", userDetails?.departmentId);

            const { data: resData } = await axiosInstance.post(
              `/file-upload/upload`,
              formData,
              {}
            );

            if (resData.success) {
              handleClearFile();

              queryClient.invalidateQueries({ queryKey: ["candidateData"] });
              queryClient.invalidateQueries({ queryKey: ["schemeData"] });
              queryClient.invalidateQueries({ queryKey: ["assessmentData"] });
              queryClient.invalidateQueries({ queryKey: ["batchData"] });
              queryClient.invalidateQueries({ queryKey: ["assessorData"] });
              queryClient.invalidateQueries({ queryKey: ["courseData"] });
              queryClient.invalidateQueries({ queryKey: ["invoicewData"] });
              queryClient.invalidateQueries({ queryKey: ["getCreatedDepartments"] });
              queryClient.invalidateQueries({ queryKey: ["placementData"] });
              queryClient.invalidateQueries({ queryKey: ["targetData"] });
              queryClient.invalidateQueries({ queryKey: ["trainerData"] });
              queryClient.invalidateQueries({ queryKey: ["tcData"] });
              queryClient.invalidateQueries({ queryKey: ["tpData"] });
            }

            useErrorStore.getState().setBulkName(bulkName);

            // Extract errors and inserted data
            const errorRows = resData.data?.filter((item: any) => item.error?.length > 0).length || 0;
            const totalInserted = resData.data.reduce(
              (sum: number, item: any) => sum + (item.insertedRow || 0),
              0
            );

            useErrorStore.getState().setInsertedRows(totalInserted);

            let statusColor: "g" | "y" | "r" = "g";
            if (totalInserted === 0) {
              statusColor = "r"; // All failed
            } else if (errorRows > 0) {
              statusColor = "y"; // Partial success
            }

            useErrorStore.getState().setStatusColor(statusColor);

            // Create error message
            const errorDetails = resData.data
              .filter((item: any) => item.error)
              .flatMap((item: any) =>

                item.error.map((err: any) => ({
                  row: err.rowNumber,
                  message: `Row ${err.rowNumber}: ${err.error}`,
                }))
              )
              .sort((a: { row: number; }, b: { row: number; }) => a.row - b.row)
              .map((item: { message: any; }) => item.message)
              .join("\n");

            const errorMessage = errorRows > 0 ? `<strong>Errors occurred:</strong>\n${errorDetails}` : "";
            const successMessage =
              totalInserted > 0
                ? `<strong>Total inserted:</strong> ${totalInserted} out of ${jsonData.length}`
                : "";

            useErrorStore.getState().setErrorMessage({ errorMessage, successMessage });


            closeModal();
          }
        } else {
          console.error("File could not be read as ArrayBuffer.");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-lg space-y-4 sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <DropInput
        file={file}
        setFile={setFile}
        handleClearFile={handleClearFile}
      />

      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="outline"
          onClick={handleClearFile}
          disabled={uploading || !file}
          className="w-full sm:w-auto"
        >
          Clear
        </Button>
        <Button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full sm:w-auto"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default BulkUploadModal;
