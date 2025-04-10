import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Image from '../Avatar.png';
import {
  TextField, Typography, Container, Card, CardContent,Divider,
  Button, Box, Grid, MenuItem
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const HRPostJobPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnPostedJobs = location.pathname === '/hr/post-job';
  const jobs = useSelector((state) => state.jobs.jobs);

  const [formData, setFormData] = useState({
    title: '', description: '', location: '', pay: '',
    qualification: '', experience: '', jobType: 'PT',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'HR') navigate('/login');
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    const payload = {
      Title: formData.title,
      Description: formData.description,
      Location: formData.location,
      Pay: parseInt(formData.pay),
      Qualification: formData.qualification,
      Experience: formData.experience,
      JobType: formData.jobType === 'FT' ? 'FT' : 'PT',
    };

    try {
      const response = await fetch('http://localhost:8000/api/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Job posted:', result);
        navigate('/hr');
      } else {
        const error = await response.json();
        console.error('Failed to post job:', error);
        alert('Error: ' + (error.message || 'Failed to post'));
      }
    } catch (err) {
      console.error('Error submitting job:', err);
      alert('Something went wrong!');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        localStorage.clear();
        navigate('/login');
      } else {
        alert("Logout failed!");
      }
    } catch (err) {
      alert("Logout error!");
      console.error(err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: "linear-gradient(135deg, #1A2A3A, #101D2C)",
    }}>
      {/* Sidebar */}
      <Box
        width="250px"
        bgcolor="#ffffff"
        height="90vh"
        padding="2rem 1rem"
        boxShadow="2px 0 6px rgba(0,0,0,0.1)"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        position="fixed"
        top={0}
        left={0}
        zIndex={1200}
      >
        <Box width="100%" flexGrow={1} display="flex" flexDirection="column" alignItems="center">
          <Box
            component="img"
            src={Image}
            alt="Profile"
            borderRadius="50%"
            width="100px"
            height="100px"
            mb={2}
          />
          <Typography variant="h6" fontWeight="bold" mb={3}>
            {jobs.length > 0 ? jobs[0]?.PostedByHR?.Name || 'Company' : 'Company'}
          </Typography>
           <Divider style={{ marginBottom: '1rem' }} />

          <Button fullWidth variant="contained" color="primary" onClick={() => navigate('/hr')} sx={{ mb: 2 }}>
            My Posted Jobs
          </Button>

          <Button fullWidth variant="contained" color={isOnPostedJobs ? 'success' : 'primary'} onClick={() => navigate('/hr/post-job')} sx={{ mb: 2 }}>
            Add Job +
          </Button>

          <Button fullWidth variant="contained" color="primary" onClick={() => navigate('/hr/JobApplications')}>
            All Job Applications
          </Button>
        </Box>

        {/* Logout */}
        <Box width="100%" mt={3}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Box>

 {/* Main Content */}
{/* Main Content */}
<div style={{ marginLeft: '250px', width: '100%', display: 'flex', flexDirection: 'row', minHeight: '60vh' }}>
  {/* Left Side - Form */}
 
  {/* Right Side - Visual Section */}
  <Box
    flex={1}
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    sx={{
      background: 'linear-gradient(135deg, #0077B6, #023E8A)',
      color: 'white',
      textAlign: 'center',
      p: 4
    }}
  >
    <Typography variant="h4" fontWeight="bold" mb={2}>
      Connect with Talent
    </Typography>
    <Typography variant="h6" mb={4}>
      Post roles. Get applicants. Grow fast.
    </Typography>
    <img
      src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
      alt="Hiring Illustration"
      style={{ width: '250px', height: 'auto' }}
    />
  </Box>
  <Box
  flex={1}
  display="flex"
  justifyContent="center"
  alignItems="center"
  p={4}
  sx={{ backgroundColor: '#f4f6f8' }}
>
  <Card sx={{ width: '100%', maxWidth: 650, p: 4, borderRadius: 4, boxShadow: 4 }}>
    <CardContent>
      <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3} color="primary">
        Post a New Job
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Job Title & Experience */}
          <TextField fullWidth label="Job Title" name="title" value={formData.title} onChange={handleInputChange} />
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Experience" name="experience" value={formData.experience} onChange={handleInputChange} />
          </Grid>

          {/* Qualification & Pay */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Pay" name="pay" type="number" value={formData.pay} onChange={handleInputChange} />
          </Grid>

          {/* Location & Job Type */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleInputChange} />
          </Grid>
          <TextField
              fullWidth
              select
              label="Job Type"
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
            >
              <MenuItem value="FT">Full-Time</MenuItem>
              <MenuItem value="PT">Part-Time</MenuItem>
            </TextField>

          {/* Description */}
          <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />

          <Button type="submit" fullWidth variant="contained" color="primary" size="large">
              Post Job
            </Button>
        </Grid>
      </Box>
    </CardContent>
  </Card>
</Box>

</div>




    </div>
  );
};

export default HRPostJobPage;
