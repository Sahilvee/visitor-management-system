import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import endpoints from "../service.js/endPoints";
import api from "../service.js/axios";

import { LogOut, ScanLine, Camera, Upload, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";


function FrontDesk() {

  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const scanLockRef = useRef(false);

  const navigate = useNavigate();

  const [result, setResult] = useState("");

  const [userData, setUserData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

    //  ▶️ START SCANNER
  const startScanner = async () => {
     if (isRunningRef.current) return;

    try  {
      const  scanner = new Html5Qrcode("reader");
      scannerRef.current =  scanner;

      const cameras  = await Html5Qrcode.getCameras();

      if  (!cameras || cameras.length === 0) 
        {
        alert("No camera found");
        return;
      }

      const  cameraId = cameras[0].id;


      await  scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          if (scanLockRef.current) return;

           scanLockRef.current = true;

           await handleQRResult(decodedText);

          stopScanner();
        },
        () => {}
      );

                       // FIX VIDEO
      setTimeout(() => {
        const video = document.querySelector("#reader video");

        if (video) {
           video.style.width = "100%";
           video.style.height = "100%";
          video.style.objectFit = "cover";
        }
      }, 500);

       isRunningRef.current = true;
          setIsScanning(true);
    } catch ( err) {
       console.error(err);
    }
  };

  //           ⏹ STOP SCANNER
  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (err) {
      console.log(err);
    }

     scannerRef.current = null;
    isRunningRef.current = false;
     scanLockRef.current = false;
    setIsScanning(false);
  };

  //      📡 HANDLE QR
  const handleQRResult = async (decodedText) => {
    try {
       const res = await api.post(
         endpoints.FRONT_DESK,
        {  qrData: decodedText  },
        {
          headers: {
             "Content-Type": "application/json",
          },
        }
      );

         setResult(res.data.message);
      setUserData(res.data.user || null);
    } catch (err) {
    
    
      // 🔥 Show backend error message
    setResult(
       err.response?.data?.message || 
      err.message ||  
      "Something went wrong ❌"
    );

    setUserData(null);

    }
  };

  //  📂     FILE UPLOAD
  const handleFileUpload = async (file) => {
    
    if (!file) return;

     const scanner = new Html5Qrcode("reader");

    try {
       const decodedText = await scanner.scanFile(file, true);

      await handleQRResult(decodedText);
    } catch {
       setResult("Invalid QR ❌ ");
    } finally {
        scanner.clear();
    }
  };

     // 🚪 LOGOUT
  const handleLogout = () => {
     sessionStorage.clear();
    localStorage.clear();

    navigate("/");
  };

  return  (
     <div className="min-h-screen bg-gray-100">

        {/*  TOP  BAR */}
      <div className="bg-white border-b  border-gray-200 px-6 py-4 flex  justify-between  items-center shadow-sm">

        <div>
            <h1 className="text-2xl font-bold text-gray-800">
             Front Desk Scanner
          </h1>

          <p className="text-sm  text-gray-500 mt-1">
            Scan visitor QR codes quickly and securely
           </p>
           </div>

         {/* RIGHT */}
        <div  className="flex items-center gap-4">

           {/* STATUS */}
          <div
             className={`px-4 py-2 rounded-full text-sm font-medium ${
              isScanning
                 ? "bg-green-100 text-green-700"
                 : "bg-gray-100 text-gray-600"
            }`}
          >
             {isScanning ? "Camera Active" : "Idle"}
          </div>

        {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl transition"
          >
             <LogOut size={18} />
            Logout
          </button>

         </div>
      </div>

     {/* CONTENT */}
       <div className="p-6">

        <div className="max-w-5xl  mx-auto grid grid-cols-1  lg:grid-cols-3 gap-6">

          {/* LEFT CARD  */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            {/* HEADER  */}
            <div className="flex  items-center  gap-3 mb-5">
              <div className="w-12 h-12  rounded-2xl bg-blue-100  text-blue-600 flex items-center justify-center">
                <ScanLine size={24} />

              </div>

              <div>
                <h2  className="text-xl font-semibold text-gray-800">
                  
                  QR Scanner
                </h2>

                <p className="text-sm text-gray-500">
                  Use camera or upload QR image
                </p>
              </div>
            </div>

                {/* SCANNER   */}
           
            <div className="relative w-full  h-[420px] rounded-2xl overflow-hidden border border-gray-200 bg-black">

              <div id="reader" className="w-full h-full"></div>

              {!isScanning  && (
                <div  className=" absolute  inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">

                  <div className=" w-20 h-20 rounded-full bg-blue-50  flex items-center justify-center mb-4">
                    <Camera  size={34} className="text-blue-600"  />
                  </div>


                  <p className="text-gray-600 font-medium">
                    Start camera or upload QR image
                  </p>
                  <input
                     type="file"
                     accept="image/*"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e.target.files[0])
                    }
                  />

                 <label
                     htmlFor="fileInput"
                    className="mt-5 flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl cursor-pointer transition"
                  >
                     <Upload size={18} />
                         Upload QR
                  </label>

                </div>
              )}

            </div>

                        {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 mt-6">

               <button
                onClick={startScanner}
                disabled={isScanning}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition"
              >
                <Camera size={18} />
               
                Start Scanner
              </button>

              <button
                onClick={stopScanner}
                disabled={!isScanning}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition"
              >

                Stop
              </button>

              <button
                onClick={() => {
                   setResult("");
                   setUserData(null);
                  scanLockRef.current = false;
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
              >
                <RotateCcw size={18} />
                Reset
              </button>

            </div>
          </div>

                       {/* RIGHT PANEL */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

             <h3 className=" text-lg  font-semibold text-gray-800 mb-5">
              Scan Result
            </h3>

            { !result ? (
              < div   className="h-full flex flex-col items-center justify-center text-center py-20">

                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <ScanLine className="text-gray-500" />
                </div>

                <p  className="text-gray-500 text-sm">
                     No QR scanned yet
                </p>

              </div>
            ) :  (
              <div>

                          {/* RESULT */}
                <div
                  className={`p-4 rounded-2xl  text-sm font-medium  mb-5 ${
                     result.includes("❌")
                       ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-green-50 text-green-700 border border-green-100"
                  }`}
                >
                   {result}
                </div>

                           {/* USER DETAILS */}
                {userData && (
                 
                 <div className="space-y-4">

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">

                      <p className="text-xs text-gray-400 mb-1">
                        Visitor Name
                      </p>

                      <p className="font-semibold text-gray-800">
                        {userData.name}
                      </p>

                     </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">

                       <p className="text-xs text-gray-400 mb-1">
                        Host
                      </p>

                      <p className="font-semibold text-gray-800">
                        {userData.host}
                      </p>

                     </div>

                     <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">

                      <p className="text-xs text-gray-400 mb-1">
                        Purpose
                      </p>

                       <p className="font-semibold text-gray-800">
                        {userData.purpose}
                       </p>

                     </div>

                    <div  className="bg-gray-50 rounded-2xl p-4 border border-gray-100">

                      <p className="text-xs text-gray-400 mb-1">
                        Time
                      </p>

                      <p className="font-semibold text-gray-800">
                        {new Date(userData.time).toLocaleString()}
                      </p>

                     </div>

                   </div>
                )}

              </div>
            )}
          </div>

        </div>


      </div>



    </div>
  );
  
}

export default FrontDesk;