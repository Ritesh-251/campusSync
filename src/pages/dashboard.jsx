import React, { useState, useEffect } from "react";
import ProfileComponent from "../Components/profileComponents";
import DailyTimeline from "../Components/DailyTimeline";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AddEvent from "../Components/addEvent";
import Modal from "../Components/modal";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BottomNav from "../Components/bottomnav";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("calendar");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          setLoading(false);
          return;
        }

        const userInfo = userDocSnap.data();
        setUserData(userInfo);

        const uidEventsQuery = query(
          collection(db, "events"),
          where("forUID", "==", user.uid)
        );

        const courseEventsQuery = query(
          collection(db, "events"),
          where("forCourse", "==", userInfo.course)
        );

        const [uidSnap, courseSnap] = await Promise.all([
          getDocs(uidEventsQuery),
          getDocs(courseEventsQuery),
        ]);

        const allEvents = [...uidSnap.docs, ...courseSnap.docs].map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            date: data.date,
            description: data.description || "",
            reminder: data.reminder || false,
          };
        });

        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching user/events:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] font-[Plus Jakarta Sans]">
      {/* Mobile Header */}
     <header className="md:hidden sticky top-0 bg-white shadow-sm z-20 px-4 py-3 flex justify-between items-center">
  <h1 className="text-xl font-bold text-gray-800">CampusSync</h1>
  <div className="flex items-center space-x-4">
    <button
      className="text-gray-600 hover:text-emerald-500"
      onClick={() => navigate("/dashboard/settings")}
    >
      <span className="material-icons">settings</span>
    </button>
    <button
      className="text-gray-600 hover:text-emerald-500"
      onClick={async () => {
        try {
          await auth.signOut();
          navigate("/login");
        } catch (error) {
          console.error("Logout Error:", error.message);
        }
      }}
    >
      <span className="material-icons">logout</span>
    </button>
  </div>
</header>

      {/* Main Scrollable Content */}
      <main className="flex-grow overflow-y-auto pb-24 md:pb-0">
        {/* Desktop Header */}
        <div className="hidden md:flex bg-[#F3F4F6] h-44 items-center justify-center text-[#1F2937] text-xl font-semibold">
          Dashboard
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-4 md:p-6">
          {/* Profile */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6 -translate-y-16 self-start">
            <ProfileComponent userData={userData} />
          </div>

          {/* Calendar or Daily View */}
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

            {/* Conditional View */}
            {view === "calendar" ? (
              <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={events.map((e) => ({
                    title: e.title,
                    date: e.date,
                    color: "#10B981",
                  }))}
                  height="auto"
                  eventClick={(info) => {
                    const matched = events.find(
                      (e) =>
                        e.title === info.event.title &&
                        e.date === info.event.startStr
                    );
                    if (matched) setSelectedEvent(matched);
                  }}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek",
                  }}
                />
              </div>
            ) : (
              <DailyTimeline events={events} />
            )}
          </div>

          {/* Key Features */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow-md p-4 self-start">
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
      </main>

      {/* Bottom Nav */}
      <BottomNav />

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        title="Add Event"
      >
        <AddEvent />
      </Modal>

      {/* Event Details Modal */}
      <Modal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className="space-y-2">
            <p>
              <strong>Title:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedEvent.description || "No description"}
            </p>
            <p>
              <strong>Reminder:</strong>{" "}
              {selectedEvent.reminder ? "Yes" : "No"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export { Dashboard };
