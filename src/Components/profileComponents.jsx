import React from "react";

const ProfileComponent = ({ userData }) => {
  if (!userData || !userData.name) {
    return (
      <div className="bg-white border border-[#D1D5DB] rounded-2xl shadow p-6 w-full text-center">
        <p className="text-gray-500">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-2xl shadow p-6 w-full">
      <div className="flex flex-col items-center">
        <div className="bg-[#10B981] rounded-full p-4">
          <span className="material-icons text-white text-3xl">account_circle</span>
        </div>
        <h3 className="mt-4 text-[#1F2937] font-bold text-lg">{userData.name}</h3>
        <p className="mt-1 text-[#4B5563] text-sm">{userData.role}</p>
        <p className="mt-1 text-[#4B5563] text-sm">{userData.course}</p>
        <p className="mt-1 text-[#4B5563] text-sm break-words text-center">
          {userData.email}
        </p>
      </div>
    </div>
  );
};

export default ProfileComponent;
