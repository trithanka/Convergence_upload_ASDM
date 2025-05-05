
import React from "react";
import candidateTemplate from "../../assets/Candidate_Template-Instruction.xlsx?url"; // Use ?url to get the file path
import schemeTemplate from "../../assets/Scheme_Template-Instruction.xlsx?url";
import batchTemplate from "../../assets/Batch_Template-Instruction.xlsx?url"
import targetTemplate from "../../assets/Target_Template-Instruction.xlsx?url";
import tcTemplate from "../../assets/TC_Template-Instruction.xlsx?url";
import tpTemplate from "../../assets/TP_Template-Instruction.xlsx?url";
import assessmentTemplate from "../../assets/Assessment_Template-Instruction.xlsx?url";
import placementTemplate from "../../assets/Placement_Template-Instruction.xlsx?url";
import courseTemplate from "../../assets/Course_Template-Instruction.xlsx?url";
import assessorTemplate from "../../assets/Assessor_Template-Instruction.xlsx?url";
import trainerTemplate from "../../assets/Trainer_Template_Instruction.xlsx?url";
import invoiceTemplate from "../../assets/Invoice_Template_Instruction.xlsx?url";
import summaryTemplate from "../../assets/Summary_Report-Instruction.xlsx?url";


type TemplateDownloadButtonProps = {
  templateType: number;
  templateTitle: string;
  Icon: React.ElementType;
};

const TemplateDownloadButton: React.FC<TemplateDownloadButtonProps> = ({
  templateType,
  templateTitle,
  Icon,
}) => {
  // Correct file paths using `import.meta.url`
  const templateFiles: { [key: number]: string } = {
    0: schemeTemplate,
    1: targetTemplate,
    2: courseTemplate, //error

    3: tpTemplate,
    4: tcTemplate,
    5: assessorTemplate, //error
    6: trainerTemplate,
    7: batchTemplate, //error
    8: candidateTemplate, 
    9: assessmentTemplate,
    10: placementTemplate,
    11: invoiceTemplate,
    12: summaryTemplate,
    
  };

  const downloadTemplate = () => {
    const fileUrl = templateFiles[templateType];

    if (!fileUrl) {
      console.error("Invalid template type or file not available");
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileUrl.split("/").pop() || "template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={downloadTemplate}
      className="py-2 px-4 text-xs bg-theme-primary hover:bg-theme-primary-hover rounded-md flex items-center gap-2 text-white"
    >
      <Icon className="w-6 h-6" />
      {templateTitle}
    </button>
  );
};

export default TemplateDownloadButton;

