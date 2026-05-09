import React, { useEffect, useMemo, useState } from "react";
import api from "../service.js/axios.jsx";
import endpoints from "../service.js/endPoints.jsx";

function Dashboard() 
 {
  const  [stats, setStats]  = useState({
     total: 0,
     pending: 0,
    approved: 0,
    rejected: 0,

  });

   const [appointments, setAppointments] = useState([]);
   const [loading, setLoading] = useState(true);

           // FILTERS
   const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

   const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
         case "PENDING":
          return "bg-yellow-100 text-yellow-700 border border-yellow-200";

       case "APPROVED":
        return " bg-green-100 text-green-700  border border-green-200 ";

      case "REJECTED":
        return "bg-red-100 text-red-700 border border-red-200 ";


      case "CHECKED_IN":
        return " bg-blue-100 text-blue-700 border border-blue-200";

      case " CHECKED_OUT":
         return " bg-purple-100  text-purple-700 border border-purple-200";

      default:
        return " bg-gray-100  text-gray-700 border  border-gray-200";
    }

  };

 useEffect(() => {
     const  fetchData =  async  () => {

      try {

        setLoading(true);

        const res = await api.get(
           endpoints.ADMIN_APPOINTMENT
        );

       const data = res.data?.stats || {};

      setStats({
          total: data.total || 0,
 pending: data.pending || 0,
          approved: data.approved || 0,
          rejected: data.rejected || 0,
        });

         setAppointments(
           res.data?.appointments || []
        );
      }  catch (err) 
       {
         console.log(
          "Error fetching dashboard:",
           err
        );
      }  finally
       {
        
        setLoading(false);
      }
    };

   
    fetchData();
  }, []);

        // FILTERED APPOINTMENTS
  const  filteredAppointments = useMemo(() => {
      return appointments.filter((item) => {
        const visitor =
        item.visitorId?.name?.toLowerCase() || "";
      const host =
        item.hostId?.name?.toLowerCase() || "";
 

      const tracking =
        item.trackingId?.toLowerCase() || "";

    
        const matchesSearch =
        visitor.includes(search.toLowerCase()) ||
        host.includes(search.toLowerCase()) ||
        tracking.includes(search.toLowerCase());

     const matchesStatus =
        statusFilter === "ALL"
          ? true
          : item.status === statusFilter;

      
          return matchesSearch && matchesStatus;
    });
  }, 
  [appointments, search, statusFilter]);

