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
      background: '#f7f7f7'
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
<Container
  maxWidth="md"
  sx={{
    marginLeft: { sm: '450px' }, // match sidebar width
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    py: 4,
  }}
>
  <Card sx={{ p: 4, borderRadius: 2, boxShadow: 4, backgroundColor: '#fff', width: '100%' }}>
    <CardContent>
      <Typography variant="h5" textAlign="center" mb={3} color="#266CA9" fontWeight="bold">
        Post a Job
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Row 1: Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Row 2: Location + Pay */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pay"
              name="pay"
              type="number"
              value={formData.pay}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Row 3: Qualification + Experience + Job Type */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              width="20%"  
              select
              label="Job Type"
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
            >
              <MenuItem value="FT">Full-Time</MenuItem>
              <MenuItem value="PT">Part-Time</MenuItem>
            </TextField>
          </Grid>

          {/* Row 4: Description - full width */}
          <Grid item xs={0}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        {/* Post Job button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Post Job
        </Button>
      </Box>
    </CardContent>
  </Card>
</Container>


    </div>
  );
};

export default HRPostJobPage;
