/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "../../ui/SubmitButton";
import Label from "../Label";
import Input from "../Input";
import { toast } from "react-toastify";
import { TrainingPartnerFormData } from "../../../utils/formTypes";
import { trainingPartnerSchema } from "../../../utils/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDistrictByState,
  getMasterData,
  getULBblockByDistrict,
} from "../../../services/state/api/masterApi";
import Dropdown from "../Dropdown";
import { submitTrainingPartnerForm } from "../../../services/state/api/FormApi";
import useModalStore from "../../../services/state/useModelStore";

const TrainingPartnerModal: React.FC = () => {
  const { closeModal } = useModalStore()
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TrainingPartnerFormData>({
    resolver: joiResolver(trainingPartnerSchema),
  });
  const queryClient = useQueryClient();
  const [stateId, setStateId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);



  console.log(districtId);

  const { data: masterData } = useQuery({
    queryKey: ["masterData", "state"],
    queryFn: () => getMasterData("state"),
  });

  const { data: districtData } = useQuery({
    queryKey: ["masterData", "district", stateId],
    queryFn: () => getDistrictByState(stateId, "district"),
  });

  const { data: ULBblockData } = useQuery({
    queryKey: ["masterData", "districtId", districtId],
    queryFn: () => getULBblockByDistrict(districtId, "ULBblock"),
  });

  useEffect(() => {
    if (masterData) {
      console.log("Fetched master data:", masterData);
    }
  }, [masterData]);

  useEffect(() => {
    if (districtData) {
      console.log("Fetched master data:", districtData);
    }
  }, [districtData]);

  useEffect(() => {
    if (ULBblockData) {
      console.log("Fetched master data:", ULBblockData);
    }
  }, [ULBblockData]);

  const stateOptions =
    masterData?.data?.result?.states?.map(
      (states: { stateID: number; stateName: string }) => ({
        label: states.stateName,
        value: states.stateID,
      })
    ) || [];

  const districtOptions =
    districtData?.data?.result?.districts?.map(
      (districts: { districtID: number; districtName: string }) => ({
        label: districts.districtName,
        value: districts.districtID,
      })
    ) || [];




  const selectedVillageCity = watch("isVillageCity", "") as unknown as string;

  const isCityVillage = [
    { label: "Village", value: "Village" },
    { label: "City", value: "City" },
  ];

  const ULBblockOptions = selectedVillageCity === "Village"
    ? ULBblockData?.data?.result?.blocks?.map(
      (blocks: { blockId: number; blockName: string }) => ({
        label: blocks.blockName,
        value: blocks.blockId,
      })
    ) || []
    : selectedVillageCity === "City"
      ? ULBblockData?.data?.result?.ulbs?.map(
        (ulbs: { ulbId: number; ulbName: string }) => ({
          label: ulbs.ulbName,
          value: ulbs.ulbId,
        })
      ) || []
      : [];

  const mutation = useMutation({
    mutationFn: submitTrainingPartnerForm,
    onSuccess: (data) => {
      if (data?.success) {
        closeModal();
        toast.success(
          data.message || "Training Partner submitted successfully!"
        );
        queryClient.invalidateQueries({ queryKey: ["tpData"] });
      } else {
        toast.error(
          data.message || "An error occurred while submitting the scheme."
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "An unknown error occurred.";
      toast.error(errorMessage);
    },
  });


  const onSubmit: SubmitHandler<TrainingPartnerFormData> = (
    data: TrainingPartnerFormData
  ) => {
    mutation.mutate(data);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function setValue(_arg0: string, _arg1: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >
        {/* Name */}
        <div className="col-span-1">
          <Label text="Name" required />
          <Controller
            name="vsTpName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsTpName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsTpName && (
            <p className="text-red-500">{errors.vsTpName.message}</p>
          )}
        </div>

        {/* Smart ID */}
        <div className="col-span-2">
          <Label text="Smart ID (If Registered From NSDC)" />
          <Controller
            name="vsSmartId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
              // className={errors.vsSmartId ? "border-red-500" : ""}
              />
            )}
          />
          {/* {errors.vsSmartId && (
            <p className="text-red-500">{errors.vsSmartId.message}</p>
          )} */}
        </div>

        <div className="col-span-1">
          <Label text="PAN Card" required />
          <Controller
            name="vsPAN"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsPAN ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsPAN && (
            <p className="text-red-500">{errors.vsPAN.message}</p>
          )}
        </div>

        {/* SPOC Name */}
        <div className="col-span-2">
          <Label text="SPOC Name" required />
          <Controller
            name="vsSpocName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsSpocName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsSpocName && (
            <p className="text-red-500">{errors.vsSpocName.message}</p>
          )}
        </div>



        {/* Mobile */}
        <div className="col-span-1">
          <Label text="Mobile" required />
          <Controller
            name="iSpocContactNum"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="tel"
                maxLength={10}
                className={errors.iSpocContactNum ? "border-red-500" : ""}
              />
            )}
          />
          {errors.iSpocContactNum && (
            <p className="text-red-500">{errors.iSpocContactNum.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="col-span-1">
          <Label text="Email" required />
          <Controller
            name="vsSpocEmail"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                className={errors.vsSpocEmail ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsSpocEmail && (
            <p className="text-red-500">{errors.vsSpocEmail.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="col-span-2">
          <Label text="Address" required />
          <Controller
            name="vsAddress"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsAddress ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsAddress && (
            <p className="text-red-500">{errors.vsAddress.message}</p>
          )}
        </div>

        {/* State */}
        <div className="col-span-1">
          <Label text="State" required />
          <Controller
            name="vsState"
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
                  setValue("vsState", selectedOption.value); // Sync form value
                }}
                className={errors.vsState ? "border-red-500" : ""}
                placeholder="-- Select State --"
              />
            )}
          />
          {errors.vsState && (
            <p className="text-red-500">{errors.vsState.message}</p>
          )}
        </div>

        {/* District */}
        <div className="col-span-1">
          <Label text="District" required />
          <Controller
            name="vsDistrict"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={districtOptions}
                getOptionLabel={(option: { label: string }) => option.label}
                getOptionValue={(option: { value: number }) => option.value}
                onSelect={(selectedValue: { label: string; value: number }) => {
                  field.onChange(selectedValue.value);
                  setDistrictId(selectedValue.value);
                  setValue("vsDistrict", selectedValue.value);
                }}
                placeholder="-- Select District --"
                className={errors.vsDistrict ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsDistrict && (
            <p className="text-red-500">{errors.vsDistrict.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Village/City" />
          <Controller
            name="isVillageCity"
            control={control}
            defaultValue="" // Ensure the initial value is an empty string
            render={({ field }) => (
              <select
                {...field}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.isVillageCity ? "border-red-500" : ""
                  }`}
              >
                <option value="" disabled>
                  -- Select Village/City --
                </option>
                {isCityVillage.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {/* {errors.isVillageCity && (
    <p className="text-red-500">{errors.isVillageCity.message}</p>
  )} */}
        </div>


        {selectedVillageCity === "Village" && (
          <>
            <div className="col-span-1">
              <Label text="Block" />
              <Controller
                name="vsBlock"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={ULBblockOptions} // Pass the full array of options
                    getOptionLabel={(option) => option.label} // Display the label
                    getOptionValue={(option) => option.value} // Use the blockID as the value
                    onSelect={(selectedOption) => {
                      field.onChange(selectedOption.value); // Update form with selected blockID
                      setValue("vsBlock", selectedOption.value); // Sync form value with selected blockID
                    }}
                    className={errors.vsBlock ? "border-red-500" : ""}
                    placeholder="-- Select Block --"
                  />
                )}
              />
              {errors.vsBlock && (
                <p className="text-red-500">{errors.vsBlock.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label text="Village"  />
              <Controller
                name="vsVillage"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={errors.vsVillage ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsVillage && (
                <p className="text-red-500">{errors.vsVillage.message}</p>
              )}
            </div>
          </>
        )}

        {selectedVillageCity === "City" && (
          <>
            <div className="col-span-1">
              <Label text="ULB"  />
              <Controller
                name="vsULB"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={ULBblockOptions} // Pass the full array of options with `label` and `value`
                    getOptionLabel={(option) => option.label} // Display the label (ULB name)
                    getOptionValue={(option) => option.value} // Use the ULB ID as the value
                    onSelect={(selectedOption) => {
                      field.onChange(selectedOption.value); // Update the form with selected ULB ID
                      setValue("vsULB", selectedOption.value); // Sync form value with selected ULB ID
                    }}
                    className={errors.vsULB ? "border-red-500" : ""}
                    placeholder="-- Select ULB --"
                  />
                )}
              />
              {errors.vsULB && (
                <p className="text-red-500">{errors.vsULB.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label text="City"  />
              <Controller
                name="vsCity"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={errors.vsCity ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsCity && (
                <p className="text-red-500">{errors.vsCity.message}</p>
              )}
            </div>
          </>
        )}

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

export default TrainingPartnerModal;
