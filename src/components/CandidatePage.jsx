import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '../Slice/jobSlice';
import {
  Button, Typography, Container, Card, CardContent, Grid, Chip, Divider, Box
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import Image from '../Avatar.png';

const theme = createTheme({
  palette: {
    primary: { main: '#000' },
    background: { default: '#f5faff' },
    text: { primary: '#333', secondary: '#000' },
  },
});

const CandidatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'Candidate') {
      navigate('/login');
    } else {
      dispatch(fetchJobs());
      fetchAppliedJobs(token);
    }
  }, [dispatch, navigate]);

  const fetchAppliedJobs = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/applied-jobs/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const ids = data.map((job) => job.job_id);
        setAppliedJobIds(ids);
      }
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/apply-job/${jobId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Applied successfully!');
        setAppliedJobIds((prev) => [...prev, jobId]);
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to apply.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDaysAgo = (dateStr) => {
    const now = dayjs();
    const posted = dayjs(dateStr);
    const daysDiff = now.diff(posted, 'day');
    if (daysDiff >= 1) return `${daysDiff} day${daysDiff !== 1 ? 's' : ''} ago`;
    const hoursDiff = now.diff(posted, 'hour');
    if (hoursDiff >= 1) return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
    
        sx={{
          marginLeft: '300px',
          marginTop: '2rem',
          padding: '2rem',
          borderRadius: '8px',
          background: theme.palette.background.default,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" color={theme.palette.text.secondary}>
          Available Jobs
        </Typography>

        <Grid container spacing={6} >
          {jobs.map((job) => {
            const alreadyApplied = appliedJobIds.includes(job.id);
            return (
              <Grid item xs={12} sm={6} md={6} key={job.id} style={{ width: '45%', paddingBottom: '2rem', justifyContent: 'center' }}>
                <Card
                  sx={{
                    padding: '1.5rem',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    borderRadius: '16px',
                    position: 'relative',
                    height: '100%',
                    maxWidth: '500px',
                    margin: '0 auto',
                    
                  }}
                >
                  <CardContent sx={{ paddingBottom: '0.5rem' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary">
                        {job.PostedByHR.OrganizationName || 'Company'}
                      </Typography>
                    </Box>

                    <Typography variant="h2" fontSize="2rem" fontWeight="bold" mb={1}>
                      {job.Title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {job.Description}
                    </Typography>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip label={job.JobType === 'FT' ? 'Full-time' : 'Part-time'} variant="outlined" />
                      <Chip label={job.Experience} variant="outlined" />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box>
                      <Typography variant="body2" fontWeight="bold" mb={0.5}>
                        ${job.Pay}/yr
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.Location}
                      </Typography>
                    </Box>
                  </CardContent>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      right: '0.9rem',
                      fontSize: '0.8rem',
                    }}
                  >
                    {getDaysAgo(job.PostDate || new Date())}
                  </Typography>

                  <Button
                    variant="contained"
                    disabled={alreadyApplied}
                    sx={{
                      position: 'absolute',
                      bottom: '1rem',
                      backgroundColor: alreadyApplied ? '#888' : '#000',
                      color: '#fff',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#222' },
                    }}
                    onClick={() => handleApply(job.id)}
                  >
                    {alreadyApplied ? 'Already Applied' : 'Apply Now'}
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default CandidatePage;
