import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/SignupPages';
import CompleteProfile from './pages/ProfileComplete';
import DashboardLayout from './pages/DashboardLayout';
import { Dashboard } from './pages/dashboard';
import NoteSummarizerPage from './pages/Notesummarizer';
import SyllabusPlanner from './pages/SyllabusPlanner';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './Components/ProtectedRoutes'; 
import Settings from './pages/settings';

const App = () => {
  return (
    <>
      {/* Toast notification system always active */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            style: {
              background: '#e6fff8',
              color: '#065f46',
              borderLeft: '6px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#d1fae5',
            },
          },
          error: {
            style: {
              background: '#fff1f2',
              color: '#b91c1c',
              borderLeft: '6px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffe4e6',
            },
          },
          loading: {
            style: {
              background: '#fef9c3',
              color: '#92400e',
              borderLeft: '6px solid #facc15',
            },
            iconTheme: {
              primary: '#facc15',
              secondary: '#fefce8',
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* 🔒 Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings/>}/>
          <Route path="note-summarizer" element={<NoteSummarizerPage />} />
          <Route path="syllabus-planner" element={<SyllabusPlanner />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
