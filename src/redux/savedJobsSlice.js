
import { createSlice } from "@reduxjs/toolkit";

const savedJobsSlice = createSlice({
  name: "savedJobs",

  initialState: {
    jobs: [],
  },

  reducers: {
    saveJob: (state, action) => {
      const job = action.payload;

      const alreadySaved = state.jobs.some(
        (savedJob) => String(savedJob.id) === String(job.id)
      );

      if (!alreadySaved) {
        state.jobs.push(job);
      }
    },

    removeSavedJob: (state, action) => {
      state.jobs = state.jobs.filter(
        (job) => String(job.id) !== String(action.payload)
      );
    },

    clearSavedJobs: (state) => {
      state.jobs = [];
    },
  },
});

export const { saveJob, removeSavedJob, clearSavedJobs } =
  savedJobsSlice.actions;

export default savedJobsSlice.reducer;