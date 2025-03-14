import React, { useEffect, useState } from "react";
import Label from "../Label";
import Input from "../Input";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { BatchFormData } from "../../../utils/formTypes";
import { batchSchema } from "../../../utils/validation";
import Button from "../../ui/SubmitButton";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMasterData, getTargetById, gettrainerByTc } from "../../../services/state/api/masterApi";
import Dropdown from "../Dropdown";
import { submitBatchForm } from "../../../services/state/api/FormApi";
import useModalStore from "../../../services/state/useModelStore";
import { isBefore, parseISO } from "date-fns";


const BatchModel: React.FC = () => {

  const { closeModal } = useModalStore()

  const [TcID, setTcId] = useState<number | null>(null);
  const [fklTargetId, setTargetId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<BatchFormData>({
    resolver: joiResolver(batchSchema),
  });

  const dtStartDate = watch("dtStartDate"); // Watching changes of dtStartDate

  const [minEndDate, setMinEndDate] = useState(""); // State to store min date for dtEndDate


  // Watch for changes in dtStartDate and dynamically set the min date for dtEndDate
  useEffect(() => {
    if (dtStartDate) {
      setMinEndDate(dtStartDate); // Update the min date for Batch End Date based on Batch Start Date
    }
  }, [dtStartDate]);


  const { data: courseData } = useQuery({
    queryKey: ["courseData", "AllCourseData"],
    queryFn: () => getMasterData("AllCourseData"),
  });


  const courseOptions =
    courseData?.data?.result?.course?.map(
      (tp: { pklCourseId: number; vsCourseName: string }) => ({
        label: tp.vsCourseName,
        value: tp.pklCourseId,
      })
    ) || [];

  // const fundingTypes = ["Option 1", "Option 2", "Option 3"];

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



  const { data: targetData } = useQuery({
    queryKey: ["targetData", "target"],
    queryFn: () => getMasterData("target"),
  });

  useEffect(() => {
    if (targetData) {
      console.log("Fetched master data:", masterData);
    }
  }, [targetData]);

  const targetOptions =
    targetData?.data?.result?.BATCH?.map(
      (tp: { id: number; name: string }) => ({
        label: tp.name,
        value: tp.id,
      })
    ) || [];


  //  const { data: tcData } = useQuery({
  //       queryKey: ["masterData", "tc", fklTpId],
  //       queryFn: () => getTcByTp(fklTpId, "tc"),
  //       enabled: !!fklTpId,
  //     });

  //      useEffect(() => {
  //         if (tcData) {
  //           console.log("Fetched master data:", tcData);
  //         }
  //       }, [tcData]);

  //       const tcOptions =
  //       tcData?.data?.result?.tc?.map(
  //         (tc: { pklTcId: number; vsTcName: string }) => ({
  //           label: tc.vsTcName,
  //           value: tc.pklTcId,
  //         })
  //       ) || [];

  const { data: trainerData } = useQuery({
    queryKey: ["masterData", "TcTrainner", TcID],
    queryFn: () => gettrainerByTc(TcID, "TcTrainner"),
  });

  useEffect(() => {
    if (trainerData) {
      console.log("Fetched master data:", trainerData);
    }
  }, [trainerData]);

  const trainerOptions =
    trainerData?.data?.result?.trainner?.map(
      (tp: { pklConvTrainerId: number; vsTrainerName: string }) => ({
        label: tp.vsTrainerName,
        value: tp.pklConvTrainerId,
      })
    ) || [];


  const { data: targetResponse } = useQuery({
    queryKey: ["targetResponseData", "targetById", fklTargetId],
    queryFn: () => getTargetById(fklTargetId, "targetById"),
    enabled: !!fklTargetId,
  });

  useEffect(() => {
    if (targetResponse) {
      console.log("Fetched master data:", targetResponse);
    }
  }, [targetResponse]);

  const availableTarget = targetResponse?.data?.result?.BATCH?.[0]?.availableTarget || 0;
  const totalTarget = targetResponse?.data?.result?.BATCH?.[0]?.totalTarget || 0;

  const [remainTarget, setRemainTarget] = useState(availableTarget);

  const handleBatchTargetChange = (value: string) => {
    const enteredValue = Number(value);
    setRemainTarget(availableTarget - enteredValue);
  };


  // const targetResponse =
  // targetResponse?.data?.result?.BATCH?.map(
  //   (tp: { pklConvTrainerId: number; vsTrainerName: string }) => ({
  //     label: tp.vsTrainerName,
  //     value: tp.pklConvTrainerId,
  //   })
  // ) || [];



  // const { data: sectorData } = useQuery({
  //   queryKey: ["masterData", "sector"], 
  //   queryFn: () => getMasterData("sector"), 
  // });

  //  useEffect(() => {
  //    if (sectorData) {
  //     console.log("Fetched master data:", sectorData);
  //    }
  //  }, [sectorData]);

  //  const sectorOptions =
  //  sectorData?.data?.result?.sectors?.map(
  //   (tp: { sectorID: number; sectorName: string }) => ({
  //     label: tp.sectorName,
  //     value: tp.sectorID,
  //   })
  // ) || [];




  const mutation = useMutation({
    mutationFn: submitBatchForm,
    onSuccess: (data) => {

      if (data?.success) {
        toast.success(data.message || "Batch submitted successfully!");
        closeModal();
        queryClient.invalidateQueries({ queryKey: ["batchData"] });
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

  const onSubmit = (data: BatchFormData) => {
    mutation.mutate(data);
  };



  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >
        <div className="col-span-1">
          <Label text="Training Center" required />
          <Controller
            name="fklTcId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={tcOptions} // Pass full objects with label and value
                getOptionLabel={(option) => option.label} // Display the `label`
                getOptionValue={(option) => option.value} // Use the `value` (stateID)
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value); // Update form with selected stateID
                  setTcId(selectedOption.value); // Update the stateID in local state
                  setValue("fklTcId", selectedOption.value); // Sync form value
                }}
                className={errors.fklTcId ? "border-red-500" : ""}
                placeholder="-- Select Training Center --"
              />
            )}
          />
          {errors.fklTcId && (
            <p className="text-red-500">{errors.fklTcId.message}</p>
          )}
        </div>
        <div className="col-span-1">
          <Label text="Trainer" required />
          <Controller
            name="fklTrainerId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={trainerOptions}
                getOptionLabel={(option: { label: string }) => option.label}
                getOptionValue={(option: { value: number }) => option.value}
                onSelect={(selectedValue: { label: string; value: number }) => {
                  field.onChange(selectedValue.value);

                  setValue("fklTrainerId", selectedValue.value);
                }}
                placeholder="-- Select Trainer --"
                className={errors.fklTrainerId ? "border-red-500" : ""}
              />
            )}
          />
          {errors.fklTrainerId && (
            <p className="text-red-500">{errors.fklTrainerId.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Courses" required />
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
                placeholder="-- Select Courses --"
              />
            )}
          />
          {errors.fklCourseId && (
            <p className="text-red-500">{errors.fklCourseId.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <Label text="Target Order Number" required />
          <Controller
            name="fklTargetId"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={targetOptions} // Pass full objects with label and value
                getOptionLabel={(option) => option.label} // Display the `label`
                getOptionValue={(option) => option.value} // Use the `value` (stateID)
                onSelect={(selectedOption) => {
                  field.onChange(selectedOption.value); // Update form with selected stateID
                  setTargetId(selectedOption.value); // Update the stateID in local state
                  setValue("fklTargetId", selectedOption.value); // Sync form value
                }}
                className={errors.fklTargetId ? "border-red-500" : ""}
                placeholder="-- Select Target --"
              />
            )}
          />
          {errors.fklTargetId && (
            <p className="text-red-500">{errors.fklTargetId.message}</p>
          )}

          <div className="mt-1 mb-2 flex gap-2 items-center justify-between">
            <p className="text-gray-500 text-xs">Target </p>
            <div className="">
              <p className="text-gray-500 font-semibold text-xs">
                {fklTargetId ? (
                  <span className="text-gray-500 font-medium">
                    {availableTarget} / {totalTarget}
                  </span>
                ) : (
                  <span className="text-gray-500 font-medium">0 / 0</span>
                )}

              </p>
            </div>
          </div>
        </div>

        <div>
          <Label text="Batch Size Enrolled" required />
          <Controller
  name="iBatchTarget"
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      type="number"
      className={errors.iBatchTarget ? "border-red-500" : ""}
      onChange={(e) => {
        field.onChange(e); // Update form state
        handleBatchTargetChange(e.target.value); // Update remaining target
      }}
    />
  )}
