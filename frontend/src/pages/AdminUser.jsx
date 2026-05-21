import React, { useEffect, useState } from "react";
import api from "../service.js/axios.jsx";
import endpoints from "../service.js/endPoints.jsx";

function AdminUser() 
 {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(null);

  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "EMPLOYEE",
  });


  // 🔥 Toast
  const showToast = (msg, type = "success") => {
     setToast({ msg, type });
     setTimeout(() => setToast(null), 2500);
  };

  //  🔥 Fetch Users
  const fetchUsers = async () => {
     try {
      setLoading(true);

      const res = await api.get( endpoints.ADMIN_GET_USERS );

         setUsers(res.data.users || []);
      setFilteredUsers(res.data.users || []);
    } catch {
      showToast("Failed to load users ❌", "error");
    } finally {
      setLoading(false);
    }
  };

     useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Filter Users
    useEffect(() => {
    let data = [...users];

     if (roleFilter !== "ALL") {
      data = data.filter((u) => u.role === roleFilter);
    }

     if (search) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.phone.includes(search)
      );
    }

               setFilteredUsers(data);
  }, [search, roleFilter, users]);


// ================= ADD USER =================

const handleAddUser = async () => {

  setActionLoading("add");

  try {

    // api call
    const response = await api.post(  endpoints.ADMIN_CREATE_USERS,  form);

    // new user
    const newUser =  response.data.user;
    // old users copy
    const allUsers  = [...users];
    // add new user at end
    allUsers.push(newUser);
    // update state
    setUsers(allUsers);
    // message
     showToast("User created ✅");

    // close modal
    setShowModal( false );

    // clear inputs
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "EMPLOYEE",
    });

  }

  catch (error) {

    const message  = error.response?.data?.message;

    showToast(
      message || "Failed ❌", "error"
    );
  }

  finally {
    setActionLoading(null);
  }
};

   // ================= DELETE USER =================

