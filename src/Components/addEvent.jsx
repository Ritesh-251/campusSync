import React, { useState } from 'react';

const AddEvent = ({ events, setEvents }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleAddEvent = () => {
    if (!title || !date) return;
    setEvents([...events, { title, date }]);
    setTitle('');
    setDate('');
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleAddEvent}
        className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
      >
        Add Event
      </button>
    </div>
  );
};

export default AddEvent;
