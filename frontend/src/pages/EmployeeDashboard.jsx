import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service.js/axios.jsx";

import endpoints from "../service.js/endPoints.jsx";

export default function EmployeeDashboard() {

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
     pending: 0,
     approved: 0,
     rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // TOAST
  const [toast, setToast] = useState(null);

  // FILTER STATES
   const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  // TOAST FUNCTION
  const showToast = (
    message,
    type = "success"
  ) => {
     setToast({ message, type });

     setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // LOGOUT
   const handleLogout = () => {
     sessionStorage.removeItem("token");
     localStorage.removeItem("USER");

     showToast(
       "Logged out successfully 👋"
    );

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  //  FETCH DATA
  const  fetchAppointments =
    async () => {
      try {
        setLoading(true);
 
        const res = await api.get(
          endpoints.ADMIN_APPOINTMENT
        );

        setAppointments(
          res.data.appointments || []
        );

        setStats(
          res.data.stats || {}
        );
      }  catch (err) {
        console.error(err);

        showToast(
          err.response?.data
            ?.message ||
            "Failed to load appointments",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

   useEffect(() => {
    fetchAppointments();
  }, []);

            // APPROVE / REJECT
  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await api.patch(
        `/appointments/${id}/${status}`
      );

      showToast(
        status === "approve"
           ? "Appointment Approved ✅"
          : "Appointment Rejected ❌",
        status === "approve"
          ? "success"
          : "error"
      );

       fetchAppointments();
    } catch (err) {
      console.error(err);

      showToast(
        err.response?.data
           ?.message ||
           "Something went wrong",
         "error"
      );
    }
  };

             // FILTERED DATA
  const filteredAppointments =
     useMemo(() => {
      return appointments.filter(
        (a) => {
          const visitorName =
            a.visitorId?.name?.toLowerCase() ||
            "";

            const visitorEmail =
             a.visitorId?.email?.toLowerCase() ||
            "";

            const matchesSearch =
            visitorName.includes(
              search.toLowerCase()
            ) ||
            visitorEmail.includes(
              search.toLowerCase()
            );

           const matchesStatus =
            statusFilter === "ALL"
              ? true
              : a.status ===
                statusFilter;

           const matchesDate =
            dateFilter
              ? new Date(a.visitDate)
                  .toISOString()
                  .split("T")[0] ===
                dateFilter
              : true;

          return (
             matchesSearch &&
            matchesStatus &&
             matchesDate
          );
        }
      );
    }, [
       appointments,
       search,
      statusFilter,
      dateFilter,
    ]);

  return (
    <div className=" min-h-screen bg-gray-100 flex">

      {/* TOAST */}

      {toast  && (
        <div
           className={`fixed top-5  right-5 z-50 px-5 py-3  rounded-2xl shadow-xl text-white font-medium  animate-bounce
          ${
            toast.type === "error"
              ? "bg-red-500"
              : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}

       {/* SIDEBAR */}

      <div className="w-64  bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 shadow-xl">

        <h2 className="text-3xl font-bold mb-10">
          Employee
        </h2>
        <div className="space-y-4">


          <div className="bg-blue-500/20 border border-blue-400 px-4 py-3 rounded-xl">
            <p className="font-semibold">
              Dashboard
            </p>
          
          </div>

          <div className="bg-white/5 px-4 py-3 rounded-xl">

            <p className="text-gray-300 text-sm">
              Total Appointments
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {stats.total}
            </h2>

          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-auto">

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage appointments professionally
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={
                fetchAppointments
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow transition"
            >
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl shadow transition"
            >
              Logout
            </button>

          </div>
        </div>

                   {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">

            <p className="text-gray-500 text-sm">
              Total Appointments
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {stats.total}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">

            <p className="text-gray-500 text-sm">
              Pending
            </p>

            <h2 className="text-3xl font-bold mt-2 text-yellow-600">
              {stats.pending}
            </h2>

          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">

            <p className="text-gray-500 text-sm">
              Approved
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {stats.approved}
            </h2>

          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">

            <p className="text-gray-500 text-sm">
              Rejected
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-600">
              {stats.rejected}
            </h2>

          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search visitor..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl px-4 py-3"
            >

               <option value="ALL">
                All Status
              </option>

               <option value="PENDING">
                Pending
              </option>

               <option value="APPROVED">
                Approved
              </option>

               <option value="REJECTED">
                Rejected
              </option>

              </select>

            {/* DATE FILTER */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl px-4 py-3"
            />

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Appointments
            </h2>

          </div>

           {loading ? (
            <div className="p-10 text-center text-gray-500">
                Loading appointments...
            </div>
          ) : filteredAppointments.length ===
             0 ? (
            <div className="p-10 text-center text-gray-500">
               No appointments found
            </div>
          ) : (
             <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">
                  <tr className="text-gray-600 text-sm uppercase">

                    <th className="p-4 text-left">
                       Visitor
                    </th>

                    <th className="p-4 text-left">
                      Email
                    </th>

                    <th className="p-4 text-left">
                      Date
                    </th>

                    <th className="p-4 text-left">
                       Purpose
                    </th>

                    <th className="p-4 text-left">
                         Status
                    </th>

                    <th className="p-4 text-right">
                      Actions
                    </th>

                  </tr>
                </thead>
                <tbody>

                  {filteredAppointments.map(
                    (a) => 
                      (

                      <tr
                        key={a._id}
                        onClick={() =>
                          setSelected(a)
                        }
                        className="border-b hover:bg-gray-50 transition cursor-pointer"
                      >

                        <td className="p-4 font-semibold">
                          
                          {a.visitorId
                            ?.name ||
                            "N/A"}
                        </td>

                        <td className="p-4 text-gray-600">
                          
                          {a.visitorId
                            ?.email ||
                            "N/A"}
                        </td>

                        <td  className="p-4 text-gray-600">
                         
                          {new Date(
                            a.visitDate
                          ).toLocaleString()}
                        </td>

                        <td className="p-4">
                          {
                            a.visitPurpose
                          }
                        </td>

                        <td  className=" p-4 ">

                          <span 
                            
                            className={`px-3 py-1  rounded-full text-xs font-bold  ${
                              a.status ===
                              "APPROVED"
                                 ? "bg-green-100 text-green-700"
                                   : a.status ===
                                  "REJECTED"
                                ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {a.status}
                           </span>

                        </td>

                         <td className="p-4 text-right">

                          {a.status ===
                            "PENDING" && (
                            <div className="space-x-2">

                              <button
                                onClick={(
                                  e
                                ) => {
                                   e.stopPropagation();

                                  updateStatus(
                                     a._id,
                                    "approve"
                                  );
                                }}
                                className="bg-green-500  hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                              >
                                Approve
                               </button>

                              <button

                                onClick={(
                                  e
                                ) => {
                                  e.stopPropagation();

                                   updateStatus(
                                    a._id,
                                    "reject"
                                  );
                                }}
                                className="bg-red-500  hover:bg-red-600  text-white px-4 py-2 rounded-lg text-sm"
                              >
                                Reject
                              </button>


                            </div>
                          )}

                        </td>

                      </tr>
                    )
                  )}

                </tbody>



              </table>
              {/* DETAILS MODAL */}
{  selected && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

       <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_.3s_ease]">

      {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-bold">
            Appointment Details
          </h2>

          <p className="text-blue-100 mt-1">
             Complete visitor information
          </p>
        </div>

        <button
          onClick={() => setSelected(null)}
          className="text-white text-3xl hover:scale-110 transition"
        >
          ×
        </button>
      </div>

      {/* BODY */}
        <div className="p-8 grid md:grid-cols-2 gap-6">

        <div className="space-y-5">

          <div>
            <p className="text-gray-500 text-sm">
              Visitor Name
            </p>

            <h3 className="text-xl font-semibold text-gray-800">
              {selected.visitorId?.name || "N/A"}
            </h3>
          </div>

           <div>
            <p className="text-gray-500 text-sm">
              Email
            </p>

            <h3 className="text-lg font-medium text-gray-700">
              {selected.visitorId?.email || "N/A"}
            </h3>
          </div>

           <div>
            <p className="text-gray-500 text-sm">
              Phone
            </p>
 
            <h3 className="text-lg font-medium text-gray-700">
              {selected.visitorId?.phone || "N/A"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Purpose
            </p>

              <h3 className="text-lg font-medium text-gray-700">
              {selected.visitPurpose}
            </h3>
          </div>

          </div>

           <div className="space-y-5">

          <div>
            <p className="text-gray-500 text-sm">
              Appointment Date
             </p>
  
              <h3 className="text-lg font-medium text-gray-700">
              {new Date(
                selected.visitDate
              ).toLocaleString()}
            </h3>
          </div>

            <div>
            <p className="text-gray-500 text-sm">
              Status
             </p>

            <span
              className={`inline-block mt-1 px-4 py-2 rounded-full text-sm font-bold ${
                selected.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                   : selected.status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {selected.status}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Tracking ID
             </p>

            <h3 className="text-lg font-medium text-gray-700">
              {selected.trackingId || "N/A"}
             </h3>
            </div>

            <div>
            <p className="text-gray-500 text-sm">
              Host
            </p>

            <h3  className= "text-lg font-medium text-gray-700">
               {selected.hostId?.name || "N/A"}
             </h3>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div    className="border-t px-8 py-5 flex justify-end gap-3 bg-gray-50">

        <button
          onClick={() => setSelected(null)}
           className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
        >
          Close
        </button>

       </div>

    </div>
  </div>
)}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}