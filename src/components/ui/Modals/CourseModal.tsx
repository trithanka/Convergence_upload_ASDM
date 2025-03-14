import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { courseSchema } from "../../../utils/validation";
import Button from "../../ui/SubmitButton";
import Label from "../Label";
import Input from "../Input";
import { CourseFormData } from "../../../utils/formTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitCourseForm } from "../../../services/state/api/FormApi";
import { toast } from "react-toastify";
import Dropdown from "../Dropdown";
import { getMasterData } from "../../../services/state/api/masterApi";
import useModalStore from "../../../services/state/useModelStore";
import { isBefore, parseISO } from "date-fns";
const CourseModal: React.FC = () => {

  const {closeModal} = useModalStore()
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CourseFormData>({
    resolver: joiResolver(courseSchema),
  });

  const queryClient = useQueryClient();

   const dtFromDate = watch("dtFromDate"); // Watching changes of dtStartDate
  
    const [minEndDate, setMinEndDate] = useState(""); // State to store min date for dtEndDate
  
    // Watch for changes in dtStartDate and dynamically set the min date for dtEndDate
    useEffect(() => {
      if (dtFromDate) {
        setMinEndDate(dtFromDate); // Update the min date for Batch End Date based on Batch Start Date
      }
    }, [dtFromDate]);
  

  const { data: masterData } = useQuery({
    queryKey: ["masterData", "sector"],
    queryFn: () => getMasterData("sector"),
  });

  useEffect(() => {
    if (masterData) {
      console.log("Fetched master data:", masterData);
    }
  }, [masterData]);

  useEffect(() => {
    const selectedDate = watch("dtFromDate");
    if (!selectedDate) {
      const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
      setValue("dtFromDate", today);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("dtFromDate"), setValue]);

  const mutation = useMutation({
    mutationFn: submitCourseForm,
    onSuccess: (data) => {
      closeModal();
      toast.success("Course submitted successfully!");
      console.log("Course submitted successfully", data);
      queryClient.invalidateQueries({ queryKey: ["courseData"] });
    },
    onError: (error) => {
      toast.error("Error while submmiting courses");
      console.error("Error while submitting the form", error);
    },
  });

  const onSubmit: SubmitHandler<CourseFormData> = (data: CourseFormData) => {
    mutation.mutate(data);
  };

  const sectorOptions =
    masterData?.data?.result?.sectors?.map(
      (sector: { sectorID: number; sectorName: string }) => ({
        label: sector.sectorName,
        value: sector.sectorID,
      })
    ) || [];

 

  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >
        {/* Sector Name */}
        <div className="col-span-1">
          <Label text="Sector Name" required/>
          <Controller
            name="fklSectorId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={sectorOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value);
                  setValue("fklSectorId", selectedOption.value.toString());
                }}
                className={errors.fklSectorId ? "border-red-500" : ""}
                placeholder="-- Select Sector --"
              />
            )}
          />
          {errors.fklSectorId && (
            <p className="text-red-500">{errors.fklSectorId.message}</p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <Label text="Job Role Name" required/>
          <Controller
            name="vsCourseName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsCourseName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsCourseName && (
            <p className="text-red-500">{errors.vsCourseName.message}</p>
          )}
        </div>
        {/* QPNOS Code */}
        <div className="col-span-1 sm:col-span-1">
          <Label text="QPNOS Code"required />
          <Controller
            name="vsCourseCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className={errors.vsCourseCode ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsCourseCode && (
            <p className="text-red-500">{errors.vsCourseCode.message}</p>
          )}
        </div>

        {/* Total Theory and Practical Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
          <div>
            <Label text="Total Theory Hours" required/>
            <Controller
              name="iTheoryDurationInHours"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className={
                    errors.iTheoryDurationInHours ? "border-red-500" : ""
                  }
                />
              )}
            />
            {errors.iTheoryDurationInHours && (
              <p className="text-red-500">
                {errors.iTheoryDurationInHours.message}
              </p>
            )}
          </div>
          <div>
            <Label text="Total Practical Hours"required />
            <Controller
              name="iPracticalDurationInHours"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className={
                    errors.iPracticalDurationInHours ? "border-red-500" : ""
                  }
                />
              )}
            />
            {errors.iPracticalDurationInHours && (
              <p className="text-red-500">
                {errors.iPracticalDurationInHours.message}
              </p>
            )}
          </div>
        </div>

        {/* Date Valid From and Date Valid Upto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
        <div>
        <Label text="Date Valid From" />
        <Controller
          name="dtFromDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              className={errors.dtFromDate ? "border-red-500" : ""}
              value={dtFromDate}
              onChange={(e) => {
                field.onChange(e);
              
              }}
            />
          )}
        />
        {errors.dtFromDate && (
          <p className="text-red-500">{errors.dtFromDate.message}</p>
        )}
      </div>
          <div className="col-span-1">
        <Label text="Batch End Date" required />
        <Controller
          name="dtToDate"
          control={control}
          rules={{
            validate: (value) => {
              if (!dtFromDate) return "Select 'Batch Start Date' first";
              if (isBefore(parseISO(value), parseISO(dtFromDate))) {
                return "Batch End Date must be after Batch Start Date";
              }
              return true;
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              value={field.value || ""}
              min={minEndDate || ""} // Set min to Batch Start Date
              disabled={!dtFromDate} // Disable Batch End Date if no Batch Start Date is selected
              className={errors.dtFromDate ? "border-red-500" : ""}
            />
          )}
        />
        {errors.dtToDate && (
          <p className="text-red-500">{errors.dtToDate.message}</p>
        )}
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

export default CourseModal;
