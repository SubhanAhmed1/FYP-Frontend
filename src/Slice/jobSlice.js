import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch jobs with token
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token'); // Get access token

    const response = await axios.get('http://localhost:8000/api/jobs/', {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });
    console.log('Jobs fetched successfully:', response.data); // Debugging line
    return response.data;
    
  } catch (error) {
    console.error('Fetch jobs error:', error);
    return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching jobs');
  }
});

// Async thunk to update a job with token (PATCH request)
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token'); // Get access token

      const response = await axios.patch(`http://localhost:8000/api/jobs/${id}/`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      console.log('Job updated successfully:', response.data); // Debugging line
      return response.data;
    } catch (error) {
      console.error('Update job error:', error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Error updating job');
    }
  }
);

// Async thunk to delete a job with token (DELETE request)
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token'); // Get access token

      const response = await axios.delete(`http://localhost:8000/api/jobs/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      console.log('Job deleted successfully:', response.data); // Debugging line
      return id; // Returning the job id to remove it from the state
    } catch (error) {
      console.error('Delete job error:', error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Error deleting job');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    status: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.status = 'success';
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      })
      
      // Handle update job
      .addCase(updateJob.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const updatedJob = action.payload;
        const index = state.jobs.findIndex((job) => job.id === updatedJob.id);
        if (index !== -1) {
          state.jobs[index] = updatedJob; // Replace the old job with the updated one
        }
        state.status = 'success';
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error updating job';
      })
      
      // Handle delete job
      .addCase(deleteJob.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        const idToDelete = action.payload;
        state.jobs = state.jobs.filter((job) => job.id !== idToDelete); // Remove job from state
        state.status = 'success';
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error deleting job';
      });
  },
});

export default jobSlice.reducer;
