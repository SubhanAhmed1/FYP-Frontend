import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { postJob, fetchJobs } from '../Slice/jobSlice';
import Image from '../Avatar.png';
import {
  TextField, Typography, Container, Card, CardContent,
  Button, Box
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#266CA9' },
    background: { default: 'linear-gradient(135deg, #E8F7FF, #AFCDEE)' },
    text: { primary: '#333', secondary: '#266CA9' },
  },
});

const HRPostJobPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', pay: '',
    qualification: '', experience: '', jobType: 'PT',
  });

   const location = useLocation(); // ✅ Get current route
  
    const isOnPostedJobs = location.pathname === '/hr/post-job'; // ✅ Check if we're on /hr
  
    const jobs = useSelector((state) => state.jobs.jobs);
  

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
  
    const token = localStorage.getItem('access_token'); // Correct token
  
    const payload = {
      Title: formData.title,
      Description: formData.description,
      Location: formData.location,
      Pay: parseInt(formData.pay),
      Qualification: formData.qualification,
      Experience: formData.experience,
      JobType: formData.jobType === 'FT' ? 'FT' : 'PT',
    };

    console.log('Payload:', payload); // Debugging line
  
    try {
      const response = await fetch('http://localhost:8000/api/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Now it's the real token
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
        alert('Error: ' + (error.message || 'msla hogaya hai bhai'));
      }
    } catch (err) {
      console.error('Error submitting job:', err);
      alert('Something went wrong!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: theme.palette.background.default
    }}>
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
              <Typography variant="h6" fontWeight="bold" marginBottom="2rem">
              {jobs.length > 0 ? jobs[0]?.PostedByHR?.Name || 'Company' : 'Company'}
              </Typography>
              
              <Button fullWidth variant="contained" color="primary"  onClick={() => navigate('/hr')} sx={{ mb: 2 }} >
              My Posted Jobs
              </Button>
      
              <Button fullWidth variant="contained" color={isOnPostedJobs ? 'success' : 'primary'} onClick={() => navigate('/hr/post-job')} style={{ marginBottom: '1rem' }} >
              Add Job +
              </Button>
      
              <Button fullWidth variant="contained" color="primary" onClick={() => navigate('/hr/JobApplications')}>
                      All Job Applications
                      </Button>
            </Box>

            
      <Container maxWidth="sm">
        <Card style={{ padding: '1.5rem', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          <CardContent>
            <Typography variant="h5" style={{ textAlign: 'center', color: theme.palette.text.secondary, marginBottom: '1rem' }}>
              Post a Job
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              {['title', 'description', 'location', 'pay', 'qualification', 'experience'].map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  margin="normal"
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  variant="outlined"
                  value={formData[field]}
                  onChange={handleInputChange}
                  multiline={field === 'description'}
                  rows={field === 'description' ? 4 : 1}
                />
              ))}
              <TextField
                fullWidth
                margin="normal"
                label="Job Type"
                name="jobType"
                variant="outlined"
                value={formData.jobType}
                onChange={handleInputChange}
                select
                SelectProps={{ native: true }}
              >
                <option value="FT">Full-Time</option>
                <option value="PT">Part-Time</option>
              </TextField>
              <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '1rem' }}>
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
