import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
  User,
  Briefcase,
  Eye,
} from "lucide-react";

import api from "../service.js/axios.jsx";

import endpoints from "../service.js/endPoints.jsx";

function AdminAppointments() {

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [toast, setToast] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [rejectModal, setRejectModal] = useState({
    open: false,
    id: null,
    reason: "",
  });

  // TOAST
const showToast  = (message, type = "success")  => {
     setToast({ message, type });

    setTimeout(() => {
       setToast(null);
    },  2500);
  };

  // STATUS STYLE
  const getStatusStyle = (status) => {
     switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";

      case "APPROVED":
        return "bg-green-50 text-green-700";

      case "REJECTED":
        return "bg-red-50 text-red-700 ";

      case "CHECKED_IN":
        return " bg-blue-50 text-blue-700";

      case "CHECKED_OUT":
        return "bg-purple-50  text-purple-700";

       default:
        return "bg-gray-50  text-gray-600";
    }

  };

                 // FORMAT DATE

  const formatDateTime  = (start, end) => {
              if (!start) return "N/A";

    const  startDate =    new Date(start) ;
    const  endDate =  end ? new Date(end) : null;

    const startStr  = startDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

         const endStr = endDate
           ? endDate.toLocaleTimeString("en-US", {
               hour: "numeric",
             minute: "2-digit",
                     })
                    : "";

     return endStr ? `${startStr} - ${endStr}` : startStr;
  };

  // FETCH
  const  fetchAppointments = async () => {
    try  {
 setLoading(true);
  
      const res = await api.get(endpoints.ADMIN_APPOINTMENT);

       setAppointments(res.data.appointments || []);
    } catch (err) {
     
       console.error(err);

      showToast("Failed to load appointments ❌", "error");
    }  finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     fetchAppointments();
  }, []);

  //  FILTERED DATA
  const filteredAppointments = useMemo(() => {
      let data =  [...appointments];

    if  (statusFilter  !==  "ALL") {
      data = data.filter((a) => a.status === statusFilter);
    }

    if (search.trim()) {
      data = data.filter(
        (a) =>
           a.trackingId
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
           a.visitorId?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
           a.hostId?.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return data;
  }, [appointments, search, statusFilter]);

  // STATS
  const stats = useMemo(() => {
     return {
       total: appointments.length,
       pending: appointments.filter((a) => a.status === "PENDING").length,
        approved: appointments.filter((a) => a.status === "APPROVED").length,
        rejected: appointments.filter((a) => a.status === "REJECTED").length,
    };
  },  [appointments]);

  // APPROVE

  const handleApprove = async (id) => {
  try {
       setActionLoading(id);

       const res = await api.patch(`/appointments/${id}/approve`);

       setAppointments((prev) =>
           prev.map((a) =>
             a._id === id ? res.data.appointment : a
        )
      );


      showToast("Appointment approved ✅");
    } catch (err) {

      console.error(err);
       showToast("Approval failed ❌", "error");
    }  finally {
       setActionLoading(null);
    }
  };

  //  REJECT
  const  submitReject =  async () => {
    try {
       setActionLoading(rejectModal.id);

         const res = await api.patch(
        `/appointments/${rejectModal.id}/reject`,
        {
           reason: rejectModal.reason,
        }
      );

    setAppointments((prev) =>
        prev.map((a) =>
          a._id === rejectModal.id
            ? res.data.appointment
            : a
        )
      );

       showToast("Appointment rejected ❌");

       setRejectModal({
        open: false,
        id: null,
        reason: "",
      });
    }  catch  (err) {
       console.error(err);

      showToast("Rejection failed ❌", "error");
    } finally {
       setActionLoading(null);
    }
  };

  return (
     <div className="min-h-screen bg-gray-50 p-6 space-y-6">

                                   {/* TOAST */}
      { toast && (

        <div
          className={`fixed  top-5 right-5 z-50 px-5 py-3 rounded-xl  shadow-lg text-white  font-medium transition-all 
          ${
             toast.type === "error"
               ? "bg-red-500"
              : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div  className="flex  flex-col  lg:flex-row  lg:items-center  lg:justify-between  gap-4">

        <div>
            <h1 className="text-3xl font-bold text-gray-800">
            Appointment Management
          </h1>

               <p className="text-gray-500 mt-1">
            Manage all visitor appointments
          </p>
        </div>

                {/* SEARCH */}
        <div className="relative w-full lg:w-80">
              <Search
                 size={18}
                   className="absolute left-3 top-3 text-gray-400"
          />

          <input

             type="text"
            placeholder="Search visitor, host or ID..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>
      </div>

      { /* STATS   */}
      <div className= "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
 

        <div className="bg-white rounded-2xl p-5 shadow-sm border  border-gray-100">

          <div className =" flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Total

              </p>

              <h2  className="text-3xl font-bold mt-1" >
                 {stats.total}
              </h2>


            </div>

            <div  className= " bg-indigo-50  p-3 rounded-xl">
           
              <CalendarDays className="text-indigo-500" />
            </div>


          </div>
        </div>
 

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
            <div>
                <p className="text-gray-500 text-sm">
                Pending
              </p>

              <h2 className="text-3xl font-bold text-yellow-600 mt-1">
                 {stats.pending}
              </h2>
            </div>

              <div className="bg-yellow-50 p-3 rounded-xl">
                   <Clock3 className="text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                    Approved
              </p>

               <h2 className="text-3xl font-bold text-green-600 mt-1">
                {stats.approved}
              </h2>
            </div>

            <div className="bg-green-50 p-3 rounded-xl">
              <CheckCircle2 className="text-green-500" />
                      </div>
          </div>


        </div>

        <div  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>

               <p className = "text-gray-500 text-sm ">
                Rejected
              </p>

              <h2 className = "text-3xl font-bold text-red-600 mt-1" >

                 {stats.rejected}

              </h2>
            </div>

            <div className="bg-red-50 p-3 rounded-xl">
               <XCircle className="text-red-500" />

             </div>

          </div>

        </div>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3">
   

        {[
          "ALL",
          "PENDING",
          "APPROVED",
          "REJECTED",
          "CHECKED_IN",
          "CHECKED_OUT", 
        ].map((status) => (
          <button 
             key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all
            ${
              statusFilter === status
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-100 hover:bg-gray-50"
            }`}
          >
            { status }
          </button>

        ))}

      </div>

                    {/* TABLE */}
      <div  className= "bg-white rounded-2xl shadow-sm border  border-gray-100  overflow-hidden ">

        <div className="p-5 border-b border-gray-100">

          <h2 className="text-lg font-semibold text-gray-800">

            Appointments List
          </h2>
        </div>

        <div className="overflow-x-auto">

           <table className="w-full text-sm">

             <thead className="bg-gray-50/70 text-gray-600">
              <tr>
                  <th  className="p-4  text-left">Tracking ID</th>
                <th className="p-4 text-left">Visitor</th>
                <th className=" p-4 text-left">Host</th>
                <th className="p-4 text-left ">Purpose</th>
                <th className="p-4 text-left">Date & Time</th>
                <th className=" p-4 text-left"> Status</th>
                <th className="p-4 text-left ">Actions</th>
              
               </tr>
              </thead>

              <tbody> 

               { loading  ?  (
                <tr>

                <td
                     colSpan="7"
                      className="text-center py-10 text-gray-500"
                  >
                     Loading appointments...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>

                  <td
                    colSpan="7"
                     className="text-center py-10 text-gray-400 "
                  >
                    No appointments found
                  </td>

                </tr>
              ) : (
                         filteredAppointments.map((item) => (
                  <tr

                     key={item._id} 

                    className="  border-t border-gray-100  hover:bg-gray-50/70  transition  cursor-pointer"
                    onClick={() =>

                      setSelectedAppointment(item)
                    }
                  >
                    <td className="p-4 font-semibold text-gray-800">
                       {item.trackingId}
                    </td>

                    <td className="p-4">
                     
                     
                      <div className="flex items-center gap-2">

                        <div className="bg-blue-50 p-2 rounded-full">
                          <User size={14} className="text-blue-500" />
                        </div>

                        <span>
                                   {item.visitorId?.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                       <div className="flex items-center gap-2">
                                    <div className="bg-purple-50 p-2 rounded-full">
                          
                          <Briefcase
                            size={14}
                            className="text-purple-500"
                          />
                        </div>

                        <span>
                           {item.hostId?.name}
                         </span>
                      </div>

                    </td>

                     <td className="p-4 text-gray-600">
                      {item.visitPurpose}
                    </td>

                  <td className="p-4 text-gray-500">
                       {formatDateTime(
                        item.visitDate,
                        item.endTime
                      )}
                    </td>

                    <td className="p-4">
                              <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                           item.status
                        )}`}
                      >
                        {item.status}
                           </span>
                    </td>

                   <td className="p-4 flex gap-2">

                      <button
                         onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppointment(item);
                        }}
                        className="bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                      >
                       
                        <Eye size={16} />
                      </button>

                 {item.status === "PENDING" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(item._id);
                             }}
                              className="bg-green-500  hover:bg-green-600  text-white px-4 py-2 rounded-lg text-xs  font-medium transition "
                          >
                            {actionLoading === item._id
                              ? "..."
                              : "Approve"}
                          </button>

                          <button 
                            onClick={(e) => {
                               e.stopPropagation();
 
                              setRejectModal({
                                open: true,
                                 id: item._id,
                                 reason: "",
                              });


                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition"
                          >
                            Reject
                          </button>
                        </>

                      )}

                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>


        </div>
      </div>

      {     /* DETAILS MODAL  */     }
      { selectedAppointment && (
               <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">

          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-6 relative border border-gray-100">

            <button
               onClick={() => setSelectedAppointment(null)}
               className="absolute top-4 right-5 text-gray-400 hover:text-black text-xl"
            >
              ✕ 

            </button>

            <h2 className =" text-2xl font-bold  text-gray-800 mb-6">
                Appointment Details
            </h2 >

            <div  className="space-y-4 text-sm" 
            >

              <div  className=" grid grid-cols-2  gap-4">

                <div className="bg-gray-50/70  p-4 rounded-xl" >
                 
                 
                  <p  className="text-gray-500 text-xs ">
                     Tracking ID
                  </p>

                  <p className="font-semibold mt-1" >
                     {selectedAppointment.trackingId }
                  </p>


                </div>

                <div className="bg-gray-50/70 p-4 rounded-xl">
                   <p className="text-gray-500 text-xs">
                               Status
                  </p>

                  <div  className="mt-2">
                     <span
                      className={ `px-3  py-1 rounded-full text-xs font-semibold  ${getStatusStyle(
                        selectedAppointment.status
                      )}`}
                    >
                       {selectedAppointment.status}
                    </span>
                  </div>

                </div>
              </div>

                       <div className="bg-gray-50/70 p-4 rounded-xl">
                <p className= "text-gray-500 text-xs ">
                   Visitor
                    </p>

                <p  className="font-semibold mt-1">
                   { selectedAppointment.visitorId?.name }
                </p>

                    <p className="text-gray-500 text-sm ">
                  {selectedAppointment.visitorId?.email }
                </p>
              </div>

              <div className="bg-gray-50/70 p-4 rounded-xl">
                 <p  className="text-gray-500 text-xs">
                   Host 
                </p>

                 <p className="font-semibold mt-1">
                  {selectedAppointment.hostId?.name}
                </p>
       </div> 

                   <div className="bg-gray-50/70 p-4 rounded-xl">
                <p  className=" text-gray-500  text-xs">
                  Purpose

                </p>

                <p className="font-semibold mt-1">
                 
                   {selectedAppointment.visitPurpose}
                </p>
              </div>

              <div className="bg-gray-50/70 p-4 rounded-xl">
                
                <p className="text-gray-500 text-xs">
                 
                   Date & Time
                </p>

                <p className="font-semibold mt-1">
                 
                 
                  {formatDateTime(
                    selectedAppointment.visitDate,
                    selectedAppointment.endTime
                  )}
                </p>
              </div>

              {selectedAppointment.rejectionReason && (
                <div className="bg-red-50/70 p-4 rounded-xl">
                  <p className="text-red-500 text-xs">
                    Rejection Reason
                  </p>

                   <p className="text-red-700 font-medium mt-1">
                    {selectedAppointment.rejectionReason}
                  </p>

                </div>
            )}
            </div>
          </div>


        </div>
      )}

                   { /* REJECT MODAL */ }
      { rejectModal.open  &&  (
        <div  className="fixed inset-0  bg-black/30 backdrop-blur-sm z-50 flex  justify-center items-center p-4  " >

          <div className = "bg-white w-full  max-w-md rounded-2xl  shadow-xl p-6 border border-gray-100" > 

            <h2 className="text-xl font-bold mb-4">
                 Reject Appointment
            </h2>

            <textarea
                rows={4}
                  value={rejectModal.reason}
                     onChange={(e) =>
                setRejectModal({
                  ...rejectModal,
                  reason: e.target.value,
                })
              }
                placeholder="Enter rejection reason..."
                 className="w-full border border-gray-100 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-red-300"
            />

         <div className="flex justify-end gap-3 mt-5">

                  <button
                   onClick={() =>
                  setRejectModal({
                    open: false,
                    id: null,
                    reason: "",
                  })
                }
                   className="px-5 py-2 rounded-lg hover:bg-gray-100 transition"
              >
               
                Cancel
              </button>

              <button
                onClick={submitReject}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
              >
                Confirm Reject
          </button>
            </div>

          </div>

        </div>
      )}
    </div>


  );

}


export default AdminAppointments;