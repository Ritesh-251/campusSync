import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
// ✅ Tailwind-aligned calendar styles

const FullCalendarView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) return;

      const userData = userDocSnap.data();

      const userEventsQuery = query(
        collection(db, "events"),
        where("forUID", "==", user.uid)
      );

      const courseEventsQuery = query(
        collection(db, "events"),
        where("forCourse", "==", userData.course)
      );

      const [userEventsSnap, courseEventsSnap] = await Promise.all([
        getDocs(userEventsQuery),
        getDocs(courseEventsQuery),
      ]);

      const allEvents = [...userEventsSnap.docs, ...courseEventsSnap.docs].map(
        (doc) => {
          const data = doc.data();
          return {
            title: data.title,
            date: data.date,
            id: doc.id,
          };
        }
      );

      setEvents(allEvents);
    };

    fetchEvents();
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white overflow-hidden">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "", // ⛔ No week/day toggles
        }}
        eventClassNames={() =>
          "bg-emerald-100 text-emerald-700 text-sm font-medium px-2 py-1 rounded-md border border-emerald-200"
        }
        dayCellDidMount={(info) => {
          if (info.isToday) {
            info.el.classList.add("bg-emerald-50", "rounded-lg");
          } else {
            info.el.classList.add(
              "hover:bg-gray-100",
              "cursor-pointer",
              "rounded-lg",
              "transition"
            );
          }
        }}
      />
    </div>
  );
};

export default FullCalendarView;
