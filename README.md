# 🌿 CampusSync – Your Smart Campus Companion

**CampusSync** is a responsive, modern student dashboard designed to centralize and streamline key academic tasks for college students, organizers, and faculty. It blends calendar-based planning, smart note tools, and a user-friendly interface to help users stay organized, informed, and productive throughout the semester.

---

## 🚀 Features

- ✅ **Role-Based Access**  
  - **Students**: Access note summarizer, syllabus planner, view academic events.  
  - **Organizers/Teachers**: Create and assign events for specific courses.

- 📅 **Smart Calendar View**  
  - Powered by [FullCalendar.io](https://fullcalendar.io)  
  - Monthly and daily views, event popups, and reminder toggles.

- ✍️ **Note Summarizer**  
  - AI-assisted note summarization to speed up revision using uploaded content.

- 🗂️ **Syllabus Planner**  
  - Upload syllabus (PDF or text)  
  - Get a structured AI-powered study plan based on your available study hours  
  - Events can later be saved into your calendar.

- 👤 **Profile Completion Flow**  
  - New users must complete their profile (name, course, role) before dashboard access.  
  - Smooth onboarding and profile-driven dashboard experience.

- 🔒 **Protected Routes**  
  - Access control using Firebase Authentication + Firestore profile status.

- 📱 **Fully Responsive UI**  
  - **Desktop**: Sidebar navigation  
  - **Mobile**: Header + sticky bottom nav, touch-friendly buttons

---

## ⚙️ Tech Stack

- **Frontend**: React, Tailwind CSS  
- **Backend/Database**: Firebase Auth, Firestore  
- **Calendar**: FullCalendar.io  
- **AI Integration**: Gemini / GPT (Note Summarizer, Syllabus Planner)  
- **Routing & Auth**: React Router DOM + Protected Routes

---

## 📌 Use Cases

- 📚 Students: Organize lectures, deadlines, study plans  
- 👨‍🏫 Teachers: Schedule and manage department-specific events  
- 🧑‍💼 Organizers: Broadcast campus-wide events for targeted courses

---

## 🧭 Access Flow

1. User logs in (anonymous or Google).
2. If first-time → Redirected to `/complete-profile`.
3. On profile completion → Redirected to `/dashboard`.
4. Role determines access level and features.

---

## 🛠️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/your-username/campussync.git
cd campussync

# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
