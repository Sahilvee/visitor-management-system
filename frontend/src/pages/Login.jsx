import React, { useState } from "react";
import api from "../service.js/axios.jsx";
import endpoints from "../service.js/endPoints.jsx";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../service.js/joiSetup.js";
function LoginPage() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

             // 🔥 Custom Toast
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");

    toast.innerText = message;
    toast.className = `
      fixed top-5 right-5 z-50
      px-5 py-3 rounded-2xl shadow-2xl
      text-white text-sm font-medium

      backdrop-blur-md transition-all duration-300
      ${type === "error"
        ? "bg-red-500"
        : "bg-green-500"
      }
    `;


    document.body.appendChild(toast);

    setTimeout(() => {
       toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
    }, 2200);

     setTimeout(() => {
      toast.remove();
    }, 2600);
  };

  const  handleLogin = async  () => {
    if  (!email || !password) 
      {
      setError("All credentials required");
      return;
    }
     const {error} =loginSchema.validate({email,password});
     if (error) {
    setError(error.details[0].message);
    return;
  }

    try {
      setLoading(true);
      setError("");

      const  res = await api.post(endpoints.ADMIN_LOGIN, {
        email,
        password,
      });

      const { user, token, message } = res.data;

       sessionStorage.setItem("token", token);
      localStorage.setItem("USER", JSON.stringify(user));

      // ✅ Beautiful Toast
      showToast(message || "Login Successful");

      // Role Navigation
      setTimeout(() => {
        if (user.role === "ADMIN") {
           navigate("/admin_dashboard");
        } else if (user.role === "EMPLOYEE") {
          navigate("/employee_dashboard");
        } else if (user.role === "FRONTDESK") {
           navigate("/frontdesk_dashboard");
        } else {
          setError("Unknown role");
        }
      }, 800);

    }  catch (err) {

      const msg =
        err.response?.data?.message || "Something went wrong";

      setError(msg);

        //  ❌ Error Toast
      showToast(msg, "error");

    } finally 
    {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">


      {/* LEFT SIDE */}


      <div className="hidden lg:flex flex-1  bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white items-center justify-center p-12" >

        <div className="max-w-lg">

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Visitor Management System
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Manage appointments, visitors, employees, approvals,
            check-ins, and security operations from one powerful dashboard.
          </p>


          <div className="mt-10 grid  grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 ">
              <h3 className="text-2xl  font-bold">Fast</h3>
              <p className=" text-sm text-blue-100 mt-1 ">
                Quick appointment approvals and QR check-ins.
                </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <h3 className="text-2xl font-bold">Secure</h3>
              <p className="text-sm text-blue-100 mt-1">
                  OTP verification and role-based authentication.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Right side*/}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">

        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

            {/* Header */}
            <div className="text-center mb-8">

             <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                V
              </div>

               <h2 className="text-3xl font-bold text-gray-800 mt-4">
                Welcome Back
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                 Login to continue
              </p>

            </div>

                                                            {/* Error */}
            {error && (
               <div className="mb-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                 {error}
              </div>
            )}

             {/* Email */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                   Email Address
              </label>

               <input
                type="email"
                 placeholder="Enter your email"
                 className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            {/*  Password  */}
            <div className="mb-6">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                 Password
              </label>

              < input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              
               />

            </div>

            {/*  Button  */}
            <button
               onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-medium shadow-md transition-all duration-200 disabled:opacity-70"
            >
               {loading ? "Logging in..." : "Login"}
            </button>

            { /* Footer */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Secure Access • Role Based Authentication
            </p>

          </div>


        </div>

      </div>

    </div>
  );
  
}

export default LoginPage;