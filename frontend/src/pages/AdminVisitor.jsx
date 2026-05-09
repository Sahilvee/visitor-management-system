import React, { useEffect, useState } from "react";
import api from "../service.js/axios.jsx";

function AdminVisitor() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState(null);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const BASE_URL = "http://localhost:5000";

        // 🔥 Toast
  const  showToast = (msg, type = "success") => {
          setToast({ msg, type  });
    setTimeout(() => setToast(null), 2500);
  };

  // 🔥  Fetch visitors

  const fetchVisitors = async () => {
    try {
       setLoading(true);
       const res = await api.get("/visitors");
      setVisitors(res.data.visitors);
    } catch {
      showToast("Failed to load visitors ❌", "error");
    } finally {
       setLoading(false);
    }
  };

   useEffect(() => {
         fetchVisitors();
  }, []);

  // ✅ Verify
   const handleVerify = async (id) => {
    try {
       setActionLoading(id);

    const res = await api.patch(`/visitors/${id}/verify`);

       setVisitors((prev) =>
                 prev.map((v) => (v._id === id ? res.data.visitor : v))
      );

      if (selectedVisitor?._id === id) {
         setSelectedVisitor(res.data.visitor);
      }

       showToast("Visitor verified ✅");
    } catch {
       showToast("Verification failed ❌", "error");
    } finally {
       setActionLoading(null);
    }
  };

           // ❌ Delete
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this visitor?");
     if (!confirm) return;

     try {
      setActionLoading(id);

      await api.delete(`/visitors/${id}`);

        setVisitors((prev) => prev.filter((v) => v._id !== id));

      if (selectedVisitor?._id === id) {
        setSelectedVisitor(null);
       }

       showToast("Visitor deleted 🗑️");
    } catch {
      showToast("Delete failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // 🔍 Search
  const filteredVisitors = visitors.filter((v) =>
     v.name.toLowerCase().includes(search.toLowerCase()) ||
     v.phone.includes(search) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* 🔥 Toast */}
       {toast && (
        <div
          className={`fixed top-5  right-5 px-4 py-2 rounded-xl  shadow-lg  text-white z-50 text-sm
          ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >

          {toast.msg}
        </div>
      )}


          {/* 🔷 Header */}

      <div className="flex flex-col  md:flex-row md:items-center  md:justify-between  gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
             Visitors
          </h1>

           <p className="text-sm text-gray-500 mt-1">
                     Manage and monitor all visitor records
          </p>
        </div>

                              {/* 🔍 Search */}
        <div className="relative">
         
          <input
            type="text"
            placeholder="Search visitors..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className=" w-80  bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm
             focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
             transition shadow-sm "
           />
          
          </div>
      </div>


                                             {/* 🔷 Loading */}

      {loading ? (
         <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
         </div>
      ) : (

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

           {/* Table Header */}

          <div className="px-6 py-5 border-b border-gray-100">
            
            <h2 className="text-lg font-semibold text-gray-800">
               Visitor Directory
             </h2>
          </div>

                                   {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-50/70 text-gray-500">
                 <tr>
                   <th className="px-6 py-4 text-left font-medium">Visitor</th>
                  <th className="px-6 py-4 text-left font-medium">Visitor ID</th>
                   <th className="px-6 py-4 text-left font-medium">Contact</th>
                   <th className="px-6 py-4 text-left font-medium">ID Details</th>
                  <th className="px-6 py-4 text-left font-medium">Created By</th>
                   <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                    </tr>
             </thead>

               <tbody>
                { filteredVisitors.length > 0 ? (
                   filteredVisitors.map((v) => (
                    <tr
                       key={v._id}
                      onClick={() => setSelectedVisitor(v)}
                       className="border-t border-gray-100  hover:bg-gray-50/60  transition  cursor-pointer"
                    >

                      { /* 👤 Visitor  */}
                      <td  className="px-6 py-4">
                        <div className="flex  items-center gap-3">


                          <img
                             src={
                              v.photoUrl
                                ? `${BASE_URL}${v.photoUrl}`
                                : `${BASE_URL}/uploads/default.png`
                            }
                            alt="visitor"
                            className="w-11 h-11 rounded-full object-cover border border-gray-200"
                          />

                          <div>

                            <p  className="font-medium text-gray-800">
                               {v.name}
                            </p>

                            <p  className="text-xs text-gray-500 mt-0.5">
                              
                              {v.email || "No Email"}
                            </p>
                          </div>

                        </div>

                      </td>

                                      {/* 🆔 Visitor ID */}
                      <td className="px-6 py-4">
                         <span className="text-xs text-gray-500 break-all">
                          {v._id}
                         </span>
                      </td>

                       {/* 📞 Contact */}
                     <td className="px-6 py-4 text-gray-700">
                         {v.phone}
                      </td>

                    {/* 🪪 ID */}
                             <td className="px-6 py-4">
                        <p className="text-gray-700">
                          {v.idType || "-"}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {v.idNumber || ""}
                        </p>
                      </td>

                              {/* 👤 Created By */}
                      <td className="px-6 py-4 text-gray-700">
                         {v.createdBy}
                      </td>

                       {/* ✅ Status */}
                      <td className="px-6 py-4">
                        <span
                           className={`px-3 py-1 rounded-full text-xs font-medium
                           ${
                            v.verified
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                           }`}
                        >
                           {v.verified ? "Verified" : "Not Verified"}
                         </span>
                      </td>

                     {/* ⚙ Actions */}
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-2">

                             {!v.verified && (
                            <button
                                    onClick={(e) => {
                                e.stopPropagation();
                                handleVerify(v._id);
                              }}
                                     className="bg-green-500 hover:bg-green-600 text-white
                                      px-3 py-1.5 rounded-lg text-xs font-medium transition"
                            >
                              {actionLoading === v._id ? "..." : "Verify"}
                            </button>
                          )}

                        <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleDelete(v._id);
                            }}
                             className="bg-red-500 hover:bg-red-600 text-white
                             px-3 py-1.5 rounded-lg text-xs font-medium transition"
                          >
                            Delete
                          </button>

                    
                        </div>
                      </td>

                    </tr>
                  ))

                ) : (

                  <tr>
                     <td
                      colSpan="7"
                      className="text-center py-14 text-gray-400"
                    >
                      No visitors found
                     </td>
                  </tr>
                )}

              </tbody>

            </table>
          </div>


        </div>
      )}

       {/*  🔥 MODAL */}


      { selectedVisitor && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">

           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

             {/* Header */}
             <div className="h-32 bg-gradient-to-r from-slate-700 to-slate-900 relative">

              <button

                onClick={() => setSelectedVisitor(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-lg"
              >
                ✕
              </button>


              <div className="absolute -bottom-12 left-8">
                <img
                  src={
                     selectedVisitor.photoUrl
                      ? `${BASE_URL}${selectedVisitor.photoUrl}`
                      : `${BASE_URL}/uploads/default.png`
                  }
                   alt="visitor"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                />

              </div>

            </div>

            {/* Content */}

            <div className="pt-16 px-8 pb-8">

              <div className="flex items-start justify-between flex-wrap gap-4">

                <div>
                   <h2 className="text-2xl font-bold text-gray-800">
                    {selectedVisitor.name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {selectedVisitor.email || "No email available"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                   ${
                    selectedVisitor.verified
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {selectedVisitor.verified
                    ? "Verified"
                    : "Not Verified"}
                 </span>

              </div>

               {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="font-medium text-gray-800">
                    {selectedVisitor.phone}
                  </p>
                </div>
 
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Created By</p>
                   <p className="font-medium text-gray-800">
                    {selectedVisitor.createdBy}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">ID Type</p>
                  <p className="font-medium text-gray-800">
                     {selectedVisitor.idType || "-"}
                  </p>
                </div>

                 <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-xs  text-gray-500 mb-1" >ID Number</p>
                  <p className="font-medium text-gray-800">
                     {selectedVisitor.idNumber || "-"}
                  </p>
                </div>

              </div>

                              {/* Visitor ID */}
              <div className=" mt-5 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500  mb-1">Visitor ID</p>
                <p className="text-sm  text-gray-700 break-all">
                      {selectedVisitor._id}
                </p>
              </div>

                           {/* Date */}
              <div className="mt-5 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Created At</p>
                <p className="text-sm text-gray-700">
                  {new Date(selectedVisitor.createdAt).toLocaleString()}
                </p>
              </div>

              {/*  Buttons */}
                        <div className="flex justify-end gap-3 mt-8">

                { !selectedVisitor.verified && (
                  <button
                    onClick={() => handleVerify(selectedVisitor._id)}
                    className="bg-green-500 hover:bg-green-600 text-white
                    px-5 py-2.5 rounded-xl text-sm font-medium transition"
                  >
                     Verify  Visitor
                  </button>
                )}

                <button
                   onClick={() => handleDelete(selectedVisitor._id)}
                   className="bg-red-500 hover:bg-red-600 text-white
                  px-5 py-2.5 rounded-xl text-sm font-medium transition"
                >
                   Delete Visitor
                </button>

              </div>

            </div>

          </div>


        </div>
      )}


    </div>

  );


  
}

export default AdminVisitor;