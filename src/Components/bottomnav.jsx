const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
      <NavItem icon="home" label="Home" active />
      <NavItem icon="groups" label="Meetings" />
      <NavItem icon="settings" label="Settings" />
    </nav>
  );
};

const NavItem = ({ icon, label, active = false }) => {
  return (
    <div
      className={`flex flex-col items-center ${
        active ? 'text-[#10B981]' : 'text-gray-600'
      }`}
    >
      <span className="material-icons">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

export default BottomNav;
