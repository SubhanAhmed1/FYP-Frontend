import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, deleteJob, updateJob } from '../Slice/jobSlice';
import {
  Button, Typography, Container, Card, CardContent, Grid, Chip, Divider, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from '../Avatar.png';

const theme = createTheme({
  palette: {
    primary: { main: '#000' },
    background: { default: '#f5faff' },
    text: { primary: '#333', secondary: '#000' },
  },
});

const HRHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

  const isOnPostedJobs = location.pathname === '/hr'; // ✅ Check if we're on /hr

  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'HR') {
      navigate('/login');
      return;
    }
    dispatch(fetchJobs());
  }, [dispatch, navigate]);

  const getDaysAgo = (dateStr) => {
    const now = dayjs();
    const posted = dayjs(dateStr);
    const daysDiff = now.diff(posted, 'day');

    if (daysDiff >= 1) {
      return `${daysDiff} day${daysDiff !== 1 ? 's' : ''} ago`;
    }

    const hoursDiff = now.diff(posted, 'hour');
    if (hoursDiff >= 1) {
      return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };

  const handleEditClick = (job) => {
    setCurrentJob(job);
    setOpenDialog(true);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setOpenDeleteDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentJob(null);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setJobToDelete(null);
  };

  const handleFormSubmit = () => {
    if (currentJob) {
      const updatedData = {
        Title: currentJob.Title,
        Description: currentJob.Description,
        Location: currentJob.Location,
        Pay: currentJob.Pay,
        Qualification: currentJob.Qualification,
        Experience: currentJob.Experience,
        JobType: currentJob.JobType,
      };
  
      dispatch(updateJob({ id: currentJob.id, updatedData }))
        .then(() => {
          console.log('Job updated successfully');
          handleDialogClose();
        })
        .catch((error) => {
          console.error('Error updating job:', error);
        });
    }
  };

  const handleDeleteJob = () => {
    dispatch(deleteJob(jobToDelete.id))
      .then(() => {
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        console.error('Error deleting the job:', error);
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
        <Typography variant="h6" fontWeight="bold" marginBottom="2rem">
        {jobs.length > 0 ? jobs[0]?.PostedByHR?.Name || 'Company' : 'Company'}
        </Typography>
        
        <Button fullWidth variant="contained"  color={isOnPostedJobs ? 'success' : 'primary'}  onClick={() => navigate('/hr')} sx={{ mb: 2 }} >
        My Posted Jobs
        </Button>

        <Button fullWidth variant="contained" color="primary" onClick={() => navigate('/hr/post-job')} style={{ marginBottom: '1rem' }} >
        Add Job +
        </Button>

        <Button fullWidth variant="contained" color="primary" onClick={() => navigate('/hr/JobApplications')}>
        All Job Applications
        </Button>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} marginLeft="250px">
        <Container maxWidth="md" style={{
          marginTop: '2rem', padding: '2rem',
          borderRadius: '8px', background: theme.palette.background.default,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: theme.palette.text.secondary }}>
            My Posted Jobs
          </Typography>

          {/* <Button variant="contained" color="primary" onClick={() => navigate('/hr/post-job')} style={{ marginBottom: '1rem' }}>
            Add Job
          </Button> */}

          <Grid container spacing={6}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={6} key={job.id} style={{ width: '45%', paddingBottom: '3rem', justifyContent: 'center' }}>
                <Card style={{
                  padding: '1.5rem',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
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
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton size="small" onClick={() => handleEditClick(job)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteClick(job)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h2" style={{ fontWeight: 'bold', fontSize: '2.2rem', marginBottom: '0.25rem' }}>
                      {job.Title}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '2rem' }}>
                      {job.Description}
                    </Typography>

                    <Box display="flex" gap={1} marginBottom="1rem">
                      <Chip
                        label={job.JobType === 'FT' ? 'Full-time' : 'Part-time'}
                        variant="outlined"
                        sx={{
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          paddingX: '6px',
                        }}
                      />
                      <Chip
                        label={job.Experience}
                        variant="outlined"
                        sx={{
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          paddingX: '6px',
                        }}
                      />
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
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Edit Job Dialog */}
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogContent>
              <TextField
                label="Job Title"
                value={currentJob?.Title || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, Title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Job Description"
                value={currentJob?.Description || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, Description: e.target.value })}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              <TextField
                label="Location"
                value={currentJob?.Location || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, Location: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Pay"
                value={currentJob?.Pay || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, Pay: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Qualification"
                value={currentJob?.Qualification || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, Qualification: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Experience"
                value={currentJob?.Experience || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, Experience: e.target.value })}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="job-type-label">Job Type</InputLabel>
                <Select
                  labelId="job-type-label"
                  value={currentJob?.JobType || ''}
                  onChange={(e) => setCurrentJob({ ...currentJob, JobType: e.target.value })}
                  label="Job Type"
                >
                  <MenuItem value="FT">Full Time </MenuItem>
                  <MenuItem value="PT">Part Time </MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">Cancel</Button>
              <Button onClick={handleFormSubmit} color="primary">Save</Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
            <DialogTitle>Are you sure you want to delete this job?</DialogTitle>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="primary">Cancel</Button>
              <Button onClick={handleDeleteJob} color="primary">Yes</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default HRHomePage;
