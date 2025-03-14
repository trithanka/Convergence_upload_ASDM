import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Label from "../Label";
import Input from "../Input";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../ui/SubmitButton";
import { PlacementFormData } from "../../../utils/formTypes";
import { placementValidationSchema } from "../../../utils/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {

  getCandidateByBatch,
  getDistrictByState,
  getMasterData,
} from "../../../services/state/api/masterApi";
import Dropdown from "../Dropdown";
import { submitPlacementForm } from "../../../services/state/api/FormApi";
import { toast } from "react-toastify";
import useModalStore from "../../../services/state/useModelStore";

const PlacementModal: React.FC = () => {
  const { closeModal } = useModalStore();


  const [batchId, setBatchId] = useState<number | null>(null);
  const [stateId, setStateId] = useState<number | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PlacementFormData>({
    resolver: joiResolver(placementValidationSchema),
    mode: "onChange",
  });

const queryClient = useQueryClient();

  const { data: batchhData } = useQuery({
    queryKey: ["masterData", "batchCandidate"],
    queryFn: () => getMasterData("batchCandidate"),
  });

  useEffect(() => {
    if (batchhData) {
      console.log("Fetched master data:", batchhData);
    }
  }, [batchhData]);

  // const { data: masterData } = useQuery({
  //   queryKey: ["masterData", "tp"],
  //   queryFn: () => getMasterData("tp"),
  // });

  // const tpOptions =
  //   masterData?.data?.result?.tp?.map(
  //     (tp: { pklTpId: number; vsTpName: string }) => ({
  //       label: tp.vsTpName,
  //       value: tp.pklTpId,
  //     })
  //   ) || [];

  const { data: pTypeData } = useQuery({
    queryKey: ["masterData", "placementType"],
    queryFn: () => getMasterData("placementType"),
  });

  const pTypeOptions =
    pTypeData?.data?.result?.invoice_type?.map(
      (pt: { pklPlacementTypeId: number; vsTypeDisplayName: string }) => ({
        label: pt.vsTypeDisplayName,
        value: pt.vsTypeDisplayName,
      })
    ) || [];

  // const { data: tcData } = useQuery({
  //   queryKey: ["masterData", "tc", fklTpId],
  //   queryFn: () => getTcByTp(fklTpId, "tc"),
  //   enabled: !!fklTpId,
  // });

  // const tcOptions =
  //   tcData?.data?.result?.tc?.map(
  //     (tc: { pklTcId: number; vsTcName: string }) => ({
  //       label: tc.vsTcName,
  //       value: tc.pklTcId,
  //     })
  //   ) || [];

  // const { data: batchData } = useQuery({
  //   queryKey: ["getBatch", "tc", fklTpId, fklTcId],
  //   queryFn: () => getBatch(fklTpId, "batch", fklTcId),
  //   enabled: !!fklTcId && !!fklTpId,
  // });
  // console.log(batchData)

  const batchOptions =
    batchhData?.data?.result?.batchCandidate?.map(
      (batch: { id: number; iBatchNumber: number }) => ({
        label: String(batch.iBatchNumber),
        value: batch.id,
      })
    ) || [];

  const { data: candidateData } = useQuery({
    queryKey: ["masterData", "candidateByBatch", batchId],
    queryFn: () => getCandidateByBatch(batchId, "candidateByBatch"),
    enabled: !!batchId,
  });

  const candidateOptions =
    candidateData?.data?.result?.candidateByBatchId?.map(
      (tc: { id: number; name: string ; status: number  }) => ({
        label: tc.name,
        value: tc.id,
        disabled: tc.status === 1,
      })
    ) || [];

  const { data: stateData } = useQuery({
    queryKey: ["masterData", "state"],
    queryFn: () => getMasterData("state"),
  });
  const stateOptions =
    stateData?.data?.result?.states?.map(
      (states: { stateID: number; stateName: string }) => ({
        label: states.stateName,
        value: states.stateID,
      })
    ) || [];

  const { data: districtData } = useQuery({
    queryKey: ["masterData", "district", stateId],
    queryFn: () => getDistrictByState(stateId, "district"),
  });

  const districtOptions =
    districtData?.data?.result?.districts?.map(
      (districts: { districtID: number; districtName: string }) => ({
        label: districts.districtName,
        value: districts.districtID,
      })
    ) || [];

    // const bIsCandidatePlacedValue = watch("bIsCandidatePlaced"); 


  const mutation = useMutation({
    mutationFn: submitPlacementForm,
    onSuccess: (data) => {
    
      if (data?.success) {
        closeModal();
        toast.success(data.message || "Assesment submitted successfully!");
       
        queryClient.invalidateQueries({ queryKey: ["placementData"] });
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

  const onSubmit: SubmitHandler<PlacementFormData> = (
    data: PlacementFormData
  ) => {
    mutation.mutate(data);
  };

  return (
    <div className="px-4 py-4 md:px-6 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >

        {/* <div className="col-span-1">
          <Label text="Training Partner" />
          <Controller
            name="fklTpId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={tpOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setTpId(selectedOption.value);
                  setValue("fklTpId", selectedOption.value);
                }}
                className={errors.fklTpId ? "border-red-500" : ""}
                placeholder="-- Select Partners --"
              />
            )}
          />
          {errors.fklTpId && (
            <p className="text-red-500">{errors.fklTpId.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Training Center" />
          <Controller
            name="fklTcId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={tcOptions}
                getOptionLabel={(option: { label: string }) => option.label}
                getOptionValue={(option: { value: number }) => option.value}
                onSelect={(selectedValue: { label: string; value: number }) => {
                  field.onChange(selectedValue.value);
                  setTcId(selectedValue.value);
                  setValue("fklTcId", selectedValue.value);
                }}
                placeholder="-- Select Centers --"
                className={errors.fklTcId ? "border-red-500" : ""}
              />
            )}
          />
          {errors.fklTcId && (
            <p className="text-red-500">{errors.fklTcId.message}</p>
          )}
        </div> */}

        {/* Batch ID */}
        <div className="col-span-1">
          <Label text="Batch" required />
          <Controller
            name="batchId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={batchOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setBatchId(selectedOption.value);
                  setValue("batchId", selectedOption.value);
                }}
                className={errors.batchId ? "border-red-500" : ""}
                placeholder="-- Select Batch --"
              />
            )}
          />
          {errors.batchId && (
            <p className="text-red-500">{errors.batchId.message}</p>
          )}
        </div>

        {/* Candidate ID */}
        <div className="col-span-1">
          <Label text="Candidate Name" required />
          <Controller
            name="candidateId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={candidateOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                isOptionDisabled={(option) => option.disabled ?? false}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setValue("candidateId", selectedOption.value);
                }}
                className={errors.candidateId ? "border-red-500" : ""}
                placeholder="-- Select Candidate Name --"
              />
            )}
          />
          {errors.candidateId && (
            <p className="text-red-500">{errors.candidateId.message}</p>
          )}
        </div>

        {/* Is Candidate Placed? */}
        {/* <div>
          <Label text="Is Candidate Placed?" required />
          <Controller
            name="bIsCandidatePlaced"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <label>
                  <input
                    {...field}
                    type="radio"
                    value="1"
                    checked={field.value === 1}
                    onChange={() => field.onChange(1)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    {...field}
                    type="radio"
                    value="0"
                    checked={field.value === 0}
                    onChange={() => field.onChange(0)}
                  />
                  No
                </label>
              </div>
            )}
          />
          {errors.bIsCandidatePlaced && (
            <p className="text-red-500">{errors.bIsCandidatePlaced.message}</p>
          )}
        </div> */}


        {/* Placement Type */}
       
        <div className="col-span-1">
          <Label text="Placement Type" required />
          <Controller
            name="vsPlacementType"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={pTypeOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);

                  setValue("vsPlacementType", selectedOption.value.toString());
                }}
                className={errors.vsPlacementType ? "border-red-500" : ""}
                placeholder="-- Select Placement Type --"
              />
            )}
          />
          {errors.vsPlacementType && (
            <p className="text-red-500">{errors.vsPlacementType.message}</p>
          )}
        </div>
        
        {/* Employer Name */}
      
        <div>
          <Label text="Employer Name" />
          <Controller
            name="vsEmployeerName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
              // className={`w-full ${
              //   errors.vsEmployeerName ? "border-red-500" : ""
              // }`}
              />
            )}
          />
          {/* {errors.vsEmployeerName && (
            <p className="text-red-500">{errors.vsEmployeerName.message}</p>
          )} */}
        </div>
      
        {/* Employer Contact Number */}
       
        <div>
          <Label text="Employer Contact Number" />
          <Controller
            name="vsEmployeerContactNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
              // className={`w-full ${
              //   errors.vsEmployeerContactNumber ? "border-red-500" : ""
              // }`}
              />
            )}
          />
          {/* {errors.vsEmployeerContactNumber && (
            <p className="text-red-500">
              {errors.vsEmployeerContactNumber.message}
            </p>
          )} */}
        </div>
     
        {/* Placement State */}
      
        <div className="col-span-1">
          <Label text="Placement State" />
          <Controller
            name="vsPlacementState"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={stateOptions} // Pass full objects with label and value
                getOptionLabel={(option) => option.label} // Display the `label`
                getOptionValue={(option) => option.value} // Use the `value` (stateID)
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value); // Update form with selected stateID
                  setStateId(selectedOption.value); // Update the stateID in local state
                  setValue("vsPlacementState", selectedOption.value); // Sync form value
                }}
                // className={errors.vsPlacementState ? "border-red-500" : ""}
                placeholder="-- Select State --"
              />
            )}
          />
          {/* {errors.vsPlacementState && (
            <p className="text-red-500">{errors.vsPlacementState.message}</p>
          )} */}
        </div>
      

        {/* Placement District */}
      
        <div className="col-span-1">
          <Label text="Placement District" />
          <Controller
            name="vsPlacementDistrict"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={districtOptions}
                getOptionLabel={(option: { label: string }) => option.label}
                getOptionValue={(option: { value: number }) => option.value}
                onSelect={(selectedValue: { label: string; value: number }) => {
                  field.onChange(selectedValue.value);
                  setValue("vsPlacementDistrict", selectedValue.value);
                }}
                placeholder="-- Select District --"
              // className={errors.vsPlacementDistrict ? "border-red-500" : ""}
              />
            )}
          />
          {/* {errors.vsPlacementDistrict && (
            <p className="text-red-500">{errors.vsPlacementDistrict.message}</p>
          )} */}
        </div>
       

        {/* Monthly Salary */}
     
        <div>
          <Label text="Monthly Salary" />
          <Controller
            name="vsMonthlySalary"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
              // className={`w-full ${
              //   errors.vsMonthlySalary ? "border-red-500" : ""
              // }`}
              />
            )}
          />
          {/* {errors.vsMonthlySalary && (
            <p className="text-red-500">{errors.vsMonthlySalary.message}</p>
          )} */}
        </div>

        <div className="col-span-1">
          <Label text="Appointment Date" />
          <Controller
            name="dtAppointmentDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                value={field.value || ""}
                className={errors.dtAppointmentDate ? "border-red-500" : ""}
              />
            )}
          />
          {errors.dtAppointmentDate && (
            <p className="text-red-500">{errors.dtAppointmentDate.message}</p>
          )}
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

export default PlacementModal;
