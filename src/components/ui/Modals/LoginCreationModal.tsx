import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-toastify";
import { departmentCreationSchema } from "../../../utils/validation";
import Button from "../../ui/SubmitButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Input from "../Input";
import Label from "../Label";
import { createDepartmentLogin } from "../../../services/state/api/departmentCreationApi";
import { departmentCreationFormData } from "../../../types/departmentCreation";
import useModalStore from "../../../services/state/useModelStore";
import Dropdown from "../Dropdown";
import { getMasterData } from "../../../services/state/api/masterApi";
import { useEffect, useState } from "react";

const LoginCreationModal = () => {
  const [isCustomDepartment, setIsCustomDepartment] = useState<boolean>(false);
  const { closeModal } = useModalStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<departmentCreationFormData>({
    resolver: joiResolver(departmentCreationSchema),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDepartmentLogin,
    onSuccess: (data) => {
      if (data?.success) {
        closeModal();
        toast.success(data.message || "Login Creation submitted successfully!");
       
        queryClient.invalidateQueries({ queryKey: ["getCreatedDepartments"] });
      } else {
        toast.error(
          data.message ||
            "An error occurred while submitting the Login Creation."
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

  const { data: masterData, refetch } = useQuery({
    queryKey: ["masterData", "department"],
    queryFn: () => getMasterData("department"),
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const onSubmit: SubmitHandler<departmentCreationFormData> = (
    data: departmentCreationFormData
  ) => {
    mutation.mutate(data);
  };

  return (
    <div className="px-4 py-4 md:px-6 lg:px-12 overflow-auto max-h-[450px] max-w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-4"
      >
        {/* Department Name */}
        <div className="col-span-1">
          <Label text="Department Name" required/>
          <Controller
            name="departmentName"
            control={control}
            render={({ field }) => (
              <>
                {!isCustomDepartment ? (
                  <Dropdown
                    {...field}
                    options={masterData?.data?.result?.department}
                    // isOtherOption
                    getOptionLabel={(option) => option?.label}
                    getOptionValue={(option) => option?.value}
                    onSelect={(selectedOption) => {
                      if (selectedOption.label === "Other") {
                        setIsCustomDepartment(true);
                        console.log(selectedOption);
                        setValue("departmentName", ""); // Reset the input field
                      } else {
                        setIsCustomDepartment(false); // Keep dropdown
                        field.onChange(selectedOption.label);
                        setValue("departmentName", selectedOption.label);
                      }
                    }}
                    className={errors.departmentName ? "border-red-500" : ""}
                    placeholder="-- Select Department --"
                  />
                ) : (
                  <Input
                    type="text"
                    placeholder="Enter Department Name"
                    className={`w-full ${
                      errors.departmentName ? "border-red-500" : ""
                    }`}
                    onChange={(e) => setValue("departmentName", e.target.value)} // Handle input separately
                  />
                )}
              </>
            )}
          />
          {errors.departmentName && (
            <p className="text-red-500">{errors.departmentName.message}</p>
          )}
        </div>
        {/* <div className="col-span-1">
          <Label text="Department Name" />
          <Controller
            name="departmentName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Enter Department Name"
                className={`w-full ${
                  errors.departmentName ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.departmentName && (
            <p className="text-red-500">{errors.departmentName.message}</p>
          )}
        </div> */}

        {/* Login Name */}
        <div className="col-span-1">
          <Label text="Login Name" required />
          <Controller
            name="loginName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Enter Login Name"
                className={`w-full ${errors.loginName ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.loginName && (
            <p className="text-red-500">{errors.loginName.message}</p>
          )}
        </div>

        {/* Password */}
        {/* <div className="col-span-1">
          <Label text="Password" />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                placeholder="Enter Password"
                className={`w-full ${errors.password ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div> */}

        {/* Phone Number */}
        <div className="col-span-1">
          <Label text="Phone Number" />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Enter Phone Number"
                className={`w-full ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
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

export default LoginCreationModal;
