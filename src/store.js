import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/Slice/authSlice';
import jobReducer from '../src/Slice/jobSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
  },
});

export default store;
