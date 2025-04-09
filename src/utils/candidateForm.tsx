
import { useForm } from "react-hook-form";

type FormData = {
  schemeName: string;
  firstName: string;
  lastName: string;
  gender: "female" | "male" | "other";
  caste: string;
  jobRole: string;
  isPlaced: "yes" | "no";
  isCertified: "yes" | "no";
  qualification: string;
  totalCandidateTrainned: number;
  FinalcialYear: string;
  finalcialyear: string;
};

export default function CandidateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Candidate Registration</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scheme Name */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheme Name
            </label>
            <input
              {...register("schemeName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter scheme name"
            />
          </div>

           <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheme Name
            </label>
            <input
              {...register("schemeName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter scheme name"
            />
          </div>

          {/* First Name */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              {...register("gender")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Caste */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caste*
            </label>
            <input
              {...register("caste", { required: "Caste is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter caste"
            />
            {errors.caste && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          {/* Job Role */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Role*
            </label>
            <input
              {...register("jobRole", { required: "Job role is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter job role"
            />
            {errors.jobRole && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          {/* Is Placed */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Is Placed
            </label>
            <select
              {...register("isPlaced")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Is Certified */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Is Certified
            </label>
            <select
              {...register("isCertified")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Qualification */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification*
            </label>
            <input
              {...register("qualification", { required: "Qualification is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter qualification"
            />
            {errors.qualification && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}