const handleDelete = async (id) => {

  //  asking before deleting 
  const ok = window.confirm(
    "Delete this user?"
  );

  //  if cancel then stop
  if (ok  === false) {
    return;
  }

  try {
     // start loading
    setActionLoading(id);
    // call delete api
    await api.delete(`/admin/users/${id}`
    );

    // remove  deleted user
    for (let  i =0;i < users.length;i++) {

        if (users[i]._id !== id)
         {
          updatedUsers.push(users[i]);
      }
    // update state
     setUsers(updatedUsers);
    // success message
     showToast("User deleted 🗑️");
  }
  }
  catch {
// error message
    showToast(
      "Delete failed ❌",
      "error"
    );
  }

  finally {
    // stop loading at end
    setActionLoading(null);
  }
};
  // 🔥 Status Style
      const getStatusStyle = (status) => {
    switch (status) {
       case "ACTIVE":
         return "bg-green-50 text-green-600 border border-green-100";
       default:
        return "bg-red-50 text-red-600 border border-red-100";
    }
  };


  return (
    <div className="space-y-6">

      {/* Toast  */}
      {
      toast  && (
        <div

          className={ `fixed top-5 right-5 px-4 py-2 rounded-xl shadow-lg text-white z-50 text-sm
          ${
             toast.type === "error"
              ? "bg-red-500"
              : "bg-green-500"
          }`}
        >
           {toast.msg}
        </div>
      )}

         { /* HEADER */}
      <div  className="flex flex-col  lg:flex-row lg:items-center  lg:justify-between  gap-4">

        <div>

          <h1  className="text-3xl  font-bold text-gray-800">
             Users
          </h1>

          <p  className="text-gray-500 text-sm mt-1">
             Manage employees and front desk users
          </p>

        </div>

         <button
           onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600  text-white px-5 py-2.5  rounded-xl  shadow-sm transition"
        >
          + Add User
        </button>

      </div>

      {/* FILTERS */}

        <div  className="bg-white rounded-2xl  shadow-sm border  border-gray-100 p-4">

         <div  className="flex  flex-col lg:flex-row  gap-4 lg:items-center lg:justify-between">

          {/* Search  */}

          <div className="relative w-full lg:w-80">
            <input
              type="text"
               placeholder="Search users..."
               value={search}
               onChange={(e) =>
                setSearch(e.target.value)
              }
                 className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition"
            />
          </div>


          {/* Filters */}

          <div className="flex gap-2 flex-wrap">
            {[
              "ALL",
              "EMPLOYEE",
              "FRONTDESK",
            ].map((role) => (
               <button
                key={role}
                onClick={() => setRoleFilter(role)}
                 className={` px-4 py-2  rounded-xl text-sm font-medium transition
                ${
                   roleFilter === role
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                   {role}
               </button>
               ))}
           </div>
        </div>
         </div>

                   {/* TABLE */}
    {loading ? (
         <div  className="flex  justify-center  py-16">
          < div className="w-10  h-10 border-4 border-gray-200  border-t-blue-500  rounded-full animate-spin"></div>
        </div>
      ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">


          <div  className=" overflow-x-auto">

            <table className=" w-full text-sm">

              {/* HEADER  */}
              <thead className=" bg-gray-50  text-gray-500">

                <tr>

                    <th className="p-5 text-left font-semibold">
                     User
                  </th>

                  <th className="p-5 text-left  font-semibold">
                    Contact
                  </th>
                  <th className=" p-5 text-left font-semibold">
                      Role
                  </th>

                  <th  className="p-5 text-left  font-semibold">
                     Status
                  </th>

                    <th className="p-5 text-left font-semibold">
                      Last Login
                  </th>

                  <th className="p-5 text-left font-semibold">
                    Actions
                  </th>


                </tr>

              </thead>

                {/*  BODY */}

              <tbody>

                {   filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      onClick={() => setSelectedUser(u)}
                      className="border-t border-gray-100 hover:bg-gray-50/70 cursor-pointer transition"
                    >

                      {/*  USER  */}
                       <td className="p-5">

                               <div className="flex items-center gap-3">

                          <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium  text-gray-800">
                              {u.name}
                            </p>

                            <p className="text-xs text-gray-500 ">
                               {u.email}
                            </p>
                          </div>
                          </div>
                        </td>

                      { /* CONTACT */ }
                       <td className="p-5 text-gray-600">
                        {u.phone}
                      </td>

                      {/* ROLE */}

                      <td className= "p-5">
                        <span className="px-3  py-1 rounded-full  bg-blue-50 text-blue-600 text-xs font-medium  border border-blue-100">
                          {u.role}
                        </span>
                       </td>

                      {/* STATUS */}

                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            u.status
                          )}`}
                        >

                          {u.status}

                        </span>

                      </td>

                      {/* LOGIN */}

                      < td  className="p-5 text-gray-500 text-sm">
                        {u.lastLogin
                           ? new Date(
                              u.lastLogin
                            ).toLocaleString()
                          : "Never"}
                      </td>

                       { /* ACTIONS */}
                      <td 
                         className="p-5"
                        onClick={(e) =>
                          e.stopPropagation()
                        }

                      >
                         <button
                          onClick={() =>
                             handleDelete(u._id)
                          }
                          className= "bg-red-50  hover:bg-red-100 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          { actionLoading === u._id
                            ? "..."
                            : "Delete"}
                         </button>
                       </td>
                     </tr>
                  ))
                )  : (
                  <tr>

                    <td
                       colSpan="6"
                      className="text-center p-12 text-gray-400"
                    >
                       No users found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </div>
      )}

      {/* ADD USER MODAL */  }
      { showModal  && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" >

            { /* HEADER */ }
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add User
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create a new system user

                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg"
              >
              
                ✕

              </button>
            </div>

            {/* FORM */}

            <div className="p-6 space-y-4">


              <input
                placeholder="Full Name"
                 value={form.name}
                 onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition"
              />

               <input
                placeholder="Email Address"
                 value={form.email}
                 onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition"
              />

              <input
                 placeholder="Phone Number"
                value={form.phone}
                 onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition"
              />

               <input
                type="password"
                 placeholder="Password"
                 value={form.password}
                 onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition"
              />

               <select
                value={form.role}
                onChange={(e) =>
                   setForm({
                    ...form,
                    role: e.target.value,
                  })
                }

                className="w-full border  border-gray-200  rounded-xl px-4 py-3 text-sm  outline-none focus:border-blue-400 transition "
              >
                <option value=" EMPLOYEE">
                  EMPLOYEE
                </option>

                <option value=" FRONTDESK">
                  FRONTDESK
                </option>
              </select>

              { /* BUTTONS */  }
              <div className="flex justify-end gap-3 pt-2">


                <button
                  onClick={() =>
                    setShowModal(false)

                  }
                  className =" px-4 py-2  rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel

                </button>

                <button

                   onClick={handleAddUser}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition shadow-sm"
                >
                  {actionLoading === "add"
                    ? "Creating..."
                    : "Add User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAIL MODAL */}


      {selectedUser  &&  (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">

          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

            {/* TOP */}
            <div className=" bg-gradient-to-r from-blue-500 to-indigo-500 h-28 relative ">

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className=" absolute top-4 right-5 text-white text-lg"
              >
                ✕
              </button>

              <div  className="absolute -bottom-10 left-6 flex items-end gap-4">

                <div className="w-20 h-20 rounded-full bg-white  text-blue-600 flex items-center  justify-center text-3xl font-bold border-4 border-white shadow-lg">
                  {selectedUser.name
                     ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div className="pb-2 text-white">
                  <h2 className="text-2xl font-bold">
                    {selectedUser.name}
                  </h2>

                  <p className="text-sm text-blue-100">
                     {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="pt-16 px-6 pb-6 ">


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm ">

                <div className="bg-gray-50  rounded-2xl p-4 border border-gray-100">
                  <p className="text-gray-400  text-xs mb-1">
                     Phone
                  </p>

                  <p className="font-medium text-gray-800">
                     {selectedUser.phone}
                   </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-gray-400 text-xs mb-1">
                    Role
                   </p>


                  <p className="font-medium text-gray-800">
                    {selectedUser.role}
                   </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">


                   <p className="text-gray-400 text-xs mb-1">
                    Status
                   </p>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status}
                   </span>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">

                  <p className="text-gray-400 text-xs mb-1">
                     User ID
                   </p>

                  <p className="font-medium text-gray-700 break-all">
                     {selectedUser._id}
                     </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                   <p className="text-gray-400 text-xs mb-1">
                    Created At
                           </p>
 
                  <p className="font-medium text-gray-700">
                    {new Date(
                      selectedUser.createdAt
                    ).toLocaleString()}
                          </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-gray-400 text-xs mb-1">
                    Last Login
                     </p>

                   <p className="font-medium text-gray-700">

                          {selectedUser.lastLogin
                      ? new Date(
                          selectedUser.lastLogin
                        ).toLocaleString()
                      : "Never"}
                  </p>
                          </div>
              </div>

              {/*  FOOTER */}
              <div  className="flex justify-end mt-6">


                <button
                   onClick={() =>
                     handleDelete(selectedUser._id)
                  }
                 
                  className = "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-5 py-2 rounded-xl transition"
                >
                  Delete User

                </button>
              </div>


            </div>
          </div>

        </div>
      )}
    </div>
  );


}


export default AdminUser;