
import { DownloadCloud } from "lucide-react";
import { useState } from "react";
import Dropdown from "./ui/Dropdown";

type Option = {
  label: string;
  value: number;
};

interface DownloadDropdownButtonProps {
  options: Option[];
  placeholder?: string;
  onDownload: (value: number) => void;
  buttonLabel?: string;
}

const DownloadDropdownButton = ({
  options,
  placeholder = "Select Download Value",
  onDownload,
  buttonLabel = "Download Report",
}: DownloadDropdownButtonProps) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  return (
    <div className="flex gap-4">
      <div>
        <Dropdown
          options={options}
          onSelect={(option: Option) => setSelectedValue(option.value)}
          placeholder={placeholder}
        />
      </div>
      <button
        className="p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        onClick={() => selectedValue !== null && onDownload(selectedValue)}
        disabled={selectedValue === null}
      >
        <DownloadCloud size={18} />
        {buttonLabel}
      </button>
    </div>
  );
};

export default DownloadDropdownButton;
