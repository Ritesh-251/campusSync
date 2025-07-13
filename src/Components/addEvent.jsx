import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const AddEvent = ({ userRole }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  // ❌ If Student, block access
  if (userRole !== "Organizer" && userRole !== "Teacher") {
    return (
      <div className="text-center text-red-600 text-sm">
        Only organizers or teachers can add events.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !title || !date || !selectedCourse) return;

    const eventData = {
      title,
      date,
      description,
      reminder,
      createdAt: new Date().toISOString(),
      createdByUID: user.uid,
      forCourse: selectedCourse,
    };

    try {
      await addDoc(collection(db, 'events'), eventData);
      console.log("Event added for course:", selectedCourse);
    } catch (error) {
      console.error("Error adding event:", error);
    }

    // Reset
    setTitle('');
    setDate('');
    setDescription('');
    setReminder(false);
    setSelectedCourse('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded resize-none"
        rows={3}
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={reminder}
          onChange={(e) => setReminder(e.target.checked)}
        />
        <span className="text-sm text-gray-700">Set reminder</span>
      </label>

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Course</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Electronics">Electronics</option>
        <option value="Mechanical">Mechanical</option>
        <option value="Civil">Civil</option>
        <option value="Other">Other</option>
      </select>

      <button
        type="submit"
        className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
      >
        Add Event
      </button>
    </form>
  );
};

export default AddEvent;
