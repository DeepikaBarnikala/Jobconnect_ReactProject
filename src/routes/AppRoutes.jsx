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

      {/* =========================================
          PUBLIC HOME PAGE
      ========================================= */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* =========================================
          AUTHENTICATION
      ========================================= */}

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =========================================
          JOBS
          Login required
      ========================================= */}

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          JOB MANAGEMENT
          Employer/Admin only
      ========================================= */}

      <Route
        path="/add-job"
        element={
          <ProtectedRoute
            allowedRoles={["employer", "admin"]}
          >
            <AddJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-job/:id"
        element={
          <ProtectedRoute
            allowedRoles={["employer", "admin"]}
          >
            <AddJob />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          SAVED JOBS
      ========================================= */}

      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          DASHBOARD
      ========================================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          PROFILE
      ========================================= */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          CAREER ROADMAP
      ========================================= */}

      <Route
        path="/career-roadmap"
        element={
          <ProtectedRoute>
            <CareerRoadmap />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          APPLICATION TRACKER
      ========================================= */}

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationTracker />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          INTERVIEW SCHEDULER
      ========================================= */}

      <Route
        path="/interviews"
        element={
          <ProtectedRoute>
            <InterviewScheduler />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          APPLICATION TIMELINE
      ========================================= */}

      <Route
        path="/application-timeline"
        element={
          <ProtectedRoute>
            <ApplicationTimeline />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          CAREER ANALYTICS
      ========================================= */}

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