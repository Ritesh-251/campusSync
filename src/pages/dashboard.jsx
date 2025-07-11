import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ProfileComponent from "../Components/profileComponents";
import DailyTimeline from "../Components/DailyTimeline";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
import AddEvent from "../Components/addEvent";
import Modal from "../Components/modal";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("calendar");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: data.name,
            email: data.email,
            course: data.course,
            role: data.role,
          });
        }
      }
      setLoading(false);
    };

    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const user = auth.currentUser;
      const fetched = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((e) => e.userId === user?.uid);
      setEvents(fetched);
    };

    fetchUserData();
    fetchEvents();
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const dateStr = newDate.toLocaleDateString("en-CA");
    const filtered = events.filter((e) => e.date === dateStr);
    setSelectedDateEvents(filtered);
  };

  const handleAddEvent = async (newEvent) => {
    const user = auth.currentUser;
    if (!user) return;

    const eventWithUser = { ...newEvent, userId: user.uid };
    await addDoc(collection(db, "events"), eventWithUser);
    setEvents((prev) => [...prev, eventWithUser]);
    setIsAddEventOpen(false);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] font-[Plus Jakarta Sans]">
      {/* Header */}
      <div className="hidden md:flex bg-[#F3F4F6] h-44 items-center justify-center text-[#1F2937] text-xl font-semibold">
        Dashboard
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-4 md:p-6">
        {/* Profile */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-4 -translate-y-16">
          <ProfileComponent userData={userData} />
        </div>

        {/* Calendar / Daily View */}
        <div className="md:col-span-5 bg-white rounded-2xl shadow-md p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#10B981]">
              Hi, {userData.name} 👋
            </h2>
            <p className="text-gray-600 mt-1 text-sm">{formattedDate}</p>
          </div>

          {/* Toggle */}
          <div className="mb-4 flex space-x-2">
            <button
              className={`flex-1 px-4 py-2 rounded ${
                view === "calendar"
                  ? "bg-[#10B981] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setView("calendar")}
            >
              Calendar
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded ${
                view === "daily"
                  ? "bg-[#10B981] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setView("daily")}
            >
              Daily
            </button>
          </div>

          {/* View Switch */}
          {view === "calendar" ? (
            <div className="flex flex-col items-center p-2">
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="border-none rounded-lg shadow-lg p-4 bg-[#F9FAFB]"
                tileClassName={({ date: tileDate, view }) => {
                  if (view === "month") {
                    const dateStr = tileDate.toLocaleDateString("en-CA");
                    const hasEvent = events.some((e) => e.date === dateStr);
                    const isToday =
                      tileDate.toDateString() === new Date().toDateString();

                    if (isToday)
                      return "bg-[#10B981] text-white rounded-full";
                    if (hasEvent)
                      return "bg-[#FDE68A] text-[#92400E] font-semibold rounded-full";
                  }
                  return "";
                }}
              />

              {selectedDateEvents.length > 0 && (
                <div className="mt-4 w-full">
                  <h4 className="text-md font-semibold mb-2 text-[#10B981]">
                    Events:
                  </h4>
                  <ul className="list-disc pl-5 text-gray-700 text-sm">
                    {selectedDateEvents.map((e, idx) => (
                      <li key={idx}>{e.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <DailyTimeline />
          )}
        </div>

        {/* Shortcuts */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-[#1F2937] font-bold mb-2">Key Features</h3>
          <div className="space-y-3 pt-7">
            <button
              onClick={() => navigate("/dashboard/note-summarizer")}
              className="w-full flex items-center bg-green-100 text-green-800 p-3 rounded-lg font-semibold hover:bg-green-200 transition text-sm"
            >
              <span className="material-icons mr-3">note</span>
              Note Summarizer
            </button>
            <button
              onClick={() => navigate("/dashboard/syllabus-planner")}
              className="w-full flex items-center bg-blue-100 text-blue-800 p-3 rounded-lg font-semibold hover:bg-blue-200 transition text-sm"
            >
              <span className="material-icons mr-3">list_alt</span>
              Syllabus Planner
            </button>
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="w-full flex items-center bg-yellow-100 text-yellow-800 p-3 rounded-lg font-semibold hover:bg-yellow-200 transition text-sm"
            >
              <span className="material-icons mr-3">event</span>
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        title="Add Event"
      >
        <AddEvent
          events={events}
          setEvents={setEvents}
          onSave={handleAddEvent}
        />
      </Modal>
    </div>
  );
};

export { Dashboard };