/>
          {errors.iBatchTarget && <p className="text-red-500">{errors.iBatchTarget.message}</p>}
          <div className="mt-1 mb-2 flex gap-2 items-center justify-between">
            <p className="text-gray-500 text-xs">Remaining </p>
            <div className="">
              <p className="text-gray-500 font-semibold text-xs">
                {fklTargetId ? (
                  <span className="text-gray-500 font-medium">
                    {remainTarget} / {availableTarget}
                  </span>
                ) : (
                  <span className="text-gray-500 font-medium">0 / 0</span>
                )}

              </p>
            </div>
          </div>
        </div>

        <div>
          <Label text="Batch Number" required />
          <Controller
            name="iBatchNumber"
            control={control}
            render={({ field }) => <Input {...field} type="text" className={errors.iBatchNumber ? "border-red-500" : ""} />}

          />
          {errors.iBatchNumber && <p className="text-red-500">{errors.iBatchNumber.message}</p>}
        </div>
        <div>
          <Label text="SDMS Batch Id" />
          <Controller
            name="SDMSid"
            control={control}
            render={({ field }) => <Input {...field} type="text" className={errors.SDMSid ? "border-red-500" : ""} />}

          />
          {errors.SDMSid && <p className="text-red-500">{errors.SDMSid.message}</p>}
        </div>

        <div className="col-span-1">
          <Label text="Batch Start Date" required />
          <Controller
            name="dtStartDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                value={field.value || ""}
                className={errors.dtStartDate ? "border-red-500" : ""}
              />
            )}
          />
          {errors.dtStartDate && (
            <p className="text-red-500">{errors.dtStartDate.message}</p>
          )}
        </div>

        {/* Batch End Date */}
        <div className="col-span-1">
          <Label text="Batch End Date" required />
          <Controller
            name="dtEndDate"
            control={control}
            rules={{
              validate: (value) => {
                if (!dtStartDate) return "Select 'Batch Start Date' first";
                if (isBefore(parseISO(value), parseISO(dtStartDate))) {
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
                disabled={!dtStartDate} // Disable Batch End Date if no Batch Start Date is selected
                className={errors.dtEndDate ? "border-red-500" : ""}
              />
            )}
          />
          {errors.dtEndDate && (
            <p className="text-red-500">{errors.dtEndDate.message}</p>
          )}
        </div>
        {/* {/* <div className="col-span-1">
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
        </div> */}




        {/* <div className="col-span-1">
          <Label text="Sectors" />
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
                 
                  setValue("fklSectorId", selectedOption.value); 
                }}
                className={errors.fklSectorId ? "border-red-500" : ""}
                placeholder="-- Select Sectors --"
              />
            )}
          />
          {errors.fklSectorId && (
            <p className="text-red-500">{errors.fklSectorId.message}</p>
          )}
        </div> */}


        {/* <div>
          <Label text="QPNOS Code" />
          <Controller
            name="QPNOS"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={fundingTypes}
                placeholder="-- Select --"
                className={errors.QPNOS ? "border-red-500" : ""}
              />
            )}
          />
          {errors.QPNOS && <p className="text-red-500">{errors.QPNOS.message}</p>}
        </div> */}

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

export default BatchModel;
