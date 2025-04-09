import React, { useState } from "react";
import { TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

  // const handleSubmit = async () => {
  //   let url = "http://localhost:8000/api/register/";
  //   let isCandidate = formData.role === "Candidate";

  //   let payload;

  //   if (isCandidate) {
  //     payload = new FormData();
  //     payload.append("username", formData.username);
  //     payload.append("email", formData.email);
  //     payload.append("password", formData.password);
  //     payload.append("confirm_password", formData.confirmPassword);
  //     payload.append("role", formData.role);
  //     payload.append("Name", formData.candidate_profile.Name);

  //     if (formData.candidate_profile.eduploadCV) {
  //       payload.append("eduploadCV", formData.candidate_profile.eduploadCV);
  //     }
  //   } else {
  //     payload = {
  //       username: formData.username,
  //       email: formData.email,
  //       password: formData.password,
  //       confirm_password: formData.confirmPassword,
  //       role: formData.role,
  //     };

  //     if (formData.role === "HR") {
  //       payload.Name = formData.hr_profile.Name;
  //       payload.OrganizationName = formData.hr_profile.OrganizationName;
  //     } else if (formData.role === "Employee") {
  //       payload.Department = formData.employee_profile.Department;
  //       payload.Position = formData.employee_profile.Position;
  //       payload.OrganizationName = formData.employee_profile.OrganizationName;
  //     }
  //   }

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: isCandidate
  //         ? {} // Do NOT set content-type for FormData
  //         : { "Content-Type": "application/json" },
  //       body: isCandidate ? payload : JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error("Registration failed:", errorData);
  //       alert("Registration failed: " + (errorData.message || "Unknown error"));
  //     } else {
  //       const data = await response.json();
  //       console.log("Registration successful:", data);
  //       alert("Registered successfully!");
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("Something went wrong!");
  //   }
  // };

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
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f7f7f7",
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          width: "100%",
          background: "#fff",
          padding: 4,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#041D56" }}>
          Create an Account
        </Typography>

        {/* Common Fields */}
        <TextField
          name="username"
          label="Username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleInputChange}
        />
        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="normal"
          value={formData.email}
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
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />

        {/* Role Selection */}
        <FormControl fullWidth sx={{ mt: 2 }}>
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

        {/* Conditional Role-Specific Fields */}
        {formData.role === "HR" && (
          <>
            <TextField
              name="Name"
              label="Full Name"
              fullWidth
              margin="normal"
              value={formData.hr_profile.Name}
              onChange={(e) =>
                handleProfileChange("hr_profile", "Name", e.target.value)
              }
            />
            <TextField
              name="OrganizationName"
              label="Organization Name"
              fullWidth
              margin="normal"
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
              margin="normal"
              value={formData.employee_profile.Department}
              onChange={(e) =>
                handleProfileChange("employee_profile", "Department", e.target.value)
              }
            />
            <TextField
              name="Position"
              label="Position"
              fullWidth
              margin="normal"
              value={formData.employee_profile.Position}
              onChange={(e) =>
                handleProfileChange("employee_profile", "Position", e.target.value)
              }
            />
            <TextField
              name="OrganizationName"
              label="Organization Name"
              fullWidth
              margin="normal"
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
              margin="normal"
              value={formData.candidate_profile.Name}
              onChange={(e) =>
                handleProfileChange("candidate_profile", "Name", e.target.value)
              }
            />
            <Button
              variant="contained"
              component="label"
              sx={{
                mt: 2,
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

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#266CA9",
            color: "#fff",
            mt: 2,
            "&:hover": { backgroundColor: "#0F2573" },
          }}
        >
          Sign Up
        </Button>

        {/* Login Redirect */}
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
    </Box>
  );
};

export default Register;