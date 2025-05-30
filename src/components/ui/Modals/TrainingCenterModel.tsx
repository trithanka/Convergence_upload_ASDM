/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../ui/SubmitButton";
import Label from "../Label";
import Input from "../Input";
import { TrainingCenterFormData } from "../../../utils/formTypes";
import { trainingCenterSchema } from "../../../utils/validation";
import { getDistrictByState, getMasterData, getULBblockByDistrict } from "../../../services/state/api/masterApi";
import { submitTraningCenterForm } from "../../../services/state/api/FormApi";
import { toast } from "react-toastify";
import Dropdown from "../Dropdown";
import useModalStore from "../../../services/state/useModelStore";




const TrainingCenterModel: React.FC = () => {
  const { closeModal } = useModalStore()
  const [stateId, setStateId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);


  const {
    handleSubmit,
    control,
    setValue,

    formState: { errors },
  } = useForm<TrainingCenterFormData>({
    resolver: joiResolver(trainingCenterSchema),
  });


  const { data: ULBblockData } = useQuery({
    queryKey: ["masterData", "districtId", districtId],
    queryFn: () => getULBblockByDistrict(districtId, "ULBblock"),
  });

  useEffect(() => {
    if (ULBblockData) {
      console.log("Fetched master data:", ULBblockData);
    }
  }, [ULBblockData]);

  // const ULBblockOptions =
  // ULBblockData?.data?.result?.blocks?.map(
  //   (blocks: { blockId: number; blockName: string }) => ({
  //     label: blocks.blockName,
  //     value: blocks.blockId,
  //   })
  // ) || [];


  // const { data: constiAssemblyData } = useQuery({
  //   queryKey: ["masterData", "constituency"],
  //   queryFn: () =>getMasterData("constituency"),
  // });

  // const selectedVillageCity = watch("isVillageCity", "") as unknown as string;

  // const isCityVillage = [
  //   { label: "Village", value: "Village" },
  //   { label: "City", value: "City" },
  // ];



  const queryClient = useQueryClient();


  const { data: masterData } = useQuery({
    queryKey: ["masterData", "state"],
    queryFn: () => getMasterData("state"),
  });

  useEffect(() => {
    if (masterData) {
      console.log("Fetched master data:", masterData);
    }
  }, [masterData]);


  const stateOptions =
    masterData?.data?.result?.states?.map(
      (states: { stateID: number; stateName: string }) => ({
        label: states.stateName,
        value: states.stateID,
      })
    ) || [];


  const { data: districtData } = useQuery({
    queryKey: ["masterData", "district", stateId],
    queryFn: () => getDistrictByState(stateId, "district"),
  });

  useEffect(() => {
    if (districtData) {
      console.log("Fetched master data:", districtData);
    }
  }, [districtData]);

  const districtOptions =
    districtData?.data?.result?.districts?.map(
      (districts: { districtID: number; districtName: string }) => ({
        label: districts.districtName,
        value: districts.districtID,
      })
    ) || [];



  //  const { data: ULBblockData } = useQuery({
  //     queryKey: ["masterData", "districtId", districtId],
  //     queryFn: () => getULBblockByDistrict(districtId, "ULBblock"),
  //   });

  //     useEffect(() => {
  //       if (ULBblockData) {
  //         console.log("Fetched master data:", ULBblockData);
  //       }
  //     }, [ULBblockData]);

  //     const ULBblockOptions =
  //     ULBblockData?.data?.result?.blocks?.map(
  //       (blocks: { blockId: number; blockName: string }) => ({
  //         label: blocks.blockName,
  //         value: blocks.blockId,
  //       })
  //     ) || [];


  // const { data: constiAssemblyData } = useQuery({
  //   queryKey: ["masterData", "constituency"],
  //   queryFn: () =>getMasterData("constituency"),
  // });

  // const selectedVillageCity = watch("isVillageCity", "") as unknown as string;

  // const isCityVillage = [
  //   { label: "Village", value: "Village" },
  //   { label: "City", value: "City" },
  // ];


  const { data: tpData } = useQuery({
    queryKey: ["masterData", "tp"],
    queryFn: () => getMasterData("tp"),
  });

  useEffect(() => {
    if (tpData) {
      console.log("Fetched master data:", tpData);
    }
  }, [tpData]);
  const tpOptions =
    tpData?.data?.result?.tp?.map(
      (tp: { pklTpId: number; vsTpName: string }) => ({
        label: tp.vsTpName,
        value: tp.pklTpId,
      })
    ) || [];


  // const tpOptions =
  // tpData?.data?.result?.tp?.map(
  //   (tp: { pklTpId: number; vsTpName: string }) => ({
  //     label: tp.vsTpName,
  //     value: tp.pklTpId,
  //   })
  // ) || [];


  // const fetchPartnerData = useMutation({
  //   mutationFn: (id: string) => getPartnerById(id),
  //   onSuccess: (response) => {
  //     const data = response?.data?.[0];
  //     if (data && data.vsTpName) {
  //       setValue("vsTpName", data.vsTpName); // Set only the vsTpName field
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Error fetching partner data:", error);
  //   },
  // });





  const submitMutation = useMutation({
    mutationFn: (data: TrainingCenterFormData) => submitTraningCenterForm({ ...data }),
    onSuccess: (data) => {
      if (data?.success) {
        closeModal();
        toast.success(data.message || "Training Center submitted successfully!");
        queryClient.invalidateQueries({ queryKey: ["tcData"] });
      } else {
        toast.error(
          data.message || "An error occurred while submitting the Training Center."
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



  const onSubmit: SubmitHandler<TrainingCenterFormData> = (data: TrainingCenterFormData) => {
    submitMutation.mutate(data);
  };



  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >
        {/* First Row */}
        {/* Name */}
        <div className="col-span-1">
          <Label text="Training Partner" required />
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

                  setValue("fklTpId", selectedOption.value.toString());
                }}
                className={errors.fklTpId ? "border-red-500" : ""}
                placeholder="-- TP Name --"
              />
            )}
          />
          {errors.fklTpId && (
            <p className="text-red-500">{errors.fklTpId.message}</p>
          )}
        </div>




        {/* Second Row */}
        <div className="col-span-2">
          <Label text="Training Center Name" required />
          <Controller
            name="vsTcName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsTcName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsTcName && (
            <p className="text-red-500">{errors.vsTcName.message}</p>
          )}
        </div>

        {/* <div>
          <Label text="Center Code" required/>
          <Controller
            name="vsTcCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsTcCode ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsTcCode && (
            <p className="text-red-500">{errors.vsTcCode.message}</p>
          )}
        </div> */}

        {/* <div>
          <Label text="Smart ID" />
          <Controller
            name="smartId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
              
              />
            )}
          />
        
        </div> */}

        {/* <div>
          <Label text="SPOC Name"required />
          <Controller
            name="vsSpocName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsSpocEmail ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsSpocName && (
            <p className="text-red-500">{errors.vsSpocName.message}</p>
          )}
        </div> */}

        {/* <div>
          <Label text="Center Code" />
          <Controller
            name="vsTcCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsTcCode ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsTcCode && (
            <p className="text-red-500">{errors.vsTcCode.message}</p>
          )}
        </div> */}

        {/* <div>
          <Label text="SPOC Email" required />
          <Controller
            name="vsSpocEmail"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsSpocEmail ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsSpocEmail && (
            <p className="text-red-500">{errors.vsSpocEmail.message}</p>
          )}
        </div> */}


        {/* 
        <div>
          <Label text="SPOC Contact"required />
          <Controller
            name="iSpocContactNum"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.iSpocContactNum ? "border-red-500" : ""}
              />
            )}
          />
          {errors.iSpocContactNum && (
            <p className="text-red-500">{errors.iSpocContactNum.message}</p>
          )}
        </div> */}

        <div className="col-span-2">
          <Label text="Training Center Address" required />
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

        <div className="col-span-1">
          <Label text="Center Longitude" required />
          <Controller
            name="vsLongitude"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsLongitude ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsLongitude && (
            <p className="text-red-500">{errors.vsLongitude.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Center Latitude" required />
          <Controller
            name="vsLatitude"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsLatitude ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsLatitude && (
            <p className="text-red-500">{errors.vsLatitude.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Center State" required />
          <Controller
            name="vsState"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={stateOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setStateId(selectedOption.value);
                  setValue("vsState", selectedOption.value);
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

        <div className="col-span-1">
          <Label text="Center District" required />
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
        {/* <div className="col-span-1">
  <Label text="Village/City" />
  <Controller
    name="isVillageCity"
    control={control}
    defaultValue="" // Ensure the initial value is an empty string
    render={({ field }) => (
      <select
        {...field}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors.isVillageCity ? "border-red-500" : ""
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
  {errors.isVillageCity && (
    <p className="text-red-500">{errors.isVillageCity.message}</p>
  )}
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
              <Label text="Village" />
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
              <Label text="ULB" />
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
              <Label text="City" />
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

<div className="col-span-1">
  <Label text="Assembly Constituency" />
  <Controller
    name="fklAssemblyConstituencyId"
    control={control}
    render={({ field }) => (
      <Dropdown
        {...field}
        options={
          constiAssemblyData?.data?.result?.assemblyConstituency?.map(
            (assembly: { ConstituencyName: string; AssemblyConstituencyId: number }) => ({
              label: assembly.ConstituencyName, // Display name
              value: assembly.AssemblyConstituencyId, // ID to store
            })
          ) || [] // Fallback to an empty array
        }
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        onSelect={(selectedOption) => {
          field.onChange(selectedOption.value); // Update form value
          setValue("fklAssemblyConstituencyId", selectedOption.value); // Sync form value
        }}
        className={errors.fklAssemblyConstituencyId ? "border-red-500" : ""}
        placeholder="-- Select Assembly Constituency --"
      />
    )}
  />
  {errors.fklAssemblyConstituencyId && (
    <p className="text-red-500">
      {errors.fklAssemblyConstituencyId.message}
    </p>
  )}
</div>


<div className="col-span-1">
  <Label text="Lok Sabha Constituency" />
  <Controller
    name="fklLoksabhaConstituencyId"
    control={control}
    render={({ field }) => (
      <Dropdown
        {...field}
        options={
          constiAssemblyData?.data?.result?.loksabhaConstituency?.map(
            (loksabha: { ConstituencyName: string; LoksabhaConstituencyId: number }) => ({
              label: loksabha.ConstituencyName, // Display name
              value: loksabha.LoksabhaConstituencyId, // ID to store
            })
          ) || [] // Fallback to an empty array
        }
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        onSelect={(selectedOption) => {
          field.onChange(selectedOption.value); // Update form value
          setValue("fklLoksabhaConstituencyId", selectedOption.value); // Sync form value
        }}
        className={errors.fklLoksabhaConstituencyId ? "border-red-500" : ""}
        placeholder="-- Select Lok Sabha Constituency --"
      />
    )}
  />
  {errors.fklLoksabhaConstituencyId && (
    <p className="text-red-500">
      {errors.fklLoksabhaConstituencyId.message}
    </p>
  )}
</div> */}


        <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-red-500 text-sm mb-2">* Required fields</p>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-semibold">Training Partner<span className="text-red-600" >*</span></span>  Choose an existing Training Partner (TP) from the drop-down list.
                <span className="text-red-600"> *Note: Make sure to enter TP details before entering Training Center (TC) information.</span>
              
              </p>
              <p className="text-sm"><span className="font-semibold">Training Center Name: <span className="text-red-600" >*</span></span> Enter a valid Training Center (TC) Name associated with the selected TP.
                <span className="text-red-600"> *Note: Make sure to add TC details before selecting.</span>
              </p>
              <p className="text-sm"><span className="font-semibold">Training Center Address: <span className="text-red-600" >*</span></span> Provide the complete TC Address.
                <span className="text-red-600"> *Note: Make sure to add course details beforehand.</span>
              </p>
              <p className="text-sm"><span className="font-semibold">Center Longitude / Center Latitude:<span className="text-red-600" >*</span></span>  Enter valid Longitude and Latitude coordinates for the TC (e.g., 26.114989499524036, 91.71892438694623)

                <span className="text-red-600"> *Note: The system uses Longitude and Latitude to check for duplicate TCs.</span>

              </p>
              <p className="text-sm"><span className="font-semibold"> Center State / Center District: <span className="text-red-600" >*</span></span>   Select a valid State and District from the drop-down list.

              </p>
             
            </div>
          </div>
        </div>





        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end bg-gray-100 p-4 rounded-xl">
          <Button
            text="Submit"
            loadingText="Submitting..."
            loading={submitMutation.isPending}

            disabled={false}
          />
        </div>
      </form>
      
    </div>
  );
};

export default TrainingCenterModel;
