import React, { useState } from "react";
import endpoints from "../service.js/endPoints.jsx";
import api from "../service.js/axios.jsx";

function TrackingPage() {
  const [trackId, setTrackId] = useState("");
    const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!trackId) {
      
      setError("Please enter Track ID");
      return;
    }

    try  {
         setLoading(true);
             setError("");
      setData(null);

       const res = await api.get(
        endpoints.TRACK_APPOINTMENT(trackId)
      );

             setData(res.data.appointment_record);
    } catch(err) {
      setError(
          err?.response?.data?.message ||
          "Appointment not found"
      );

    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch  (status) {
        case "APPROVED":
         return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
         return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      case "CANCELLED":
           return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">

    {/* Background  */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-3xl"></div>

        <div className="absolute inset-0 bg-black/10"></div>

      {/* Main    */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-12 min-h-screen flex items-center">

        <div className="grid lg:grid-cols-2 gap-14 items-center w-full">

          {/* Left        */}
            <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-5 py-2 text-sm mb-8">
              Smart Appointment Tracking
            </div>

                     <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                           Track Your
              <span className="block text-blue-200">
                        Appointment
               </span>


            </h1>

            <p  className="mt-8 text-lg text-blue-100 leading-relaxed  max-w-2xl">
              Enter your tracking ID to instantly check
              appointment status, approval details, and
              visit schedule securely through the portal.
             </p>

            {/* features   */}
                    <div className="grid grid-cols-3 gap-4 mt-12">

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-center">
                <h2 className="text-2xl font-bold">
                            Live
                </h2>

                 <p className="text-sm text-blue-100 mt-2">
                                 Status Updates
                   </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-center">
                 <h2 className="text-2xl font-bold">
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
                   Instant Tracking
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
                  Track Appointment
                  </h2>

                  <p className="text-blue-100 mt-3">
                  Enter your tracking ID below
                   </p>

              </div>

              {/* INPUT */}
               <div className="space-y-5">
                <div>

                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Tracking ID
                  </label>

                  <input type="text" placeholder="Enter tracking ID" value={trackId} onChange={(e) =>
                      setTrackId(e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-100/70 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-white/40 transition"
                  />

                </div>

                {/* BUTTON */}
                <button
                  onClick={handleTrack}   disabled={loading} className="w-full bg-white text-indigo-700 hover:bg-blue-50 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg"
                >
                  {loading
                    ? "Fetching Details..."
                    : "Track Appointment"}
                </button>
              </div>

              {/* ERROR */}
              {error &&  (
                 <div className="mt-6 bg-red-500/20 border border-red-300/20 text-red-100 px-5 py-4 rounded-2xl">
                  {error}
                </div>
              )}

              {/* RESULT */}
              {data &&  (
                <div  className="mt-8 bg-white/10 border border-white/10 rounded-3xl p-6 text-white">

                  {/*  TOP  */}
                  <div  className="flex items-center justify-between mb-6">

                    <h3  className=" text-2xl font-bold">
                        Appointment Details
                    </h3>

                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor( data.status)}`}
                    >
                      {data.status}
                    </span>

                  </div>

                  {/* DETAILS */}
                  <div className="space-y-4 text-sm">

                     <div className="bg-white/5  rounded-2xl p-4">
                      <p className="text-blue-100 text-xs mb-1">
                         Tracking ID
                       </p>

                      <p className="font-semibold break-all" >
                        {data.trackingId}
                       </p>
                     </div>

                    <div className="bg-white/5 rounded-2xl  p-4">
                      <p className=" text-blue-100 text-xs mb-1">
                         Purpose
                       </p>

                      <p className="font-semibold">
                         {data.visitPurpose}
                       </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4">
                       <p className="text-blue-100 text-xs mb-1">
                         Visit Date
                      </p>

                      <p className="font-semibold">
                        {new Date(data.visitDate).toLocaleDateString()}
                      </p>
                     </div>

                    <div className="bg-white/5 rounded-2xl p-4">
                       <p className="text-blue-100 text-xs mb-1">
                        Created At
                        </p>

                      <p className="font-semibold">
                        {new Date(
                          data.createdAt
                        ).toLocaleString()}
                      </p>
                      </div>

                    {/* approve*/}
                    {data.approvedAt  && (
                        <div className="bg-green-500/10 border border-green-400/20 rounded-2xl p-4">
                         <p className="text-green-200 text-xs mb-1">
                           Approved At
                        </p>


                        <p className="font-semibold  text-green-100">
                          { new Date(
                              data.approvedAt
                          ).toLocaleString()}
                            </p>

                            </div>
                  )}

                    {/*rejection*/}
                    {   data.rejectionReason && (
                        <div className="bg-red-500/10 border border-red-400/20  rounded-2xl p-4">

                         <p className=" text-red-200 text-xs mb-1">
                          Rejection Reason
                        </p>

                         <p className=" font-semibold text-red-100">
                          {data.rejectionReason}
                           </p>

                      </div>
                    )}

                  </div>

                </div>
              )}

             </div>

           </div>

        </div>
      </div>

      </div>


  );
}

export default TrackingPage;