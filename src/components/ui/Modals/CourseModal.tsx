import React, { useEffect, useState, useMemo } from "react";
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
// import { isBefore, parseISO } from "date-fns";
const CourseModal: React.FC = () => {

  const { closeModal } = useModalStore()
  const {
    handleSubmit,
    control,
    watch,

    formState: { errors },
    setValue,
  } = useForm<CourseFormData>({
    resolver: joiResolver(courseSchema),

  });
  console.log("errors", errors);

  const queryClient = useQueryClient();

  const dtFromDate = watch("dtFromDate"); // Watching changes of dtStartDate

  const [minEndDate, setMinEndDate] = useState(""); // State to store min date for dtEndDate

  const [courseCode, setCourseCode] = useState<string>("");

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

  // const {
  //   data 
  // } = useQuery({
  //   queryKey: ["qpnos", ""],
  //   queryFn: () => getMasterData("course"),
  // });

  const { data: qpnosData } = useQuery({
    queryKey: ["qpnosData", "qpnos"],
    queryFn: () => getMasterData("qpnosAll"),
  });
  // useEffect(() => {
  //   if (qpnosData) {
  //     console.log("Fetched course data:", qpnosData);
  //   }
  // }, [qpnosData]);

  // useEffect(() => {
  //   if (masterData) {
  //     console.log("Fetched master data:", masterData);
  //   }
  // }, [masterData]);

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
      toast.success("Job Role submitted successfully!");
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


  interface QPNOSData {
    vsCourseCode: string;
  }

  useEffect(() => {
    if (qpnosData) {
      console.log("Raw QPNOS data:", qpnosData?.data?.result);
    }
  }, [qpnosData]);

  const qpnosOptions = useMemo(() => {
    const data = qpnosData?.data?.result?.qpnosAll || [];
    return data.map((qpnos: QPNOSData) => ({
      label: qpnos.vsCourseCode,
      value: qpnos.vsCourseCode
    }))
  }, [qpnosData]);

  useEffect(() => {
    if (qpnosData) {
      console.log("QPNOS Options:", qpnosOptions);
    }
  }, [qpnosData]);

  const selectedIdType = watch("qpnos");

  const {
    data: qpnosDetails
  } = useQuery({
    queryKey: ["qpnos", "qpnos", courseCode],
    //@ts-ignore
    queryFn: () => getMasterData("getByQpnos", courseCode),
    enabled: !!courseCode,
  });

  useEffect(() => {
    if (selectedIdType !== 1 || !qpnosDetails?.data?.result?.getByQpnos?.[0]) return;

    const fetched = qpnosDetails.data.result.getByQpnos[0];

    if (fetched.pklSectorId) {
      setValue("fklSectorId", fetched.pklSectorId);
    }

    if (fetched.vsCourseName) {
      setValue("vsCourseName", fetched.vsCourseName);
    }

    if (fetched.dtFromDate) {
      setValue("dtFromDate", formatDateForInput(fetched.dtFromDate));
    }

    if (fetched.dtToDate) {
      setValue("dtToDate", formatDateForInput(fetched.dtToDate));
    }

  }, [selectedIdType, qpnosDetails, setValue]);


  const formatDateForInput = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';

    try {
      // Handle YY-MM-DD format
      const [year, month, day] = dateStr.split('-');

      // Convert 2-digit year to 4-digit year
      const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;

      // Create the YYYY-MM-DD format
      const formattedDate = `${fullYear}-${month}-${day}`;

      // Validate the date
      const date = new Date(formattedDate);
      if (isNaN(date.getTime())) {
        return '';
      }

      return formattedDate;
    } catch (error) {
      console.error('Date parsing error:', error);
      return '';
    }
  };



  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >
        <div className="col-span-3">
          <Label text="Is QPNOS Available ?" required />
          <Controller
            name="qpnos"
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
          {/* {errors.fklIdType && (
            <p className="text-red-500">{errors.fklIdType.message}</p>
          )} */}
        </div>

        {selectedIdType === 1 && (
          <div className="col-span-1 sm:col-span-1">
            <Label text="QPNOS Code" required />
            <Controller
              name="vsCourseCode"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={qpnosOptions}
                  getOptionLabel={(option) => option?.label || ''}
                  getOptionValue={(option) => option?.value || ''}
                  onSelect={(selectedOption) => {
                    console.log("Selected option:", selectedOption);
                    const newValue = selectedOption.value.toString();
                    field.onChange(newValue);
                    setValue("vsCourseCode", newValue);
                    setCourseCode(newValue);

                    console.log("Updated courseCode to:", newValue);
                  }}
                  className={errors.vsCourseCode ? "border-red-500" : ""}
                  placeholder="-- Select QPNOS --"
                />
              )}
            />
            {errors.vsCourseCode && (
              <p className="text-red-500">{errors.vsCourseCode.message}</p>
            )}
          </div>
        )}


        {
          selectedIdType === 1 ? (
            <div className="col-span-1 sm:col-span-1">
              <Label text="Sector Name" required />
              <Controller
                name="fklSectorId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    disabled
                    value={qpnosDetails?.data?.result?.getByQpnos[0]?.vsSectorName}
                    className={errors.fklSectorId ? "border-red-500" : ""}
                  />
                )}
              />
            </div>
          ) : <div className="col-span-1">
            <Label text="Sector Name" required />
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

        }

        {/* <div className="col-span-1">
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
      </div> */}




        {/* Sector Name */}
        {/* {<div className="col-span-1">
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
        </div>} */}

        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <Label text="Job Role Name" required />
          <Controller
            name="vsCourseName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                disabled={selectedIdType === 1}
                value={qpnosDetails?.data?.result?.getByQpnos[0]?.vsCourseName}
                className={errors.vsCourseName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.vsCourseName && (
            <p className="text-red-500">{errors.vsCourseName.message}</p>
          )}
        </div>


        {/* Total Theory and Practical Hours */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
          <div>
            <Label text="Total Theory Hours" />
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
            <Label text="Total Practical Hours" />
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
        </div> */}

        {/* Date Valid From and Date Valid Upto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
          <div>
            <Label text=" start date" required
            />
            <Controller
              name="dtFromDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  className={errors.dtFromDate ? "border-red-500" : ""}

                  value={selectedIdType === 1 && formatDateForInput(qpnosDetails?.data?.result?.getByQpnos[0]?.dtFromDate) || field.value}

                  disabled={selectedIdType === 1}
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
            <Label text=" End Date" required />
            <Controller
              name="dtToDate"
              control={control}
              // rules={{
              //   validate: (value) => {
              //     if (!dtFromDate) return "Select 'Batch Start Date' first";
              //     if (isBefore(parseISO(value), parseISO(dtFromDate))) {
              //       return "Batch End Date must be after Batch Start Date";
              //     }
              //     return true;
              //   },
              // }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  //@ts-ignore
                  value={selectedIdType === 1 && formatDateForInput(qpnosDetails?.data?.result?.getByQpnos[0]?.dtToDate) || field.value}
                  min={minEndDate || ""} // Set min to Batch Start Date
                  disabled={!dtFromDate || selectedIdType === 1} // Disable Batch End Date if no Batch Start Date is selected
                  className={errors.dtFromDate ? "border-red-500" : ""}
                />
              )}
            />
            {errors.dtToDate && (
              <p className="text-red-500">{errors.dtToDate.message}</p>
            )}
          </div>
        </div>


           <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-red-500 text-sm mb-2">* Required fields</p>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-semibold">QPNOS Availability:
 <span className="text-red-600" >*</span></span>   If QPNOS is available, select "Yes" and enter the NSDC-approved QPNOS.  <br/>
 If QPNOS is not available, select "No" and provide the Job Role Details.

              </p>
              <p className="text-sm"><span className="font-semibold">Sector Name: <span className="text-red-600" >*</span></span> 
    Select a valid Sector Name from the drop-down list.
              
              </p>
              <p className="text-sm"><span className="font-semibold">Job Role Details:  <span className="text-red-600" >*</span></span>      Enter the valid Job Role Name, Start Date, and End Date as approved by NSDC.
                
              </p>
              
                 
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

export default CourseModal;
