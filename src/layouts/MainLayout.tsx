import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../components/Navbar';

interface MainLayoutProps { children: React.ReactNode; }

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
    <Container maxWidth="xl" sx={{ my: 2 }}>
      <Navbar />
    </Container>
    <Box component="main" sx={{ flexGrow: 1, mb: 4 }}>
      {children}
    </Box>
  </Box>
);

export default MainLayout;