import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import AddJob from "../pages/Addjob";
import SavedJobs from "../pages/SavedJobs";

import Register from "../pages/Register";
import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import CareerRoadmap from "../pages/CareerRoadmap";

import ApplicationTracker from "../pages/ApplicationTracker";
import InterviewScheduler from "../pages/InterviewScheduler";
import ApplicationTimeline from "../pages/ApplicationTimeline";
import ProtectedRoute from "../components/Protectedroute";
import CareerAnalytics from "../pages/CareerAnalytics";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Job Management */}
      <Route
        path="/add-job"
        element={
          <ProtectedRoute>
            <AddJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-job/:id"
        element={
          <ProtectedRoute>
            <AddJob />
          </ProtectedRoute>
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* saved jobs */}
      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
     />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Career Roadmap */}
      <Route
        path="/career-roadmap"
        element={
          <ProtectedRoute>
            <CareerRoadmap />
          </ProtectedRoute>
        }
      />

      {/* Application Tracker */}
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationTracker />
          </ProtectedRoute>
        }
      />

      {/* Interview Scheduler */}
      <Route
        path="/interviews"
        element={
          <ProtectedRoute>
            <InterviewScheduler />
          </ProtectedRoute>
        }
      />
     
     {/* Application-timeline */}
      <Route
        path="/application-timeline"
        element={
          <ProtectedRoute>
            <ApplicationTimeline />
          </ProtectedRoute>
        }
      />
      {/* Career-Analytics */}
      <Route
        path="/career-analytics"
        element={
          <ProtectedRoute>
            <CareerAnalytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;