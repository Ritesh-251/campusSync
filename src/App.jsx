import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/SignupPages';
import CompleteProfile from './pages/ProfileComplete';
import DashboardLayout from './pages/DashboardLayout';
import { Dashboard } from './pages/dashboard';
import NoteSummarizerPage from './pages/Notesummarizer';
import SyllabusPlanner from './pages/SyllabusPlanner';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      
      {/* Dashboard with Sidebar */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="note-summarizer" element={<NoteSummarizerPage />} />
        <Route path="syllabus-planner" element={<SyllabusPlanner />} />
      </Route>
    </Routes>
  );
};

export default App;
