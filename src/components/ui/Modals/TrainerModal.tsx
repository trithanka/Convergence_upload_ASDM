// src/components/modals/TrainerModalContent.tsx

import React, { useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-toastify";
import Input from "../Input";
import Label from "../Label";
import Button from "../SubmitButton";
import { TrainerFormData } from "../../../utils/formTypes";
import { trainerSchema } from "../../../utils/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitTrainerForm } from "../../../services/state/api/FormApi";
import useModalStore from "../../../services/state/useModelStore";
import { getMasterData } from "../../../services/state/api/masterApi";
import Dropdown from "../Dropdown";

const TrainerModalContent: React.FC = () => {
  const { closeModal } = useModalStore();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TrainerFormData>({
    resolver: joiResolver(trainerSchema),
  });

  const queryClient = useQueryClient();

  const { data: masterData } = useQuery({
    queryKey: ["masterData", "AllDeptTc"], 
    queryFn: () => getMasterData("AllDeptTc"), 
  });
  
   useEffect(() => {
     if (masterData) {
      console.log("Fetched master data:", masterData);
     }
   }, [masterData]);

   const tcOptions =
  masterData?.data?.result?.tc?.map(
    (tp: { pklTcId: number; vsTcName: string }) => ({
      label: tp.vsTcName,
      value: tp.pklTcId,
    })
  ) || [];

  const { data: courseData } = useQuery({
    queryKey: ["courseData", "courseRoleName"], 
    queryFn: () => getMasterData("courseRoleName"), 
  });
  
   useEffect(() => {
     if (courseData) {
      console.log("Fetched master data:", courseData);
     }
   }, [courseData]);

   const courseOptions =
   courseData?.data?.result?.courses?.map(
     (tp: { pklCourseId: number; vsCourseName: string }) => ({
       label: tp.vsCourseName,
       value: tp.pklCourseId,
     })
   ) || [];

  const mutation = useMutation({
    mutationFn: submitTrainerForm,
    onSuccess: (data) => {
      if (data?.success) {
        closeModal();
        toast.success(data.message || "Trainer submitted successfully!");
        queryClient.invalidateQueries({ queryKey: ["trainerData"] });
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

  const onSubmit: SubmitHandler<TrainerFormData> = (data: TrainerFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >
        {/* Trainer ID */}
        {/* <div className="col-span-1">
            <Label text="Trainer ID" />
            <Controller
              name="trainerId"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className={errors.trainerId ? "border-red-500" : ""}
                />
              )}
            />
            {errors.trainerId && (
              <p className="text-red-500">{errors.trainerId.message}</p>
            )}
          </div> */}

<div className="col-span-1">
          <Label text="Training Center"required />
          <Controller
            name="fklTcId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={tcOptions} 
                getOptionLabel={(option) => option.label} 
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value); 
              
                  setValue("fklTcId", selectedOption.value); 
                }}
                className={errors.vsTcName ? "border-red-500" : ""}
                placeholder="-- Select Training Center --"
              />
            )}
          />
          {errors.fklTcId && (
            <p className="text-red-500">{errors.fklTcId.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Course"required />
          <Controller
            name="fklCourseId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={courseOptions} 
                getOptionLabel={(option) => option.label} 
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value); 
              
                  setValue("fklCourseId", selectedOption.value); 
                }}
                className={errors.fklCourseId ? "border-red-500" : ""}
                placeholder="-- Select Course --"
              />
            )}
          />
          {errors.fklCourseId && (
            <p className="text-red-500">{errors.fklCourseId.message}</p>
          )}
        </div>

        {/* Trainer Name */}
        <div className="col-span-1">
          <Label text="Trainer Name" required />
          <Controller
            name="vsTrainerName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsTrainerName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsTrainerName && (
            <p className="text-red-500">{errors.vsTrainerName.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div className="col-span-1">
          <Label text="Mobile" required/>
          <Controller
            name="vsMobile"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsMobile ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsMobile && (
            <p className="text-red-500">{errors.vsMobile.message}</p>
          )}
        </div>

        {/* Trainer Email */}
        <div className="col-span-1">
          <Label text="Trainer Email" />
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

        {/* ID Card (PAN/Voter) */}
        <div className="col-span-1">
          <Label text="PAN Card" required/>
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

export default TrainerModalContent;
