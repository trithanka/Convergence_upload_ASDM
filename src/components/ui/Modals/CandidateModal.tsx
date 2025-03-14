import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Input from "../Input";
import Label from "../Label";
import Button from "../SubmitButton";
import { toast } from "react-toastify";
import { candidateSchema } from "../../../utils/validation";
import { candidateFormData } from "../../../utils/formTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // getBranchByBank,
  // getDistrictByState,
  // getIfscByBranch,
  getMasterData,
  // getULBblockByDistrict,
} from "../../../services/state/api/masterApi";
import Dropdown from "../Dropdown";
import { submitCandidateForm } from "../../../services/state/api/FormApi";
import useModalStore from "../../../services/state/useModelStore";
import { format, isAfter, differenceInYears } from "date-fns";
// import { Autocomplete, TextField } from "@mui/material";

const CandidateModal: React.FC = () => {
  const { closeModal } = useModalStore();
  // const [isSameAddress, setIsSameAddress] = useState(true);
  // const [stateId, setStateId] = useState<number | null>(null);
  // const [districtId, setDistrictId] = useState<number | null>(null);

  // const [stateIdP, setStateIdP] = useState<number | null>(null);
  // const [districtIdP, setDistrictIdP] = useState<number | null>(null);

  // const [fklBankId, setBank] = useState<number | null>(null);
  // const [pklBranchId, setBranch] = useState<number | null>(null);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<candidateFormData>({
    resolver: joiResolver(candidateSchema),
  });

  const queryClient = useQueryClient()

  const dob = watch("vsDOB");

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const age = differenceInYears(new Date(), birthDate);
      setValue("iAge", age.toString(), { shouldValidate: true });
    }
  }, [dob, setValue]);


  const { data: qualificationData } = useQuery({
    queryKey: ["masterData", "qualification"],
    queryFn: () => getMasterData("qualification"),
  });
  console.log("------", qualificationData?.data?.result?.qualification);

  const { data: genderData } = useQuery({
    queryKey: ["genderData", "gender"],
    queryFn: () => getMasterData("gender"),
  });

  useEffect(() => {
    if (genderData) {
      console.log("Fetched master data:", genderData);
    }
  }, [genderData]);

  const genderOptions =
    genderData?.data?.result?.gender?.map(
      (gender: { pklGenderId: number; vsGenderName: string }) => ({
        label: gender.vsGenderName,
        value: gender.pklGenderId,
      })
    ) || [];

  const { data: religionData } = useQuery({
    queryKey: ["religionData", "religion"],
    queryFn: () => getMasterData("religion"),
  });

  useEffect(() => {
    if (religionData) {
      console.log("Fetched master data:", religionData);
    }
  }, [religionData]);

  const religionOptions =
    religionData?.data?.result?.religion?.map(
      (religion: { pklReligionId: number; vsReligionName: string }) => ({
        label: religion.vsReligionName,
        value: religion.pklReligionId,
      })
    ) || [];

  // const { data: idTypeData } = useQuery({
  //   queryKey: ["idTypeData", "id_type"],
  //   queryFn: () => getMasterData("id_type"),
  // });

  // useEffect(() => {
  //   if (idTypeData) {
  //     console.log("Fetched master data:", idTypeData);
  //   }
  // }, [idTypeData]);



  const { data: categoryData } = useQuery({
    queryKey: ["categoryData", "category"],
    queryFn: () => getMasterData("category"),
  });

  useEffect(() => {
    if (categoryData) {
      console.log("Fetched master data:", categoryData);
    }
  }, [categoryData]);

  const categoryOptions =
    categoryData?.data?.result?.category?.map(
      (category: { pklCasteId: number; vsCasteName: string }) => ({
        label: category.vsCasteName,
        value: category.pklCasteId,
      })
    ) || [];

  // const { data: masterData } = useQuery({
  //   queryKey: ["masterData", "state"],
  //   queryFn: () => getMasterData("state"),
  // });

  const { data: batchIdOptions } = useQuery({
    queryKey: ["masterData", "batchIdOptions"],
    queryFn: () => getMasterData("batchCandidate"),
  });

  // const stateOptions =
  //   masterData?.data?.result?.states?.map(
  //     (states: { stateID: number; stateName: string }) => ({
  //       label: states.stateName,
  //       value: states.stateID,
  //     })
  //   ) || [];

  const batchOptions =
    batchIdOptions?.data?.result?.batchCandidate?.map(
      (item: { iBatchNumber: number , id: number}) => ({
        label: String(item.iBatchNumber), 
        value: item.id,
      })
    ) || [];

  console.log("id", batchOptions);
  console.log("000", batchIdOptions);

  // const { data: districtData } = useQuery({
  //   queryKey: ["masterData", "district", stateId],
  //   queryFn: () => getDistrictByState(stateId, "district"),
  // });

  // const districtOptions =
  //   districtData?.data?.result?.districts?.map(
  //     (districts: { districtID: number; districtName: string }) => ({
  //       label: districts.districtName,
  //       value: districts.districtID,
  //     })
  //   ) || [];

  // const { data: districtDataP } = useQuery({
  //   queryKey: ["masterData", "district", stateIdP],
  //   queryFn: () => getDistrictByState(stateIdP, "district"),
  // });

  // const districtOptionsP =
  //   districtDataP?.data?.result?.districts?.map(
  //     (districts: { districtID: number; districtName: string }) => ({
  //       label: districts.districtName,
  //       value: districts.districtID,
  //     })
  //   ) || [];

  // const { data: ULBblockData } = useQuery({
  //   queryKey: ["masterData", "districtId", districtId],
  //   queryFn: () => getULBblockByDistrict(districtId, "ULBblock"),
  // });

  // const { data: ULBblockDataP } = useQuery({
  //   queryKey: ["masterData", "districtId", districtIdP],
  //   queryFn: () => getULBblockByDistrict(districtIdP, "ULBblock"),
  // });

  // const isRCityVillage = [
  //   { label: "Village", value: "Village" },
  //   { label: "City", value: "City" },
  // ];

  // const vsPVillageCity = [
  //   { label: "Village", value: "Village" },
  //   { label: "City", value: "City" },
  // ];

  // const selectedRVillageCity = watch("isRCityVillage", "") as unknown as string;

  // const selectedPVillageCity = watch("vsPVillageCity", "") as unknown as string;

  // const ULBblockOptions =
  //   selectedRVillageCity === "Village"
  //     ? ULBblockData?.data?.result?.blocks?.map(
  //       (blocks: { blockId: number; blockName: string }) => ({
  //         label: blocks.blockName,
  //         value: blocks.blockId,
  //       })
  //     ) || []
  //     : selectedRVillageCity === "City"
  //       ? ULBblockData?.data?.result?.ulbs?.map(
  //         (ulbs: { ulbId: number; ulbName: string }) => ({
  //           label: ulbs.ulbName,
  //           value: ulbs.ulbId,
  //         })
  //       ) || []
  //       : [];

  // const ULBblockOptionsP =
  //   selectedPVillageCity === "Village"
  //     ? ULBblockDataP?.data?.result?.blocks?.map(
  //       (blocks: { blockId: number; blockName: string }) => ({
  //         label: blocks.blockName,
  //         value: blocks.blockId,
  //       })
  //     ) || []
  //     : selectedPVillageCity === "City"
  //       ? ULBblockDataP?.data?.result?.ulbs?.map(
  //         (ulbs: { ulbId: number; ulbName: string }) => ({
  //           label: ulbs.ulbName,
  //           value: ulbs.ulbId,
  //         })
  //       ) || []
  //       : [];

  // const { data: bankData } = useQuery({
  //   queryKey: ["masterData", "bank"],
  //   queryFn: () => getMasterData("bank"),
  // });
  // const bankOptions =
  //   bankData?.data?.result?.bank?.map(
  //     (banks: { pkBankId: number; vcBankName: string }) => ({
  //       label: banks.vcBankName,
  //       value: banks.pkBankId,
  //     })
  //   ) || [];

  // const { data: branchData } = useQuery({
  //   queryKey: ["masterData", "fklBankId", fklBankId],
  //   queryFn: () => getBranchByBank(fklBankId, "branch"),
  // });
  // const branchOptions =
  //   branchData?.data?.result?.branch?.map(
  //     (branch: { pklBranchId: number; vsbranchName: string }) => ({
  //       label: branch.vsbranchName,
  //       value: branch.pklBranchId,
  //     })
  //   ) || [];

  // const { data: ifscData } = useQuery({
  //   queryKey: ["masterData", "pklBranchId", pklBranchId],
  //   queryFn: () => getIfscByBranch(pklBranchId, "ifsc_code"),
  // });

  // useEffect(() => {
  //   if (
  //     ifscData &&
  //     ifscData.data?.result &&
  //     ifscData.data?.result?.ifsc_code &&
  //     ifscData.data?.result?.ifsc_code[0]
  //   ) {
  //     setValue("vsBankIFSC", ifscData.data?.result?.ifsc_code[0].vsIFSCCode);
  //   }
  // }, [ifscData, setValue]);

  // const isIFSCCodeAvailable = !!(
  //   ifscData &&
  //   ifscData.data?.result &&
  //   ifscData.data?.result?.ifsc_code &&
  //   ifscData.data?.result?.ifsc_code[0]
  // );

  // const { data: constiAssemblyData } = useQuery({
  //   queryKey: ["masterData", "constituency"],
  //   queryFn: () => getMasterData("constituency"),
  // });

  const selectedIdType = watch("fklIdType");

  const mutation = useMutation({
    mutationFn: submitCandidateForm,
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

  const onSubmit = (data: candidateFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 py-4"
      >
        {/* Basic Details */}
        <div className="col-span-1">
          <Label text="Candidate ID" required />
          <Controller
            name="candidateId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.candidateId ? "border-red-500" : ""}
              />
            )}
          />
          {errors.candidateId && (
            <p className="text-red-500">{errors.candidateId.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Batch ID"  />
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

                  setValue("fklCategoryId", selectedOption.value);
                }}
                className={errors.fklCategoryId ? "border-red-500" : ""}
                placeholder="-- Select Batch--"
              />
            
            )}
          />
          {errors.batchId && (
            <p className="text-red-500">{errors.batchId.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Name" required />
          <Controller
            name="vsCandidateName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsCandidateName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsCandidateName && (
            <p className="text-red-500">{errors.vsCandidateName.message}</p>
          )}
        </div>

        <div>
          <Label text="Date Of Birth" required />
          <Controller
            control={control}
            name="vsDOB"
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
                max={format(new Date(), "yyyy-MM-dd")}
              />
            )}
          />
          {errors.vsDOB && <p className="text-red-500">{errors.vsDOB.message}</p>}
        </div>
        <div className="col-span-1">
          <Label text="Age" required />
          <Controller
            name="iAge"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                disabled={!!field.value}
                className={errors.iAge ? "border-red-500" : ""}
              />
            )}
          />
          {errors.iAge && <p className="text-red-500">{errors.iAge.message}</p>}
        </div>

        <div className="col-span-1">
          <Label text="Father's Name" />
          <Controller
            name="vsFatherName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsFatherName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsFatherName && (
            <p className="text-red-500">{errors.vsFatherName.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Gender" required />
          <Controller
            name="vsGender"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={genderOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);

                  setValue("vsGender", selectedOption.value);
                }}
                className={errors.vsGender ? "border-red-500" : ""}
                placeholder="-- Select Gender --"
              />
            )}
          />
          {errors.vsGender && (
            <p className="text-red-500">{errors.vsGender.message}</p>
          )}
        </div>
        <div>
          <Label text="Aadhar?" required />
          <Controller
            name="fklIdType"
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
          {errors.fklIdType && (
            <p className="text-red-500">{errors.fklIdType.message}</p>
          )}
        </div>

        {selectedIdType === 1 && (
          <div className="col-span-2">
            <Label text="Aadhar Number (Insert last 4 digits of Aadhar)" required />
            <Controller
              name="vsUUID"
              control={control}
              rules={{
                required: "Aadhar Number is required.",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Aadhar Number must be exactly 4 digits.",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className={`border ${errors.vsUUID ? "border-red-500" : ""}`}
                  maxLength={4}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 4) field.onChange(value);
                  }}
                />
              )}
            />
            {errors.vsUUID && <p className="text-red-500">{errors.vsUUID.message}</p>}
          </div>
        )}


        <div className="col-span-1">
          <Label text="Religion" required />
          <Controller
            name="fklReligionId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={religionOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);

                  setValue("fklReligionId", selectedOption.value);
                }}
                className={errors.fklReligionId ? "border-red-500" : ""}
                placeholder="-- Select Religion --"
              />
            )}
          />
          {errors.fklReligionId && (
            <p className="text-red-500">{errors.fklReligionId.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Category" required />
          <Controller
            name="fklCategoryId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={categoryOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);

                  setValue("fklCategoryId", selectedOption.value);
                }}
                className={errors.fklCategoryId ? "border-red-500" : ""}
                placeholder="-- Select Category--"
              />
            )}
          />
          {errors.fklCategoryId && (
            <p className="text-red-500">{errors.fklCategoryId.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Mobile Number" required />
          <Controller
            name="vsMobile"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="tel"
                maxLength={10}
                className={errors.vsMobile ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsMobile && (
            <p className="text-red-500">{errors.vsMobile.message}</p>
          )}
        </div>
        <div className="col-span-1">
          <Label text="Email ID" />
          <Controller
            name="vsEmail"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsEmail ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsEmail && (
            <p className="text-red-500">{errors.vsEmail.message}</p>
          )}
        </div>
        <div className="col-span-2">
          <Label text="Education Attained" required />
          <Controller
            name="vsEducationAttained"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={qualificationData?.data?.result?.qualification}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setValue("vsEducationAttained", selectedOption.value);
                }}
                className={errors.fklCategoryId ? "border-red-500" : ""}
                placeholder="-- Select Qualification--"
              />
            )}
          />
          {errors.vsEducationAttained && (
            <p className="text-red-500">{errors.vsEducationAttained.message}</p>
          )}
        </div>

        <div className="md:col-span-3 lg:col-span-5  mt-4"></div>
      
        <div className="col-span-1">
          <Label text="Disability" />
          <Controller
            name="bDisability"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mr-4">
                  <input
                    type="radio"
                    value="1"
                    checked={field.value === 1}
                    onChange={() => field.onChange(1)}
                  />
                  Yes
                </label>
                <label>
                  <input
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
          {errors.bDisability && (
            <p className="text-red-500">{errors.bDisability.message}</p>
          )}
        </div>

        <div>
          <Label text="Tea Tribe" />
          <Controller
            name="bTeaTribe"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mr-4">
                  <input
                    type="radio"
                    value="1"
                    checked={field.value === 1}
                    onChange={() => field.onChange(1)}
                  />
                  Yes
                </label>
                <label>
                  <input
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
          {errors.bTeaTribe && (
            <p className="text-red-500">{errors.bTeaTribe.message}</p>
          )}
        </div>

      
        <div>
          <Label text="BPL Card Holder" />
          <Controller
            name="bBPLcardHolder"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mr-4">
                  <input
                    type="radio"
                    value="1"
                    checked={field.value === 1}
                    onChange={() => field.onChange(1)}
                  />
                  Yes
                </label>
                <label>
                  <input
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
          {errors.bBPLcardHolder && (
            <p className="text-red-500">{errors.bBPLcardHolder.message}</p>
          )}
        </div>

    
        <div>
          <Label text="Minority" />
          <Controller
            name="bMinority"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mr-4">
                  <input
                    type="radio"
                    value="1"
                    checked={field.value === 1}
                    onChange={() => field.onChange(1)}
                  />
                  Yes
                </label>
                <label>
                  <input
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
          {errors.bMinority && (
            <p className="text-red-500">{errors.bMinority.message}</p>
          )}
        </div>
  {/* 
        <div className="md:col-span-3 lg:col-span-5  mt-4"></div>
        <div className="col-span-full text-gray-900 font-semibold">
          Present Address
        </div>

        <div>
          <Label text="Address" />
          <Controller
            name="vsRAddress"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsRAddress ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsRAddress && (
            <p className="text-red-500">{errors.vsRAddress.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="State" />
          <Controller
            name="vsRState"
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
                  setValue("vsRState", selectedOption.value); 
                }}
                className={errors.vsRState ? "border-red-500" : ""}
                placeholder="-- Select State --"
              />
            )}
          />
          {errors.vsRState && (
            <p className="text-red-500">{errors.vsRState.message}</p>
          )}
        </div>
        <div className="col-span-1">
          <Label text="District" />
          <Controller
            name="vsRDistrict"
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
                  setValue("vsRDistrict", selectedValue.value);
                }}
                placeholder="-- Select District --"
                className={errors.vsRDistrict ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsRDistrict && (
            <p className="text-red-500">{errors.vsRDistrict.message}</p>
          )}
        </div>

      
        <div className="col-span-1">
          <Label text="Village/City" />
          <Controller
            name="isRCityVillage"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <select
                {...field}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.isRCityVillage ? "border-red-500" : ""
                  }`}
              >
                <option value="" disabled>
                  -- Select Village/City --
                </option>
                {isRCityVillage.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.isRCityVillage && (
            <p className="text-red-500">{errors.isRCityVillage.message}</p>
          )}
        </div>

        {selectedRVillageCity === "Village" && (
          <>
            <div className="col-span-1">
              <Label text="Block" />
              <Controller
                name="vsRBlock"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={ULBblockOptions} 
                    getOptionLabel={(option) => option.label} 
                    getOptionValue={(option) => option.value} 
                    onSelect={(selectedOption) => {
                      field.onChange(selectedOption.value);
                      setValue("vsRBlock", selectedOption.value); 
                    }}
                    className={errors.vsRBlock ? "border-red-500" : ""}
                    placeholder="-- Select Block --"
                  />
                )}
              />
              {errors.vsRBlock && (
                <p className="text-red-500">{errors.vsRBlock.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label text=" Village" />
              <Controller
                name="vsRVillageCity"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={errors.vsRVillageCity ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsRVillageCity && (
                <p className="text-red-500">{errors.vsRVillageCity.message}</p>
              )}
            </div>
          </>
        )}

        {selectedRVillageCity === "City" && (
          <>
            <div className="col-span-1">
              <Label text="ULB" />
              <Controller
                name="vsRUlb"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={ULBblockOptions} 
                    getOptionLabel={(option) => option.label} 
                    getOptionValue={(option) => option.value} 
                    onSelect={(selectedOption) => {
                      field.onChange(selectedOption.value);
                      setValue("vsRUlb", selectedOption.value); 
                    }}
                    className={errors.vsRUlb ? "border-red-500" : ""}
                    placeholder="-- Select ULB --"
                  />
                )}
              />
              {errors.vsRUlb && (
                <p className="text-red-500">{errors.vsRUlb.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label text="City" />
              <Controller
                name="vsRVillageCity"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={errors.vsRVillageCity ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsRVillageCity && (
                <p className="text-red-500">{errors.vsRVillageCity.message}</p>
              )}
            </div>
          </>
        )}

      
        <div>
          <Label text="Post Office" />
          <Controller
            name="vsRPostOffice"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsRPostOffice ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsRPostOffice && (
            <p className="text-red-500">{errors.vsRPostOffice.message}</p>
          )}
        </div>

     
        <div>
          <Label text="Police Station" />
          <Controller
            name="vsRPolice"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsRPolice ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsRPolice && (
            <p className="text-red-500">{errors.vsRPolice.message}</p>
          )}
        </div>

           <div>
          <Label text="PIN" />
          <Controller
            name="vsRPIN"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsRPIN ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsRPIN && (
            <p className="text-red-500">{errors.vsRPIN.message}</p>
          )}
        </div>

    
        <div className="col-span-1">
          <Label text="Assembly Constituency" />
          <Controller
            name="vsRCouncilContituency"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={
                  constiAssemblyData?.data?.result?.assemblyConstituency?.map(
                    (assembly: {
                      ConstituencyName: string;
                      AssemblyConstituencyId: number;
                    }) => ({
                      label: assembly.ConstituencyName, 
                      value: assembly.AssemblyConstituencyId, 
                    })
                  ) || [] 
                }
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value); 
                  setValue("vsRCouncilContituency", selectedOption.value);
                }}
                className={errors.vsRCouncilContituency ? "border-red-500" : ""}
                placeholder="-- Select Assembly Constituency --"
              />
            )}
          />
          {errors.vsRCouncilContituency && (
            <p className="text-red-500">
              {errors.vsRCouncilContituency.message}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Lok Sabha Constituency" />
          <Controller
            name="vsRAssemblyContituency"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={
                  constiAssemblyData?.data?.result?.loksabhaConstituency?.map(
                    (loksabha: {
                      ConstituencyName: string;
                      LoksabhaConstituencyId: number;
                    }) => ({
                      label: loksabha.ConstituencyName, 
                      value: loksabha.LoksabhaConstituencyId, 
                    })
                  ) || [] 
                }
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value); 
                  setValue("vsRAssemblyContituency", selectedOption.value); 
                }}
                className={
                  errors.vsRAssemblyContituency ? "border-red-500" : ""
                }
                placeholder="-- Select Lok Sabha Constituency --"
              />
            )}
          />
          {errors.vsRAssemblyContituency && (
            <p className="text-red-500">
              {errors.vsRAssemblyContituency.message}
            </p>
          )}
        </div>

    
        <div>
          <Label text="Is present address same as Permanent  address" />
          <Controller
            name="iSameAddress"
            control={control}
            render={({ field }) => (
              <div>
                <label className="mr-4">
                  <input
                    type="radio"
                    value="1"
                    checked={field.value === 1}
                    onChange={() => {
                      field.onChange(1);
                      setIsSameAddress(true); 
                    }}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="0"
                    checked={field.value === 0}
                    onChange={() => {
                      field.onChange(0);
                      setIsSameAddress(false); 
                    }}
                  />
                  No
                </label>
              </div>
            )}
          />
          {errors.iSameAddress && (
            <p className="text-red-500">{errors.iSameAddress.message}</p>
          )}
        </div>

        <div className="md:col-span-3 lg:col-span-5  mt-4"></div>

        {!isSameAddress && (
          <>
            <div className="col-span-full text-gray-900 font-semibold">
              Permanent Address
            </div>
            <div className="col-span-1">
              <Label text="Address" />
              <Controller
                name="vsPAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={errors.vsPAddress ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsPAddress && (
                <p className="text-red-500">{errors.vsPAddress.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <Label text="State" />
              <Controller
                name="vsPState"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={stateOptions} 
                    getOptionLabel={(option) => option.label} 
                    getOptionValue={(option) => option.value}
                    onSelect={(selectedOption) => {
                      field.onChange(selectedOption.value); 
                      setStateIdP(selectedOption.value); 
                      setValue("vsPState", selectedOption.value); 
                    }}
                    className={errors.vsPState ? "border-red-500" : ""}
                    placeholder="-- Select State --"
                  />
                )}
              />
              {errors.vsPState && (
                <p className="text-red-500">{errors.vsPState.message}</p>
              )}
            </div>
            <div className="col-span-1">
              <Label text="District" />
              <Controller
                name="vsPDistrict"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={districtOptionsP}
                    getOptionLabel={(option: { label: string }) => option.label}
                    getOptionValue={(option: { value: number }) => option.value}
                    onSelect={(selectedValue: {
                      label: string;
                      value: number;
                    }) => {
                      field.onChange(selectedValue.value);
                      setDistrictIdP(selectedValue.value);
                      setValue("vsPDistrict", selectedValue.value);
                    }}
                    placeholder="-- Select District --"
                    className={errors.vsPDistrict ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsPDistrict && (
                <p className="text-red-500">{errors.vsPDistrict.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <Label text="Village/City" />
              <Controller
                name="vsPVillageCity"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.vsPVillageCity ? "border-red-500" : ""
                      }`}
                  >
                    <option value="" disabled>
                      -- Select Village/City --
                    </option>
                    {vsPVillageCity.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.vsPVillageCity && (
                <p className="text-red-500">{errors.vsPVillageCity.message}</p>
              )}
            </div>

            {selectedPVillageCity === "Village" && (
              <>
                <div className="col-span-1">
                  <Label text="Block" />
                  <Controller
                    name="vsPBlock"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={ULBblockOptionsP} 
                        getOptionLabel={(option) => option.label} 
                        getOptionValue={(option) => option.value} 
                        onSelect={(selectedOption) => {
                          field.onChange(selectedOption.value); 
                          setValue("vsPBlock", selectedOption.value); 
                        }}
                        className={errors.vsPBlock ? "border-red-500" : ""}
                        placeholder="-- Select Block --"
                      />
                    )}
                  />
                  {errors.vsPBlock && (
                    <p className="text-red-500">{errors.vsPBlock.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label text="Village" />
                  <Controller
                    name="vsPVillageCity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className={
                          errors.vsPVillageCity ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.vsPVillageCity && (
                    <p className="text-red-500">
                      {errors.vsPVillageCity.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {selectedPVillageCity === "City" && (
              <>
                <div className="col-span-1">
                  <Label text="ULB" />
                  <Controller
                    name="vsPUlb"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={ULBblockOptionsP} 
                        getOptionLabel={(option) => option.label} 
                        getOptionValue={(option) => option.value} 
                        onSelect={(selectedOption) => {
                          field.onChange(selectedOption.value); 
                          setValue("vsPUlb", selectedOption.value); 
                        }}
                        className={errors.vsPUlb ? "border-red-500" : ""}
                        placeholder="-- Select ULB --"
                      />
                    )}
                  />
                  {errors.vsPUlb && (
                    <p className="text-red-500">{errors.vsPUlb.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label text="City" />
                  <Controller
                    name="vsPVillageCity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        className={
                          errors.vsPVillageCity ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.vsPVillageCity && (
                    <p className="text-red-500">
                      {errors.vsPVillageCity.message}
                    </p>
                  )}
                </div>
              </>
            )}

           
            <div>
              <Label text="Post Office" />
              <Controller
                name="vsPPostOffice"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={errors.vsPPostOffice ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsPPostOffice && (
                <p className="text-red-500">{errors.vsPPostOffice.message}</p>
              )}
            </div>

          
            <div>
              <Label text="Police Station" />
              <Controller
                name="vsPPolice"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={errors.vsPPolice ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsPPolice && (
                <p className="text-red-500">{errors.vsPPolice.message}</p>
              )}
            </div>

         
            <div>
              <Label text="PIN" />
              <Controller
                name="vsPPIN"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={errors.vsPPIN ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.vsPPIN && (
                <p className="text-red-500">{errors.vsPPIN.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <Label text="Assembly Constituency" />
              <Controller
                name="vsPAssemblyContituency"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={
                      constiAssemblyData?.data?.result?.assemblyConstituency?.map(
                        (assembly: {
                          ConstituencyName: string;
                          AssemblyConstituencyId: number;
                        }) => ({
                          label: assembly.ConstituencyName, 
                          value: assembly.AssemblyConstituencyId, 
                        })
                      ) || [] 
                    }
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    onSelect={(selectedOption) => {
                      field.onChange(selectedOption.value);
                      setValue("vsPAssemblyContituency", selectedOption.value); 
                    }}
                    className={
                      errors.vsPAssemblyContituency ? "border-red-500" : ""
                    }
                    placeholder="-- Select Assembly Constituency --"
                  />
                )}
              />
              {errors.vsPAssemblyContituency && (
                <p className="text-red-500">
                  {errors.vsPAssemblyContituency.message}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <Label text="Lok Sabha Constituency" />
              <Controller
                name="vsPCouncilContituency"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={
                      constiAssemblyData?.data?.result?.loksabhaConstituency?.map(
                        (loksabha: {
                          ConstituencyName: string;
                          LoksabhaConstituencyId: number;
                        }) => ({
                          label: loksabha.ConstituencyName, 
                          value: loksabha.LoksabhaConstituencyId, 
                        })
                      ) || [] 
                    }
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    onSelect={(selectedOption) => {
                      field.onChange(selectedOption.value);
                      setValue("vsPCouncilContituency", selectedOption.value); 
                    }}
                    className={
                      errors.vsPCouncilContituency ? "border-red-500" : ""
                    }
                    placeholder="-- Select Lok Sabha Constituency --"
                  />
                )}
              />
              {errors.vsPCouncilContituency && (
                <p className="text-red-500">
                  {errors.vsPCouncilContituency.message}
                </p>
              )}
            </div>
          </>
        )}

        <div className="md:col-span-3 lg:col-span-5  mt-4"></div>
        <div className="col-span-full text-gray-900 font-semibold">
          Bank Details
        </div>
        <div>
          <Label text="Bank Holder Name" />
          <Controller
            name="vsBankHolderName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsBankHolderName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsBankHolderName && (
            <p className="text-red-500">{errors.vsBankHolderName.message}</p>
          )}
        </div>

      
        <div>
          <Label text="Account Number" />
          <Controller
            name="vsAccountNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsAccountNumber ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsAccountNumber && (
            <p className="text-red-500">{errors.vsAccountNumber.message}</p>
          )}
        </div>

   
        <div className="col-span-1">
          <Label text="Bank Name" />
          <Controller
            name="vsBankName"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={bankOptions}
                getOptionLabel={(option: { label: string }) => option.label}
                getOptionValue={(option: { value: number }) => option.value}
                onSelect={(selectedValue: { label: string; value: number }) => {
                  field.onChange(selectedValue.value);
                  setBank(selectedValue.value);
                  setValue("vsBankName", selectedValue.value);
                }}
                placeholder="-- Select Bank --"
                className={errors.vsBankName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsBankName && (
            <p className="text-red-500">{errors.vsBankName.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Branch Name" />
          <Controller
            name="vsBranchName"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={branchOptions}
                getOptionLabel={(option: { label: string }) => option.label}
                getOptionValue={(option: { value: number }) => option.value}
                onSelect={(selectedValue: { label: string; value: number }) => {
                  field.onChange(selectedValue.value);
                  setBranch(selectedValue.value);
                  setValue("vsBranchName", selectedValue.value);
                }}
                placeholder="-- Select Branch --"
                className={errors.vsBranchName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsBranchName && (
            <p className="text-red-500">{errors.vsBranchName.message}</p>
          )}
        </div>

      
        <div>
          <Label text="Bank IFSC" />
          <Controller
            name="vsBankIFSC"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsBankIFSC ? "border-red-500" : ""}
                disabled={isIFSCCodeAvailable}
              />
            )}
          />
          {errors.vsBankIFSC && (
            <p className="text-red-500">{errors.vsBankIFSC.message}</p>
          )}
        </div> */}



        {/* Submit Button */}
        <div className="col-span-2 md:col-span-2 lg:col-span-5 flex justify-end bg-gray-100 p-4 rounded-xl">
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

export default CandidateModal;
