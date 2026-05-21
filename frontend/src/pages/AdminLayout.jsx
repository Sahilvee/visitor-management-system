import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";


function AdminLayout() {


  const navigate = useNavigate();

    // 🔥 Logout Function
  const  handleLogout = () => {

     // remove stored data
    sessionStorage.removeItem("token");
     localStorage.removeItem("USER");

     // redirect to login
     navigate("/");
  };

  return (
      <div className="flex h-screen bg-gray-100">

                  {/* Sidebar */}
      <div  className="w-64 bg-gray-900  text-white flex flex-col" >

        <h1  className = "text-2xl font-bold p-6 border-b border-gray-700 "  >
           Admin Panel
        </h1 >

        <nav  className="flex flex-col p-4 gap-3 flex-1">

          < Link
             to="/admin_dashboard"
              className="hover:bg-gray-700 p-3 rounded-xl transition"
          >
             Dashboard
          </Link>

        <Link
             to="/admin_dashboard/appointments"
                className="hover:bg-gray-700 p-3 rounded-xl transition"
          >
              Appointments
        </Link>

        <Link
              to="/admin_dashboard/visitors"
                     className="hover:bg-gray-700 p-3 rounded-xl transition"
          >
              Visitors
          </Link>

          <Link

               to="/admin_dashboard/users"
                 className="hover:bg-gray-700 p-3 rounded-xl transition"
          >
               Users
         </Link>

        </nav>

        {/* 🔥 Logout Button */}
        <div  className=" p-4  border-t border-gray-700 ">

          < button
             onClick={handleLogout}
           className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition"
          >
            Logout

            </button>

        </div>
           </div>

      { /* Main Content */ }
      
      <div className="flex-1 flex flex-col">


        { /*  Header */}

        < div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center ">

          < h2 className="text-xl font-semibold text-gray-800 " >
              Admin Dashboard
          </h2>

          < div className="flex items-center gap-3">

            < span  className = " text-gray-600  font-medium">
                 Admin
             </span>

            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow">
               A
              </div>

              </div>

           </div>

               {/* Dynamic Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />

        </div>

      </div>


    </div>
  );

  
}

export default AdminLayout;