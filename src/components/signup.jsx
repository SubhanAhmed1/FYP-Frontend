import React, { useState } from "react";
import { TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Image from "../loginPage.png";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    hr_profile: {
      Name: "",
      OrganizationName: "",
    },
    employee_profile: {
      Department: "",
      Position: "",
      OrganizationName: "",
    },
    candidate_profile: {
      UploadedCV: null,
      Name: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleProfileChange = (profileType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        [field]: value,
      },
    }));
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async () => {
    const url = "http://localhost:8000/api/register/";
    const isCandidate = formData.role === "Candidate";

    let payload;

    if (isCandidate) {
      payload = new FormData();
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("confirm_password", formData.confirmPassword);
      payload.append("role", formData.role);
      payload.append("Name", formData.candidate_profile.Name);

      if (formData.candidate_profile.UploadedCV) {
        payload.append("UploadedCV", formData.candidate_profile.UploadedCV);
      }
    } else {
      payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        role: formData.role,
      };

      if (formData.role === "HR") {
        payload.Name = formData.hr_profile.Name;
        payload.OrganizationName = formData.hr_profile.OrganizationName;
      } else if (formData.role === "Employee") {
        payload.Department = formData.employee_profile.Department;
        payload.Position = formData.employee_profile.Position;
        payload.OrganizationName = formData.employee_profile.OrganizationName;
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: isCandidate ? undefined : { "Content-Type": "application/json" },
        body: isCandidate ? payload : JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        alert("Registration failed: " + (errorData.message || "Unknown error"));
      } else {
        const data = await response.json();
        console.log("Registration successful:", data);
        alert("Registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    }
  };

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
          display: "flex",
          width: "90%",
          maxWidth: "1100px",
          backgroundColor: "#fff",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left - Form */}
        <Box sx={{ flex: 1, padding: 5 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#041D56" }}>
            Create an Account
          </Typography>
  
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              name="username"
              label="Username"
              fullWidth
              sx={{ flex: "1 1 48%" }}
              value={formData.username}
              onChange={handleInputChange}
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              sx={{ flex: "1 1 48%" }}
              value={formData.email}
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

<TextField
  name="confirmPassword"
  label="Confirm Password"
  type={showConfirmPassword ? "text" : "password"}
  fullWidth
  sx={{ flex: "1 1 48%" }}
  value={formData.confirmPassword}
  onChange={handleInputChange}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
  
            <FormControl fullWidth sx={{ flex: "1 1 100%", mt: 1 }}>
              <InputLabel id="role-label">Select Role</InputLabel>
              <Select
                labelId="role-label"
                value={formData.role}
                onChange={handleRoleChange}
                label="Select Role"
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Candidate">Candidate</MenuItem>
              </Select>
            </FormControl>
  
            {formData.role === "HR" && (
              <>
                <TextField
                  name="Name"
                  label="Full Name"
                  fullWidth
                  sx={{ flex: "1 1 48%" }}
                  value={formData.hr_profile.Name}
                  onChange={(e) =>
                    handleProfileChange("hr_profile", "Name", e.target.value)
                  }
                />
                <TextField
                  name="OrganizationName"
                  label="Organization Name"
                  fullWidth
                  sx={{ flex: "1 1 48%" }}
                  value={formData.hr_profile.OrganizationName}
                  onChange={(e) =>
                    handleProfileChange("hr_profile", "OrganizationName", e.target.value)
                  }
                />
              </>
            )}
  
            {formData.role === "Employee" && (
              <>
                <TextField
                  name="Department"
                  label="Department"
                  fullWidth
                  sx={{ flex: "1 1 48%" }}
                  value={formData.employee_profile.Department}
                  onChange={(e) =>
                    handleProfileChange("employee_profile", "Department", e.target.value)
                  }
                />
                <TextField
                  name="Position"
                  label="Position"
                  fullWidth
                  sx={{ flex: "1 1 48%" }}
                  value={formData.employee_profile.Position}
                  onChange={(e) =>
                    handleProfileChange("employee_profile", "Position", e.target.value)
                  }
                />
                <TextField
                  name="OrganizationName"
                  label="Organization Name"
                  fullWidth
                  sx={{ flex: "1 1 100%" }}
                  value={formData.employee_profile.OrganizationName}
                  onChange={(e) =>
                    handleProfileChange("employee_profile", "OrganizationName", e.target.value)
                  }
                />
              </>
            )}
  
            {formData.role === "Candidate" && (
              <>
                <TextField
                  name="Name"
                  label="Full Name"
                  fullWidth
                  sx={{ flex: "1 1 100%" }}
                  value={formData.candidate_profile.Name}
                  onChange={(e) =>
                    handleProfileChange("candidate_profile", "Name", e.target.value)
                  }
                />
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    mt: 1,
                    flex: "1 1 100%",
                    backgroundColor: "#266CA9",
                    "&:hover": { backgroundColor: "#0F2573" },
                  }}
                >
                  Upload CV
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleProfileChange("candidate_profile", "UploadedCV", e.target.files[0])
                    }
                  />
                </Button>
              </>
            )}
          </Box>
  
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#266CA9",
              color: "#fff",
              mt: 3,
              "&:hover": { backgroundColor: "#0F2573" },
            }}
          >
            Sign Up
          </Button>
  
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "#777" }}>
            Already have an account?{" "}
            <span
              style={{ color: "#266CA9", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </Typography>
        </Box>
  
        {/* Right - Image/Visual */}
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
            Join the community
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4 }}>
            Sign up today!
          </Typography>
          <img
            src={Image}
            alt="Register illustration"
            style={{ width: "80%", maxWidth: 300 }}
          />
        </Box>
      </Box>
    </Box>
  );
  
};

export default Register;