import React, { useState, useEffect } from "react";
import { Table, Tag, Typography, Spin, Alert, Modal, Input } from "antd";
import { Box, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Image from "../Avatar.png";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";

const { Text } = Typography;

const JobApplicationsPage = () => {
  const theme = createTheme({
    palette: {
      primary: { main: "#000" },
      background: { default: "#f5faff" },
      text: { primary: "#333", secondary: "#000" },
    },
  });

  const navigate = useNavigate();
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    interview_date: "",
    interview_time: "",
    interview_location: "",
  });
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const location = useLocation(); // ✅ Get current route
  const isOnPostedJobs = location.pathname === "/hr/JobApplications"; // ✅ Check if we're on /hr

  const jobs = useSelector((state) => state.jobs.jobs);

  useEffect(() => {
    fetch("http://localhost:8000/api/job-applications/")
      .then((response) => response.json())
      .then((result) => {
        if (Array.isArray(result.data)) {
          setJobApplications(result.data);
        } else {
          setError("Unexpected response format.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message || "An error occurred.");
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: "Applicant",
      dataIndex: ["Applicant", "Name"],
      key: "applicant",
      render: (text) => <Text>{text || "N/A"}</Text>,
    },
    {
      title: "Job Title",
      dataIndex: ["JobAd", "Title"],
      key: "jobTitle",
      render: (text) => <Text strong>{text || "Unknown Position"}</Text>,
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      render: (status) => {
        const color =
          status === "Pending"
            ? "orange"
            : status === "Accepted"
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Score",
      dataIndex: "Score",
      key: "score",
      render: (score) => <Text>{score.toFixed(2)}</Text>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          style={{
            color: "white",
            backgroundColor: "black",
            borderColor: "black",
          }}
          onClick={() => {
            setSelectedApplicant(record);
            setIsModalVisible(true); // Show the modal to enter interview details
          }}
        >
          Send Email
        </Button>
      ),
    },
  ];

  const handleOk = async () => {
    const { interview_date, interview_time, interview_location } = interviewDetails;

    if (!interview_date || !interview_time || !interview_location) {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
        to_email: selectedApplicant.Applicant?.email?.replace(/^["']|["']$/g, "").trim(),

      candidate_name: selectedApplicant.Applicant?.Name,
      job_title: selectedApplicant.JobAd?.Title,
      interview_date,
      interview_time,
      interview_location,
      company_name: "Tech Corp", // Or dynamically pass this
    };
    console.log("Payload:", payload); // Debugging line

    try {
      const response = await fetch("http://localhost:8000/api/send-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response:", response); // Debugging line

      const data = await response.json();

      if (data.success) {
        alert("Email sent successfully!");
        setIsModalVisible(false); // Close modal after sending email
      } else {
        alert("Email Send Successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the email.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterviewDetails({
      ...interviewDetails,
      [name]: value,
    });
  };

  return (
    <Box display="flex">
      {/* Sidebar */}
      <Box
        width="250px"
        bgcolor="#ffffff"
        height="100vh"
        padding="2rem 1rem"
        boxShadow="2px 0 6px rgba(0,0,0,0.1)"
        display="flex"
        flexDirection="column"
        alignItems="center"
        position="fixed"
        top={0}
        left={0}
        zIndex={1200}
      >
        <Box
          component="img"
          src={Image}
          alt="Profile"
          borderRadius="50%"
          width="100px"
          height="100px"
          marginBottom="1rem"
        />
        <Typography
          variant="h5"
          fontWeight="bold"
          marginBottom="2rem"
          sx={{
            backgroundColor: "black",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {jobs.length > 0 ? jobs[0]?.PostedByHR?.Name || "Company" : "Company"}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => navigate("/hr")}
          sx={{ mb: 2 }}
        >
          My Posted Jobs
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => navigate("/hr/post-job")}
          sx={{ mb: 2 }}
        >
          Add Job +
        </Button>

        <Button
          fullWidth
          variant="contained"
          color={isOnPostedJobs ? "success" : "primary"}
          onClick={() => navigate("/hr/JobApplications")}
        >
          All Job Applications
        </Button>
      </Box>

      {/* Content Area */}
      <Box marginLeft="250px" padding="2rem" flex={1} bgcolor="#f9f9f9" minHeight="100vh">
        <Typography variant="h4" gutterBottom>
          Job Applications
        </Typography>

        {loading ? (
          <Spin size="large" tip="Loading job applications..." />
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <Table
            columns={columns}
            dataSource={jobApplications}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5 }}
          />
        )}
      </Box>

      {/* Modal for interview details */}
      <Modal
        title="Enter Interview Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Send Email"
      >
       <Input
  name="interview_date"
  type="date" // Ensure only date is input
  placeholder="Interview Date"
  value={interviewDetails.interview_date}
  onChange={handleInputChange}
  style={{ marginBottom: "1rem" }}
/>

<Input
  name="interview_time"
  type="time" // Ensure only time is input
  placeholder="Interview Time"
  value={interviewDetails.interview_time}
  onChange={handleInputChange}
  style={{ marginBottom: "1rem" }}
/>

<Input
  name="interview_location"
  placeholder="Interview Location"
  value={interviewDetails.interview_location}
  onChange={handleInputChange}
  style={{ marginBottom: "1rem" }}
/>

      </Modal>
    </Box>
  );
};

export default JobApplicationsPage;
