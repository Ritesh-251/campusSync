import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const items = [
    { title: 'Home', icon: 'home', path: '/dashboard' },
    { title: 'Syllabus Planner', icon: 'menu_book', path: '/dashboard/syllabus-planner' },
    { title: 'Note Summarizer', icon: 'lightbulb', path: '/dashboard/note-summarizer' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-300">
        <div className="bg-[#10B981] p-2 rounded-lg">
          <span className="material-icons text-white">school</span>
        </div>
        <p className="text-2xl font-bold text-[#10B981]">CampusSync</p>
      </div>

      <div className="flex-1 px-4 py-2 space-y-2">
        {items.map((item) => (
          <Link key={item.title} to={item.path}>
            <div
              className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition ${
                location.pathname === item.path
                  ? 'bg-[#D1FAE5] text-[#10B981] font-semibold'
                  : 'text-gray-600 hover:bg-[#D1FAE5] hover:text-[#10B981]'
              }`}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="ml-4">{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
