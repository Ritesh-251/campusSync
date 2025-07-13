import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate('/');
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const mainItems = [
    { title: 'Home', icon: 'home', path: '/dashboard' },
    { title: 'Syllabus Planner', icon: 'menu_book', path: '/dashboard/syllabus-planner' },
    { title: 'Note Summarizer', icon: 'lightbulb', path: '/dashboard/note-summarizer' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Top Logo */}
      <div className="p-6 flex items-center space-x-3 border-b border-gray-300">
        <div className="bg-[#10B981] p-2 rounded-lg">
          <span className="material-icons text-white">school</span>
        </div>
        <p className="text-2xl font-bold text-[#10B981]">CampusSync</p>
      </div>

      {/* Main Links */}
      <div className="flex-1 px-4 py-4 space-y-2">
        {mainItems.map((item) => (
          <Link key={item.title} to={item.path}>
            <div
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer ${
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

      {/* Bottom: Settings + Logout */}
      <div className="px-4 py-4 space-y-2 border-t border-gray-200">
        {/* Settings */}
        <Link to="/dashboard/settings">
          <div className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-[#F3F4F6] hover:text-[#10B981] transition">
            <span className="material-icons">settings</span>
            <span className="ml-4">Settings</span>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-red-700 hover:bg-red-100 transition focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Logout"
        >
          <span className="material-icons">logout</span>
          <span className="ml-4">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
