import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service.js/axios.jsx";
import endpoints from "../service.js/endPoints.jsx";

function BookingAppointment() {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hostId: "",
    email: "",
    visitPurpose: "",
    duration: "30",

  });

  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [loading, setLoading] = useState(false);

  // POPUP

  const [popup, setPopup] =  useState({
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


    setTimeout(() => {

      setPopup({
        show: false,
        type: "",
        message: "",
      });

    }, 3000);
  };

  // FETCH EMPLOYEES

  useEffect( () =>  {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

     fetchUsers();
  }, []);

  // FETCH BOOKED SLOTS

  useEffect( () => {
    if ( !selectedDate || !formData.hostId) return;

     const fetchSlots = async () => {
      try {
        const res = await api.get(
          `${endpoints.SLOT_DETAILS}/${formData.hostId}?date=${selectedDate}`
        );

        setSlots(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSlots();
  }, [selectedDate, formData.hostId]);

  // HANDLE CHANGE
  const handleChange =  (e) => {
    setFormData({

      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // GENERATE TIME SLOTS

  const generateSlots =  () => {
    const times = [];

    const startHour = 9;

    const endHour = 18;

    for (let h = startHour; h < endHour; h++) {
      for (let m of [0, 30]) {
        const time = `${h
          .toString()
          .padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
         times.push(time);
      }
    }

    return times;
  };

             // CHECK BOOKED SLOT
  const isSlotBooked = (slot) => {
    return slots.some((s) => {
         const slotDate = new Date(
        `${selectedDate}T${slot}`
         );

      const start = new Date(s.visitDate);
       const end = new Date(s.endTime);

      return (
        slotDate >= start &&
         slotDate < end
      );
    });
  };

  // CHECK PAST SLOT
  const isPastTime = (slot) => {
     if (!selectedDate) return false;

    const now = new Date();

    const selected = new Date(
       `${selectedDate}T${slot}`
    );

    return selected < now;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot) {
       showPopup(
        "error",
        "Please select date and slot"
      );
      return;
    }

    const finalDateTime = new Date(
       `${selectedDate}T${selectedSlot}`
    );

    try  {
      setLoading(true);

      //  FINAL BACKEND CHECK
      const check = await api.post(
         endpoints.CHECK_SLOT,
        {
          hostId: formData.hostId,
          visitDate: finalDateTime,
          duration: Number(formData.duration),
        }
      );

      if  (!check.data.available) {
        showPopup(
          "error",
          "Slot already booked ❌"
        );
         return;
      }

       //  SEND OTP
      const otpRes = await api.post(
        endpoints.SEND_OTP,
        {
          email: formData.email,
           type: "appointment",
        }
      );

      showPopup(
        "success",
         otpRes.data.message ||
           "OTP sent successfully ✅"
      );

      setTimeout(() => {
         navigate("/otp", {
           state: {
             formData: {
               ...formData,
              visitDate: finalDateTime,
            },
            type: "appointment",
          },
        });
      },  1200);

    } catch (err) {
       console.error(err);

       showPopup(
        "error",
         err.response?.data?.message ||
          "Something went wrong ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">

       {/* BACKGROUND */}

      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-black/10"></div>

       {/* POPUP */}

      {popup.show && (
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

                 {/* CONTENT */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-12 min-h-screen flex items-center">

        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* LEFT */}
          <div className="text-white">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-5 py-2 text-sm mb-8">
              Smart Appointment Booking
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Book Your
              <span className="block text-blue-200">
                Appointment
              </span>

            </h1>

            <p className="mt-8 text-lg text-blue-100 leading-relaxed max-w-2xl">
              Schedule secure appointments with
              employees, choose available slots,
              and receive instant OTP verification.

            </p>

                           {/* FEATURES */}
            <div className="grid grid-cols-3 gap-4 mt-12">

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-center">
                <h2 className="text-2xl font-bold">
                  Easy
                </h2>

                <p className="text-sm text-blue-100 mt-2">
                  Fast Booking
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-center">
                <h2 className="text-2xl font-bold">
                  Live
                </h2>

                <p className="text-sm text-blue-100 mt-2">
                  Slot Checking
                </p>
              </div>


              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-center">
                <h2 className="text-2xl font-bold">
                  OTP
                </h2>
                <p className="text-sm text-blue-100 mt-2">
                  Secure Access
                </p>
              
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <form
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[36px] p-8 lg:p-10 shadow-2xl"
            >

              { /* HEADER */}
              <div className="mb-8">

                  <h2 className="text-4xl font-bold text-white">
                  Book Appointment
                </h2>

                <p className="text-blue-100 mt-3">
                   Fill in the appointment details
                </p>

              </div>

               <div className="space-y-5">

                 {/* HOST */}
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                     Select Employee
                  </label>

                  <div className="relative">
                    <select
                       name="hostId"
                      value={formData.hostId}
                      onChange={handleChange}
                       className="w-full appearance-none bg-white/10 border border-white/20 text-white rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                       required
                    >
                      <option
                         value=""
                         className="bg-slate-900 text-white"
                      >
                         Select Employee
                      </option>

                      { users.map((u) => (
                        <option
                          key={u._id}
                          value={u._id}
                          className="bg-slate-900 text-white"
                        >
                           {u.name}
                        </option>
                      ))}
                    </select>

                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none">
                       ▼ 
                    </div>
                 
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                     Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                     value={formData.email}
                     onChange={handleChange}
                     placeholder="Enter your email"
                     className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-100/70 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                     required
                  />
                </div>

                {/* PURPOSE */}

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Visit Purpose
                  </label>

                  <input
                    type="text"
                     name="visitPurpose"
                    value={formData.visitPurpose}
                     onChange={handleChange}
                    placeholder="Purpose of visit"
                     className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-100/70 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                     required
                  />
                </div>

                {/* DATE */}
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Select Date
                   </label>

                  <input
                    type="date"
                    value={selectedDate}
                    min={
                       new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) => {
                       setSelectedDate(
                        e.target.value
                      );
                      setSelectedSlot("");
                    }}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                    required
                  />
                </div>

                {/* SLOT */}

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                     Select Time Slot
                  </label>

                  <div className="relative">
                     <select
                      value={selectedSlot}
                       onChange={(e) =>
                        setSelectedSlot(
                          e.target.value
                        )
                      }
                       className="w-full appearance-none bg-white/10 border border-white/20 text-white rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                       required
                    >
                      <option
                        value=""
                        className="bg-slate-900 text-white"
                      >
                        Select Slot
                      </option>

                      { generateSlots().map(
                        (slot) => {
                           const  booked =
                            isSlotBooked(slot);

                          const past =
                            isPastTime(slot);

                             const disabled =
                            booked || past;

                          return (
                            <option
                              key={slot}
                               value={slot}
                              disabled={disabled}
                              className="bg-slate-900 text-white"
                            >
                              {slot}{" "}
                              {booked
                                 ? "❌ Booked"
                                  : past
                                ? "⏳ Passed"
                                 : "✅ Available"}
                            </option>

                          );
                        }
                      )}
                    </select>

                    <div  className=" absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>

                {/* DURATION */}
                <div>
                   <label className="block  text-sm  font-medium text-blue-100 mb-2">
                     Duration
                  </label>


                  <div className="relative">
                     <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full appearance-none bg-white/10 border border-white/20 text-white rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
                    >
                       <option
                        value="15"
                        className="bg-slate-900 text-white"
                      >
                        15 Minutes
                       </option>

                      <option
                         value="30"
                        className="bg-slate-900 text-white"
                      >
                        30 Minutes
                       </option>

                      <option
                         value="45"
                        className="bg-slate-900 text-white"
                      >
                         45 Minutes
                      </option>

                      <option
                        value="60"
                         className="bg-slate-900 text-white"
                      >
                         1 Hour
                      </option>
                    </select>

                    <div  className="absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                <button 
                   type="submit"
                  disabled={loading}
                  className="w-full bg-white  text-indigo-700 hover:bg-blue-50 py-4 rounded-2xl  font-semibold transition-all duration-200 shadow-lg hover:scale-[1.02]"
                >
                  {loading 
                    ? "Processing..."
                    : "Book Appointment"}
                </button>


              </div>

            </form>

          </div>
        </div>


      </div>


    </div>
  );
}

export default BookingAppointment;