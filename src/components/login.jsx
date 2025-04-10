import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import axios from "axios";
import Image from "../loginPage.png";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1A2A3A, #101D2C)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "1000px",
          display: "flex",
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left side - Login Form */}
        <Box sx={{ flex: 1, padding: 5 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#041D56" }}>
            Log in.
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
            Log in with your data that you entered during your registration.
          </Typography>
  
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
  type={showPassword ? "text" : "password"}
  fullWidth
  sx={{ flex: "1 1 48%" }}
  value={formData.password}
  onChange={handleInputChange}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
  
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Typography variant="body2" sx={{ color: "#266CA9", cursor: "pointer" }}>
              Forgot password?
            </Typography>
          </Box>
  
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: "#266CA9",
              color: "#fff",
              mt: 3,
              "&:hover": { backgroundColor: "#0F2573" },
            }}
          >
            Log in
          </Button> 
          <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "#777" }}>
            Don’t have an account?{" "}
            <span
              style={{ color: "#266CA9", cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Register
            </span>
          </Typography>
        </Box>
  
        {/* Right side - Illustration & Welcome Text */}
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #266CA9, #0F2573)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Nice to see you again
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4 }}>
            Welcome back
          </Typography>
          <img
            src={Image}
            alt="Login illustration"
            style={{ width: "80%", maxWidth: 300 }}
          />
        </Box>
      </Box>
    </Box>
  );
  
};

export default Login;
