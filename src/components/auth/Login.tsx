/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import Logo from "../../assets/ASDMLOGO.png";
import useAuthStore from "../../utils/cookies";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bg from "../../assets/bg-2.jpg"


const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [type, setType] = useState<string>("login");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const API_BASE_URL = process.env.VITE_API_BASE_URL || "";

  console.log("api is", API_BASE_URL);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
   // Access setAuth from the Zustand store
  
    try {
      const response = await axios.post(`${API_BASE_URL}/department/login`, {
        type,
        user: username,
        password,
      });
  
      if (response.data.success) {
        const { token, departmentId, adminLoginId, adminName,vsDepartmentName	, isDept } =
          response.data.data;
  
        // Store in Zustand and cookies
        setAuth(token, { username: adminName, departmentId,vsDepartmentName	, adminLoginId, isDept });
  
        toast.success(response.data.message || 'Login Successful!');
        if (type === 'create') {
          navigate('/department-creation');
          return;
        }
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Login failed');
        setLoading(false);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
      console.error(error);
      setLoading(false);
    }
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="grid grid-cols-2 h-full">
        <div className="flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl bg-white">
            <div className="py-6 px-14 grid gap-6">
              <div className="flex items-center gap-2">
                <img className="h-24 w-24" src={Logo} alt="ASDM Logo" />
                <p className="text-2xl text-theme-primary font-bold">
                  ASSAM SKILL DEVELOPMENT MISSION CONVERGENCE
                </p>
              </div>
              <form onSubmit={handleLogin} className="grid gap-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Select Login Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="login">Department Login</option>
                    <option value="create">Login Creation</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Username
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Password
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full mt-4 px-4 py-3 text-lg font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-theme-primary hover:bg-theme-primary-hover"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <img className="w-full h-full object-cover object-center" src={bg} alt="" />
      </div>
    </div>
  );
};

export default Login;
