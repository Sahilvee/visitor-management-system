import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../service.js/axios";
import endpoints from "../service.js/endPoints";

function Otpverify() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const type = location.state?.type;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

                   // POPUP

  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",

  });

  const showPopup = (type, message) => {
    setPopup({

      show: true,
      type,
      message,

    });

    setTimeout (() => {
      setPopup({
        show: false,
        type: "",
        message: "",
      });
    },  3000);
  };

  useEffect(() => {

    if (!formData) {
      navigate("/");
    }
  }, [formData, navigate]);

  if (!formData) return null;

  // HANDLE OTP INPUT
  const handleChange = (value, index) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;
    setOtp(newOtp);

    // NEXT INPUT

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    //   BACKSPACE
    if (!value && index > 0) {
      document
        .getElementById(`otp-${index - 1}`)
        .focus();
    }
  };

  //   VERIFY OTP
  const handleVerify = async () => {
    const otpValue = otp.join("");

    if(otpValue.length !== 4) {
        showPopup(
        "error",
        "Enter complete OTP"
      );
      return;
    }

    try {
      setLoading(true);

                  //    VERIFY OTP
      const verifyRes = await api.patch(
         endpoints.VERIFY_OTP,
        {
           email: formData.email,
          otp: otpValue,
          type: type,
        }
      );

     showPopup(
        "success",
        verifyRes.data.message
      );

      //  STORE TOKEN
      sessionStorage.setItem(
        "token",
        verifyRes.data.token
      );

      // VISITOR  FLOW
      if  (type === "visitor") {
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
           data.append(key, formData[key]);
        });

        const  res =  await api.post(
          endpoints.REGISTER_VISITOR,
              data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",

            },
          }

        );

        showPopup(
           "success",
          res.data.message
        );

         setTimeout(() => {
          navigate("/visitors");
        }, 1200);

      } else if (type === "appointment") {

        const payload = {
           ...formData,
                 visitDate: new Date(
            formData.visitDate
          ),
                duration: Number(
            formData.duration
          ),
        };

        const res = await api.post(
          endpoints.CREATE_APPOINTMENT,
          payload
        );

        showPopup(
           "success",
           res.data.message
        );

      setTimeout(() => {
          navigate("/visitors");
        }, 1200);

      }
       else
         {
        showPopup(
          "error",
          "Unknown action"
        );
      }

    } catch (error) {
      console.error(error);

      
      showPopup(
        "error",
        error.response?.data?.message ||
          "Something went wrong ❌"
      );

    }
     finally 
    {
      setLoading(false);
    }
  };

  // RESEND  OTP
  const  handleResend = async () => {
    try {
      const res = await api.post(
         endpoints.SEND_OTP,
        {
          email: formData.email,

          type: type,
        }
      );

      showPopup(

        "success",
        res.data.message ||
          "OTP resent successfully ✅"
      );

    } catch (err) {

      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to resend OTP"
      );
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">


      {/*    BACKGROUND  */ }
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>


      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-3xl"></div>

      <div className="absolute inset-0 bg-black/10"></div>

      { /* POPUP */ }
      {popup.show &&
       (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div
            className={`px-6 py-4 rounded-2xl shadow-2xl text-white font-medium backdrop-blur-lg border ${
              popup.type === "success"
                ? "bg-green-500/90 border-green-300"
                : "bg-red-500/90 border-red-300"
            }`}
          >
             {popup.message}
          </div>
        </div>
      )}

      { /* CONTENT */ }
      <div  className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-12 min-h-screen flex items-center">

        <div  className="grid lg:grid-cols-2 gap-16 items-center w-full">

          { /* LEFT */ }
          <div className="text-white">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-5 py-2 text-sm mb-8">
                    Secure OTP Verification
            </div>

            <h1  className="text-5xl lg:text-7xl font-bold leading-tight">
              Verify Your
              <span className="block text-blue-200">
                 Identity
              </span>
                      </h1>

            <p  className="mt-8 text-lg text-blue-100 leading-relaxed max-w-2xl">
              Enter the OTP sent to your email
              address to securely continue your
              visitor registration or appointment
              booking process.
            </p>

                          {/*  FEATURES  */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-center">
                <h2 className="text-2xl font-bold">
                  OTP
                </h2>


                <p className="text-sm text-blue-100 mt-2">
                  Email Verification
                </p>
              </div>

              <div  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-center">
                <h2  className="text-2xl font-bold">
                                  Safe
                </h2>

                <p className="text-sm text-blue-100 mt-2">
                     Secure Access
                </p>

              </div>


              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-center">
               
               
                <h2 className="text-2xl font-bold">
                  Fast
                </h2>

                <p className="text-sm text-blue-100 mt-2">
                  Instant Approval
                </p>
              </div>
            </div>

          </div>

            {/* RIGHT */}
          <div>

            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[36px] p-8 lg:p-10 shadow-2xl">

       {/* HEADER */}
               <div className="mb-8">

                 <h2 className="text-4xl font-bold text-white">
                  OTP Verification
                 </h2>

                         <p className="text-blue-100 mt-3">
                              Verify your email address
                         </p>

              </div>

               {/* EMAIL */}
              <div className="mb-6">


                <label className="block text-sm font-medium text-blue-100 mb-2">
                   Email Address
                </label>

                <input
                   type="email"
                  value={formData.email}
                   disabled
                    className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-5 py-4 outline-none opacity-80"
                />

              </div>

              {/*  OTP INPUT */}
              <div className="mb-8">


                <label className="block text-sm font-medium text-blue-100 mb-4">
                  Enter OTP
                </label>

                <div className="flex justify-center gap-4">


                  {otp.map((digit, index) => (
                    <input
                      key={index}
                       id={`otp-${index}`}
                       type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) =>
                        handleChange(
                          e.target.value,
                          index
                        )
                      }
                       className="w-16 h-16 bg-white/10 border border-white/20 text-white text-2xl text-center rounded-2xl outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                    />
                  ))}

                </div>

              </div>

              {/* BUTTON  */}
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-white text-indigo-700 hover:bg-blue-50 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:scale-[1.02]"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>
               {/* RESEND */}
              <div className="text-center mt-6">

                <p  className="text-blue-100  text-sm">
                   Didn’t receive OTP?
                </p>
                <button
                  onClick={handleResend}
                  className="mt-2 text-white  font-semibold hover:text-cyan-200  transition"
                >
                   Resend OTP
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Otpverify;