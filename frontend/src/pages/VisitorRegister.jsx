import React, { useState } from "react";
import api from "../service.js/axios";
import endpoints from "../service.js/endPoints";
import { useNavigate } from "react-router-dom";
import { visitorSchema } from "../service.js/joiSetup";

function VisitorRegister() {
  const navigate = useNavigate();

 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    idtype: "Aadhaar",
    idnumber: "",
    image: null,
  });

      const [loading, setLoading] = useState(false);

  // Toast
  
  const [toast, setToast] = useState({ show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
  };

  // Handle Input
  const handleChange = (e) => { 

    const { name, value, files } = e.target;

    if (name === "image") {
       setFormData({
        ...formData,
        image: files[0],
      });
    } else  {
        setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Submit
  const handleSubmit =  async (e) => {
      e.preventDefault();

    if (!formData.email) 
     {
         showToast("Email is required", "error");
      return;
    }
        const { error } = visitorSchema.validate(formData, {
       abortEarly: false,
  });

  if (error) {
 showToast(error.details[0].message, "error");
    return;
  }
    try {
      setLoading(true);
      const res = await api.post( endpoints.SEND_OTP,
        {
          email: formData.email,
          type: "visitor",
        }
      );

    showToast(res.data.message, "success");

      setTimeout(() => {
         navigate("/otp", {
          state: {
            formData,
            type: "visitor",
          },
        });
      }, 1200);

    } catch (error) {
       console.error(error);


      showToast(
         error.response?.data?.message ||
        "Failed to send OTP",
        "error"
      );
    } finally {
       setLoading(false);
    }
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden flex items-center justify-center px-6 py-10">

      {/* BACKGROUND EFFECTS */}
       <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-pink-400/10 rounded-full blur-3xl"></div>
         <div className="absolute inset-0 bg-black/10"></div>

      {/* TOAST */}
       {toast.show && (
        <div
         className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-white animate-pulse
          ${
             toast.type === "error"
              ? "bg-red-500/90 border-red-300"
              : "bg-emerald-500/90 border-emerald-300"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* FORM CARD */}
      <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden">

          <div className="grid lg:grid-cols-2">

                          {/*        Left Side        */}
          <div className="hidden lg:flex flex-col justify-center p-12 text-white">

            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl mb-8">
              👤
            </div>

            <h1 className="text-5xl font-bold leading-tight">
               Visitor
               <span className="block text-blue-200">
                Registration
              </span>
            </h1>

            <p className="mt-6 text-lg text-blue-100 leading-relaxed">
               Register yourself securely to access
               appointments, QR check-ins, and visitor services
                through our smart visitor management system.
            </p>

            {/* Features */}
            <div className="space-y-4 mt-10">


   <div className="bg-white/10 border border-white/10 rounded-2xl p-5">

                <h3 className="font-semibold text-lg">
                  Secure Verification
                </h3>
                <p className="text-sm text-blue-100 mt-1">
                    OTP-based visitor verification system.
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                
                
                <h3 className="font-semibold text-lg">
                  Smart QR Access
                </h3>

                <p className="text-sm text-blue-100 mt-1">
                  Instant QR-based visitor identification.
                </p>
               </div>

             </div>

           </div>

          {/* Right side */}
          <div className="bg-white p-8 lg:p-12">

               <div className="mb-8">

              < div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-5">
                V
              </div>

               <h2 className="text-3xl font-bold text-gray-800">
                Register Visitor
              </h2>

               <p className="text-gray-500 mt-2">
                Fill the details to continue
                 </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input type="text" name="name"
                  value={formData.name}
                  onChange={handleChange} placeholder="Enter full name"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />

              </div>

               { /* Email */ }
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"  name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address"
 className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />

              </div>

              {/* Phone */}
              <div  className="mb-5" >

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                   type="tel" name="phone" value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
 

              </div>

              {/* ID TYPE + NUMBER */}
              <div  className="grid md:grid-cols-2 gap-4 mb-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     ID  Type
                  </label>

                  <select
                    name="idtype"
                     value={formData.idtype}
                     onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  >

                    <option value="Aadhaar">
                     Aadhaar 
                     </option>

                    <option value="Passport">
                       Passport
                      </option>

                    <option  value="DL">
                       Driving License
                      </option>

                  </select>
               </div>

                <div>


                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number
                    </label>

                  < input type="text" name="idnumber"
                    value={formData.idnumber} onChange={handleChange} placeholder="Enter ID number"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition"
                   />

                 </div>

              </div>

              {    /* File  */        }
              <div  className="mb-8" >

                <label className="block text-sm font-medium text-gray-700 mb-2">
                   Upload  Image
                </label>

                <div  className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition">

                  <input  type="file" name="image" accept="image/*"
                    onChange={handleChange} className="w-full text-sm text-gray-500  file:mr-4 file:py-3 file:px-5
                     file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-600
                    hover:file:bg-blue-100"
                  />

                  <p className="text-xs text-gray-400 mt-3">
                        JPG, PNG supported
                  </p>

                  </div>
             </div>

              {/* BUTTON */}
              <button type="submit"
                 disabled={loading}
                className="w-full bg-gradient-to-r  from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70"
              >

                {loading
                  ?  "Sending OTP..."
                  : "Continue Verification"}
              </button>


            </form>

          </div>
            </div>

         </div>


    </div>
  );
}

export default VisitorRegister;