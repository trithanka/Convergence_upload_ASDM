import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileSpreadsheetIcon, XIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface DropInputProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  maxSize?: number; // Maximum file size in bytes
  accept?: { [key: string]: string[] }; // Accepted file types
  handleClearFile: () => void; // Clear file handler
}

const DropInput: React.FC<DropInputProps> = ({
  file,
  setFile,
  maxSize = 10 * 1024 * 1024,
  accept = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // .xlsx
    "application/vnd.ms-excel": [], // .xls
    "text/csv": [], // .csv
  },
  handleClearFile,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Reset previous error message
      setErrorMessage(null);

      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0]?.errors?.[0];
        if (error?.code === "file-too-large") {
          setErrorMessage("File is too large. Maximum size is 10 MB.");
        } else if (error?.code === "file-invalid-type") {
          setErrorMessage("Invalid file type. Only .xls, .xlsx, and .csv files are allowed.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-dashed p-4 border border-gray-900 rounded-md text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center max-w-md mx-auto",
          isDragAccept && "border-green-800 scale-105",
          isDragReject && "border-red-800"
        )}
      >
        <input {...getInputProps()} />
        {!file ? (
          <p className="text-gray-700">
            Drag & drop your file here, or{" "}
            <span className="underline">click to select</span>
            <br />
            (Max 2MB, .xls, .xlsx, .csv)
          </p>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FileSpreadsheetIcon size={20} />
              <span>{file.name}</span>
            </div>
            <button onClick={handleClearFile} className="text-red-500">
              <XIcon />
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
    </div>
  );
};

export default DropInput;
