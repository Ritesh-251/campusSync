import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/sidebar'; // Sidebar component
import BottomNav from '../Components/bottomnav'; // Move bottom nav into separate component

const DashboardLayout = () => {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-300">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;
