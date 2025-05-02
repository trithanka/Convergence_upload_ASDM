import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Input from "../Input";
import Label from "../Label";
import { SummaryReportData } from "../../../types/summaryReport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitSForm } from "../../../services/state/api/summaryReportCreationApi";
import { summaryReportSchema } from "../../../utils/validation";
import Dropdown from "../Dropdown";
import { toast } from "react-toastify";
import useModalStore from "../../../services/state/useModelStore";
const NewCandidateModal: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SummaryReportData>({
    resolver: joiResolver(summaryReportSchema),
  });


  const male = watch("iMaleCount");
  const female = watch("iFemaleCount");
  //@ts-ignore
  const other = watch("iOtherCount");
  useEffect(() => {
    const m = Number(male) || 0;
    const f = Number(female) || 0;
    const o = Number(other) || 0;
    setValue("totalCount", m + f + o);
  }, [male, female, other, setValue]);
  

  const { closeModal } = useModalStore();
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: submitSForm,
    onSuccess: (data) => {
      if (data?.success) {
        closeModal();
        toast.success(data.message || "Candidate submitted successfully!");
        queryClient.invalidateQueries({ queryKey: ["candidateData"] });
      } else {
        toast.error(
          data.message || "An error occurred while submitting the Trainer."
        );
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "An unknown error occurred.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: SummaryReportData) => {
    mutation.mutate(data);
  };
  return (<>
    <div className="grid space-y-6 divide-y divide-gray-300">
      <div className="p-4">
        <div className="grid grid-cols-6 gap-4 pb-6">
          <div className="col-span-3">
            <Label text="Scheme Name" />
            <Controller
              name="vsSchemeName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                />
              )}
            />
          </div>
          <div className="">
            <Label text="Financial Year" />
            <Controller
              name="dtFinancialYear"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={[
                    { label: "2020-2021", value: "2020-2021 "},
                    { label: "2021-2022", value: "2021-2022 "},
                    { label: "2022-2023", value: "2022-2023" },
                    {label :"2023-2024",  value: "2023-2024" },
                    { label: "2024-2025", value: "2024-2025" },
               

                  ]}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  onSelect={(selectedOption) => {
                    field.onChange(selectedOption.value);
                    setValue("dtFinancialYear", selectedOption.value.toString());
                  }}
                  placeholder="-- Select Year --"
                />
              )}
            />
          </div>

          <div className="col-span-1">
            <Label text="Total Target" />
            <Controller
              name="itotalTarget"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"

                  className={errors.itotalTarget ? "border-red-500" : ""}

                />
              )}
            />
          </div>


          <div className="">
            <Label text="Job Role Count" />
            <Controller
              name="iTotalJobRoleCount"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"

                  className={errors.iTotalJobRoleCount ? "border-red-500" : ""}
                />
              )}
            />
          </div>


          {/* <div className="">
      <Label text="Total Training Candidate"  />
      <Controller
        name="itotalTrainingCandidate"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            className={errors.itotalTrainingCandidate ? "border-red-500" : ""}
          />
        )}
      />
    </div> */}




          {/* <div className="">
      <Label text="Total Certified"/>
      <Controller
      
        name="finalTotalTarget"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            //@ts-ignore
            className={errors.finalTotalTarget ? "border-red-500" : ""}
          />
        )}
      />
    </div> */}
        </div>
        <div className="grid grid-cols-4 gap-4 pb-6">
          {[
            { name: "iMaleCount", label: "Male Candidate Count" },
            { name: "iFemaleCount", label: "Female Candidate Count" },
            { name: "iOtherCount", label: "Other Candidate Count" },
            { name: "totalCount", label: "Total Candidate Count", disabled: true },
            { name: "iScCount", label: "SC Candidate Count" },
            { name: "iStHCount", label: "ST Candidate Count" },
            // { name: "iStPCount", label: "ST(P) Candidate" },
            { name: "iObcCount", label: "OBC Candidate Count" },
            { name: "iGeneralCount", label: "General Candidate Count" },
            { name: "iMinorityCount", label: "Minority Candidate Count" },
            { name: "iTeaTribeCount", label: "Tea Tribe Candidate Count" },
            { name: "iPwdCount", label: "PwD Candidate Count" },

          ].map((field) => (
            <div className="" key={field.name}>
              <Label text={field.label} />
              <Controller

                name={field.name as keyof SummaryReportData}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChange={onChange}
                    type="number"
                    disabled={field.disabled}
                    

                    className={errors[field.name as keyof SummaryReportData] ? "border-red-500" : ""}
                  />
                )}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-4">
          <div className="">
            <Label text="Total Certified Candidate" />
            <Controller
              name="itotalCertifiedCandidate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"

                  className={errors.itotalCertifiedCandidate ? "border-red-500" : ""}

                />
              )}
            />
          </div>


          <div className="">
            <Label text="Total Placed Candidate" />
            <Controller
              name="itotalPlacedCandidate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"

                  className={errors.itotalPlacedCandidate ? "border-red-500" : ""}

                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end p-4">
        <button
          type="submit"
          onClick={() => {
            const formData = watch(); // Get form data from react-hook-form
            onSubmit(formData);
          }}
          className="py-2 px-4 text-xs bg-theme-primary hover:bg-theme-primary-hover text-white rounded-md flex items-center gap-2  undefined"
        >
          Submit
        </button>
      </div>
    </div>



  </>
  );
};

export default NewCandidateModal;
