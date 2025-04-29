import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Button from "../../ui/SubmitButton";
import Input from "../../ui/Input";
import Label from "../../ui/Label";
import { joiResolver } from "@hookform/resolvers/joi";
import { targetSchema } from "../../../utils/validation";
import { targetFormData } from "../../../utils/formTypes";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMasterData } from "../../../services/state/api/masterApi";
import { toast } from "react-toastify";
import { submitTargetForm } from "../../../services/state/api/FormApi";
import useModalStore from "../../../services/state/useModelStore";
import Dropdown from "../Dropdown";
import { format, isAfter } from "date-fns";

const TargetModal: React.FC = () => {
  const { closeModal } = useModalStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    // clearErrors,
  } = useForm<targetFormData>({
    resolver: joiResolver(targetSchema),
  });

  const queryClient = useQueryClient();

  // Fetch scheme data
  const { data: schemeData } = useQuery({
    queryKey: ["masterData", "scheme"],
    queryFn: () => getMasterData("scheme"),
  });
  const { data: targetType } = useQuery({
    queryKey: ["masterData", "targetType"],
    queryFn: () => getMasterData("targetType"),
  });



 
  
  const financialYears = Array.from({ length: 21 }, (_, i) => {
    const start = 2010 + i;
    return `${start}-${start + 1}`;
  });
  
  

  const targetTypeOptions =
  targetType?.data?.result?.targetType?.map(
    (targetType: { vsTargetType: string; pklTargetTypeId: string }) => ({
      label: targetType.vsTargetType,
      value: targetType.pklTargetTypeId,
    })
  ) || [];

  // Extract dropdown options


  const targetTypeSelected = watch("targetType");
 
  const schemeOptions =
    schemeData?.data?.result?.scheme?.map(
      (scheme: {
        vsSchemeName: string;
        pklSchemeId: number;
        vsSchemeCode: string;
        dtSanctionDate: string;
      }) => ({
        label: scheme.vsSchemeCode,
        value: scheme.pklSchemeId,
        vsSchemeCode: scheme.vsSchemeCode,
        dtSanctionDate: scheme.dtSanctionDate,
      })
    ) || [];

  

  // Watch selected scheme from the dropdown

  // Update fields when scheme changes


  const mutation = useMutation({
    mutationFn: (data: targetFormData) => submitTargetForm({ ...data }),
    onSuccess: (data) => {
         if (data?.success) {
           closeModal();
           toast.success(
             data.message || "Training Partner submitted successfully!"
           );
           queryClient.invalidateQueries({ queryKey: ["targetData"] });
         } else {
           toast.error(
             data.message || "An error occurred while submitting the Training Partner."
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

  const onSubmit: SubmitHandler<targetFormData> = (data: targetFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="px-4 py-4 md:px-6 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >
        {/* Scheme Code */}
        <div className="col-span-1">
          <Label text="Scheme Code" required/>
          <Controller
            name="vsSchemeCode"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={schemeOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setValue("vsSchemeCode", String(selectedOption.value));
                }}
                className={errors.vsSchemeCode ? "border-red-500" : ""}
                placeholder="-- Select Scheme --"
              />
            )}
          />
          {errors.vsSchemeCode && (
            <p className="text-red-500">{errors.vsSchemeCode.message}</p>
          )}
        </div>

       

        <div>
          <Label text="Target Type"required />
          <Controller
            name="targetType"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={targetTypeOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setValue("targetType",(selectedOption.value));
                }}
                className={errors.targetType ? "border-red-500" : ""}
                placeholder="-- Select Scheme --"
              />
            )}
          />
          {errors.targetType && (
            <p className="text-red-500 text-sm">
              {errors.targetType.message}
            </p>
          )}
        </div>






 {/* Sanction Order Number */}
 <div>
          <Label text="Target Order Number" required/>
          <Controller
            name="vsTargetNo"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsTargetNo ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsTargetNo && (
            <p className="text-red-500 text-sm">
              {errors.vsTargetNo.message}
            </p>
          )}
        </div>




        {

          
          Number(targetTypeSelected) === 1 ?

         (  <div>
          <Label text="Financial Year" required />
          <Controller
            control={control}
            name="dtTargetDate"
            rules={{
              validate: (value) => {
                const selectedDate = new Date(value);
                if (isAfter(selectedDate, new Date())) {
                  return "Future dates are not allowed";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Dropdown
                {...field}
                //@ts-ignore
                options={financialYears.map((year) => ({ label: year, value: year }))}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setValue("dtTargetDate", selectedOption.value.toString());
                }}
                className={errors.dtTargetDate ? "border-red-500" : ""}
                placeholder="-- Select Year --"
                />
            )}
          />
         
        </div> ) :  <div>
          <Label text="Date Of Target" required />
          <Controller
            control={control}
            name="dtTargetDate"
            rules={{
              validate: (value) => {
                const selectedDate = new Date(value);
                if (isAfter(selectedDate, new Date())) {
                  return "Future dates are not allowed";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                className="w-full"
                max={format(new Date(), "yyyy-MM-dd")} // Restrict future dates in UI
              />
            )}
          />
          {errors.dtTargetDate && (
            <p className="text-red-500">{errors.dtTargetDate.message}</p>
          )}
        </div>
        }
     

        {/* Total Target */}
        <div>
          <Label text="Total Target" required/>
          <Controller
            name="iTotalTarget"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.iTotalTarget ? "border-red-500" : ""}
              />
            )}
          />
          {errors.iTotalTarget && (
            <p className="text-red-500 text-sm">
              {errors.iTotalTarget.message}
            </p>
          )}
        </div>
       
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-red-500 text-sm mb-2">* Required fields</p>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-semibold">Scheme Code <span className="text-red-600">*</span></span> - Select the appropriate scheme from the dropdown. 
                <span className="text-red-600"><span className="font-semibold text-red-700">*</span>Note: If your scheme is not listed, please add the scheme first before proceeding.</span>
              </p>
              <p className="text-sm"><span className="font-semibold">Target Type <span className="text-red-600">*</span></span> - Choose the type of target:
                <br />Annual – Target set for an entire financial year (e.g., 2024–2025)
                <br />Batch-based – Target assigned for a specific training batch with a fixed date.
              </p>
              <p className="text-sm"><span className="font-semibold">Target Order Number <span className="text-red-600">*</span></span> - Enter the official order/reference number associated with this target.</p>
              <p className="text-sm"><span className="font-semibold">Date of Target   <span className="text-red-600">*</span> </span> 
                <br /> If Annual, enter the financial year (e.g., 2024-2025)
                <br /> If Batch, enter the specific date in dd-mm-yyyy format.
              </p>
              <p className="text-sm"><span className="font-semibold">Total Target <span><span className="text-red-600">*</span></span></span> - Enter the total number assigned as the target. Must be a whole number greater than 0.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end bg-gray-100 p-4 rounded-xl">
          <Button
            text="Submit"
            loadingText="Submitting..."
            loading={mutation.isPending}
            disabled={false}
          />
        </div>
      </form>
    </div>
  );
};

export default TargetModal;
