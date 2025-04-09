import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '../Slice/jobSlice';
import {
  Button, Typography, Container, Card, CardContent, Grid, Chip, Divider, Box
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

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
      console.log ('Response:', response); // Debugging line

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

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', padding: '2rem', borderRadius: '8px', background: theme.palette.background.default, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: theme.palette.text.secondary }}>
        Available Jobs
      </Typography>

      <Grid container spacing={6}>
        {jobs.map((job) => {
          const alreadyApplied = appliedJobIds.includes(job.id);

          return (
            <Grid item xs={12} sm={6} md={6} key={job.id} style={{ width: '45%', paddingBottom: '3rem', justifyContent: 'center' }}>
              <Card style={{
                padding: '1.5rem',
                backgroundColor: '#fff',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                height: '100%',
                marginBottom: '0.5rem',
                position: 'relative',
                maxWidth: '500px',
              }}>
                <CardContent style={{ paddingBottom: '0.5rem' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
                    <Typography variant="subtitle2" style={{ fontWeight: 'bold', color: '#000' }}>
                      {job.PostedByHR.OrganizationName || 'Company'}
                    </Typography>
                  </Box>

                  <Typography variant="h2" style={{ fontWeight: 'bold', fontSize: '2.2rem', marginBottom: '0.25rem' }}>
                    {job.Title}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: '2rem' }}>
                    {job.Description}
                  </Typography>

                  <Box display="flex" gap={1} marginBottom="1rem">
                    <Chip label={job.JobType === 'FT' ? 'Full-time' : 'Part-time'} variant="outlined" sx={{ borderRadius: '6px', fontWeight: 'bold', paddingX: '6px' }} />
                    <Chip label={job.Experience} variant="outlined" sx={{ borderRadius: '6px', fontWeight: 'bold', paddingX: '6px' }} />
                  </Box>
                  <Divider style={{ marginBottom: '1rem' }} />

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      ${job.Pay}/yr
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {job.Location}
                    </Typography>
                  </Box>
                </CardContent>

                <Typography variant="caption" color="textSecondary" style={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  right: '0.9rem',
                  fontSize: '0.8rem',
                }}>
                  {getDaysAgo(job.PostDate || new Date())}
                </Typography>

                <Button
                  variant="contained"
                  color="Seconda"
                  disabled={alreadyApplied}
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    fontWeight: 'semi-bold',
                    backgroundColor: alreadyApplied ? '#888' : '#000',
                    color: '#fff',
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
  );
};

export default CandidatePage;
