import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { icon: "home", label: "Home", path: "/dashboard" },
    { icon: "menu_book", label: "Planner", path: "/dashboard/syllabus-planner" },
    { icon: "lightbulb", label: "Summarizer", path: "/dashboard/note-summarizer" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 flex justify-around py-2 z-50 md:hidden">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => handleNavigate(item.path)}
          className={`flex flex-col items-center text-xs transition-colors duration-150 ${
            location.pathname === item.path ? "text-emerald-500" : "text-gray-500 hover:text-emerald-600"
          }`}
        >
          <span className="material-icons text-[22px]">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