if (loading) {
     
  return (
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white px-8 py-6 rounded-2xl shadow-lg">

          <p className="text-gray-600 text-lg">
            Loading Dashboard...
          </p>
        </div>

      </div>
    );
  }

  return (
     <div className="min-h-screen bg-gray-100 p-6">

                 { /* HEADER */}
      <div  className = "  flex flex-col md:flex-row md:items-center  md:justify-between  mb-8 gap-4">
        
        <div> 
           <h1 className="text-4xl font-bold text-gray-800">
             Admin Dashboard
            </h1>

           <p className=" text-gray-500  mt-1">
             Monitor appointments and visitors
            </p>
      </div>

        <button
           onClick={() =>  window.location.reload() }
           className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-md transition"
        >
           Refresh Dashboard
         </button>
    </div>

                   { /* STATS */     }
      <div  className="grid grid-cols-1  sm:grid-cols-2  xl:grid-cols-4  gap-6 mb-8" >

        {/* TOTAL */ }

        <div  className="bg-white rounded-3xl shadow-md overflow-hidden">
          
          <div  
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-5 text-white">
            <p className="opacity-80 text-sm">
               Total Appointments
               </p>

           <h2 className="text-4xl font-bold mt-2">
               {stats.total}
              </h2>
        </div>

        <div className="p-4 text-gray-500 text-sm">
             All appointment records
        </div>
          </div>

   {/* PENDING */}
<div className="bg-white rounded-3xl shadow-md overflow-hidden">
          
               <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-5 text-white">
          <p className="opacity-80 text-sm">
               Pending
              </p>

          <h2 className="text-4xl font-bold mt-2">
                {stats.pending}
                 </h2>
                   
          </div>

          <div  className= " p-4 text-gray-500 text-sm">
              Waiting for approval
          </div>

        </div>

        { /*  APPROVED  */}

        < div className="bg-white rounded-3xl shadow-md overflow-hidden">
          
          <div  className="bg-gradient-to-r from-green-500 to-green-600 p-5 text-white ">
            <p className="opacity-80 text-sm" >
              Approved

            </p>

            < h2  className="text-4xl font-bold mt-2">
               { stats.approved}
             </h2>
             </div>

           <div className ="p-4 text-gray-500 text-sm">
            Successfully approved
                 </div>
        </div>

        {/* REJECTED */ }
        <div  className = "bg-white rounded-3xl shadow-md overflow-hidden">
          
          <div  className="bg-gradient-to-r from-red-500 to-red-600 p-5 text-white">
            <p  className="opacity-80 text-sm">
              Rejected 

            </p>

            <h2 className="text-4xl font-bold mt-2">
               { stats.rejected 
               }
            </h2>


          </div>

          <div className="p-4 text-gray-500 text-sm">
            Rejected requests
          </div>
         </div>


      </div>

               {/*   FILTER SECTION */ }
      <div  className=" bg-white rounded-3xl  shadow-md p-5 mb-8">
        
        <div  className=" flex flex-col lg:flex-row gap-4">

          {/*   SEARCH */}
          <input
            type="text"
             placeholder="Search visitor, host or tracking ID..."
             value={search}
             onChange={(e) =>
              setSearch(e.target.value)
             }
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        { /*  STATUS */ }
          <select

            value={statusFilter}
                onChange={(e) =>
              setStatusFilter(e.target.value)
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

          <option  value="REJECTED">
              Rejected
              </option>

          <option value="CHECKED_IN" >
                Checked In
            </option>

            <option value= "CHECKED_OUT">
              Checked Out
              </option>
          </select>
        </div>
      </div>

      {  /* TABLE  */}
      <div  className="bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* TABLE  HEADER */}
         <div className ="p-6 border-b flex items-center justify-between">
          
          <div>
            <h3   className=" text-2xl  font-bold text-gray-800">
              Recent Appointments
             </h3>

               <p className="text-gray-500 text-sm mt-1">
              Showing {filteredAppointments.length}   appointments
             </p>
          </div>
                 </div>

        {/* TABLE  */}

        <div className="overflow-x-auto">


          < table className="w-full">

            < thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr >
                <th  className= " p-5 text-left ">
                  Tracking ID 

                </th>

                < th className="p-5 text-left">
                   Visitor
                </th >

                < th className="p-5 text-left">
                   Host
                </th >

                < th className="p-5 text-left">
                   Date & Time
                </th >

               
                <th className="p-5 text-left">
                  Status
                </th>
              </tr >
            </thead >

            <tbody >
              { 
               filteredAppointments.length > 0 ? (
                   filteredAppointments.map(
                         (item, index) => (
                    <tr

                       key={index}
                     className="border-b hover:bg-gray-50 transition"
                    >
                      
                          {/*  TRACKING */ }
                      <td className= " p-5 ">
                        <  span className = " font-semibold text-indigo-600">
                           { item.trackingId }
                         </span>
                      </td>

                      { /* VISITOR */ }
                      < td className="p-5">
                        < div>
                          < p className=" font-medium  text-gray-800">
                            { item.visitorId?.name ||
                              "Unknown Visitor" }
                         
                          </p>

                           <p  className= " text-sm  text-gray-500">
                                 {item.visitorId?.email}

                          </p>

                        </div>


                      </td>

                               {/*   HOST */}
                       < td  className="p-5">
                        <div>
                          <p  className=" font-medium text-gray-800">
                            { item.hostId?.name ||
                              "Unknown Host" }
                            </p>

                           <p className = "text-sm text-gray-500">
                             {item.hostId?.email}
                          </p>
                         </div>

                      </td>

                          {/* DATE */}
                      <td 
                      className="p-5 text-gray-600">
                         { item.visitDate &&
                        item.endTime ? (
                           <div>
                              <p>
                              {new Date(
                                item.visitDate
                              ).toLocaleDateString()}
                            </p>

                              <p className = "text-sm text-gray-500">
                              { new Date (
                                item.visitDate
                              ).toLocaleTimeString()}{" "}
                              -
                              {" "}
                               {new Date(
                                item.endTime
                               ).toLocaleTimeString()}
                             </p>
                       </div>
                        )  :  item.visitDate ? (
                           new Date(
                             item.visitDate
                          ).toLocaleString()
                        ) : (
                          "N/A"
                        )}
                      
                      </td>

                           {/* STATUS */}
                      <td className="p-5">
                        <span
                          className={ `px-4 py-2 rounded-full text-xs font-bold ${getStatusStyle(
                             item.status
                          )}` }
                        >
                          { item.status || "UNKNOWN" }
                         </span>
                       </td>

                     </tr>
                  )

                )
              ) : (
                 <tr>
                    <td
                     colSpan="5"
                    className=" text-center  py-10  text-gray-400"
                  >
                      No appointments found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>


    </div>
  );

}


export default Dashboard;