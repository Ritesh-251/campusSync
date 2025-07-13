import React, { useState, useMemo } from 'react';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';

const DailyTimeline = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, selectedDate);
      })
      .sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
  }, [events, selectedDate]);

  const handlePrevDay = () => setSelectedDate((prev) => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate((prev) => addDays(prev, 1));

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePrevDay}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          ⬅ Previous
        </button>
        <div className="font-semibold text-gray-700">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </div>
        <button
          onClick={handleNextDay}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Next ➡
        </button>
      </div>

      {/* Event List */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="text-[#10B981] font-semibold">
                {item.time || 'All Day'}
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                <div className="font-medium">{item.title}</div>
                {item.description && (
                  <div className="text-sm text-gray-600">{item.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No events for this day.</p>
      )}
    </div>
  );
};

export default DailyTimeline;
