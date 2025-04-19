// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import  HRHomePage from "./components/HRPage";
import HRPostJobPage from "./components/adJob";
import CandidatePage from "./components/CandidatePage";
import Login from "./components/login";
import Signup from "./components/signup";
import ProtectedRoute from "./components/ProtectedRoute";  // Corrected import path
import JobApplicationsPage from "./components/job-application";
import Chatbot from "./components/EmployeePage"; // Assuming you have a component for the API interaction
import { useDispatch } from "react-redux";

const App = () => {
  const user = useSelector((state) => state.auth.user);  // Get the user from Redux state
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/hr" element={<HRHomePage />} />
          <Route path="/hr/post-job" element={<HRPostJobPage />} />
          <Route path="/candidate" element={<CandidatePage />} />
          <Route path="/hr/JobApplications" element={<JobApplicationsPage />} />
    

        {/* Redirect to login if the route is not found */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
