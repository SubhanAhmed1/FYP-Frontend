import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // State to hold error messages
  const navigate = useNavigate();

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login button click
  const handleLogin = async () => {
    // Validate empty fields before request
    if (!formData.username || !formData.password) {
      setError("Username and password are required.");
      return;
    }
  
    try {
      // Sending the login request to the server
      const response = await axios.post("http://localhost:8000/api/login/", formData);
      
      // Log the response data for debugging
      console.log("Login Response Data:", response.data);
  
      const { refresh, access, role } = response.data || {};

      if (response.status === 200) {
        localStorage.setItem("token", "true");
        localStorage.setItem("role", role);
      }
  
      // Check if the response data contains valid tokens and role
      if (!refresh || !access || !role) {
        setError("Login failed: Missing token or role from server.");
        return;
      }
  
      // Store tokens in localStorage
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("access_token", access);
  
      // Log the stored tokens for debugging
      console.log("Stored tokens:", { refresh, access });
      console.log("User role:", role);
  
      // Navigate based on user role
      switch (role) {
        case "Candidate":
          console.log("Navigating to Candidate Dashboard");
          navigate("/candidate");
          break;
        case "HR":
          console.log("Navigating to HR Dashboard");
          navigate("/hr");
          break;
        case "Employee":
          console.log("Navigating to Employee Dashboard");
          navigate("/employee");
          break;
        default:
          setError("Unknown user role. Please contact support.");
          return;
      }
  
      // Clear any previous errors
      setError("");
      
    } catch (error) {
      console.error("Login error:", error);
  
      if (error.response) {
        // Handle error responses from the server
        if (error.response.status === 400 || error.response.status === 401) {
          setError("Invalid username or password.");
        } else if (error.response.status === 403) {
          setError("Access denied. Please contact the administrator.");
        } else if (error.response.status === 500) {
          setError("Server error. Please try again later.");
        } else if (error.response.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } else if (error.request) {
        // Handle case when no response is received from the server
        setError("No response from server. Check your internet connection.");
      } else {
        // Handle any other errors
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1A2A3A, #101D2C)",
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          width: "100%",
          background: "#fff",
          padding: 4,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#041D56" }}>
          Welcome Back
        </Typography>

        {/* Show error message if there's any */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          name="username"
          label="Username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleInputChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            backgroundColor: "#266CA9",
            color: "#fff",
            mt: 2,
            "&:hover": { backgroundColor: "#0F2573" },
          }}
        >
          Login Now
        </Button>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "#777" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#266CA9", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Register here
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
