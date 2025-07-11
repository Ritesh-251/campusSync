import React from 'react';

const DailyTimeline = () => {
  const events = [
    { time: '9:00 AM', event: 'Team Meeting' },
    { time: '11:00 AM', event: 'Project Work' },
    { time: '2:00 PM', event: 'Lunch Break' },
    { time: '4:00 PM', event: 'Presentation Prep' },
    { time: '6:00 PM', event: 'Study Group' },
  ];

  return (
    <div className="space-y-4">
      {events.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="text-[#10B981] font-semibold">{item.time}</div>
          <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
            {item.event}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyTimeline;
