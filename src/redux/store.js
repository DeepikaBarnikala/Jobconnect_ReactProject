
import { configureStore } from "@reduxjs/toolkit";
import savedJobsReducer from "./savedJobsSlice";

function loadSavedJobs() {
  try {
    const savedData = localStorage.getItem("savedJobs");

    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error("Could not load saved jobs:", error);
    return [];
  }
}

export const store = configureStore({
  reducer: {
    savedJobs: savedJobsReducer,
  },

  preloadedState: {
    savedJobs: {
      jobs: loadSavedJobs(),
    },
  },
});

// Save the Redux state whenever the saved jobs change.
store.subscribe(() => {
  try {
    const jobs = store.getState().savedJobs.jobs;
    localStorage.setItem("savedJobs", JSON.stringify(jobs));
  } catch (error) {
    console.error("Could not save jobs:", error);
  }
});