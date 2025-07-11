🎓 CampusSync
CampusSync is a student-focused productivity web app designed to simplify campus life and help students stay organized with ease. It provides essential tools such as event tracking, syllabus planning, and note summarization — all in one place.

🚀 Features
✅ Personal Dashboard: Overview of your profile, key dates, and shortcuts.

📅 Calendar with Events: Add and track events. Days with events are auto-highlighted.

📝 Note Summarizer: Quickly summarize your study notes using AI.

📋 Syllabus Planner: Upload your syllabus and plan your study sessions effectively.

🔐 Firebase Authentication: Secure login and user data handling.

☁️ Cloud Storage: All events and data are stored securely in Firebase.

🔗 Tech Stack
React + Vite (Frontend)

Tailwind CSS (Styling)

Firebase (Auth, Firestore, Hosting)

React Router DOM (Routing)

Recoil (State Management — optional, for later scalability)

📂 Folder Structure (Simplified)
css
Copy
Edit
src/
│
├── Components/    → Reusable UI Components (Sidebar, Profile, Calendar, etc.)
├── pages/         → Main Pages (Dashboard, Note Summarizer, Syllabus Planner, etc.)
├── firebaseConfig/→ Firebase Setup
├── App.jsx        → Routes Setup
└── main.jsx       → App Entry Point
🛠️ Setup Instructions
Clone the repo:

bash
Copy
Edit
git clone https://github.com/yourusername/campussync.git
cd campussync
Install dependencies:

bash
Copy
Edit
npm install
Configure Firebase:

Add your Firebase config inside /firebaseConfig.js.

Run locally:

bash
Copy
Edit
npm run dev
Build for production:

bash
Copy
Edit
npm run build
🌐 Live Demo
Hosted on Firebase: https://campussync-8fc20.web.app

🙌 Future Enhancements
Dark Mode Support

AI-powered Syllabus Planner

Recoil Integration for Global State

Notifications & Reminders

Made with ❤️ for Students

