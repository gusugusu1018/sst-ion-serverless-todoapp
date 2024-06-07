import { Box, Typography } from '@mui/material';
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h1" gutterBottom>
        Welcome to ion todo
      </Typography>
      <Typography variant="body1">
        This is the service explanation page. Please log in or sign in to
        continue.
      </Typography>
    </Box>
  );
};

export default Welcome;
