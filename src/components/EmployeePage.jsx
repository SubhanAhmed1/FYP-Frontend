import React from 'react';
import { Typography, Box } from '@mui/material';

const EmployeePage = () => {
  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4, textAlign: 'center', boxShadow: 3 }}>
      <Typography variant="h3">Welcome Employee</Typography>
      <Typography variant="body1">This is the Employee dashboard.</Typography>
    </Box>
  );
};

export default EmployeePage;