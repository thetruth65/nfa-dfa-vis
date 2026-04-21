import React from 'react';
import { Container, Paper, Typography, Box, Avatar, Divider, Chip } from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';

const ProjectOfPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ my: 4 }}>
    <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
          <HubIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h4">Your Name</Typography>
        <Typography variant="subtitle1" color="text.secondary">Roll No: XXXX</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary">Course</Typography>
          <Typography variant="body1" fontWeight={500}>Theory of Automata and Formal Languages (TAFL)</Typography>
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary">Topic</Typography>
          <Typography variant="body1" fontWeight={500}>NFA to DFA Conversion — Subset Construction Visualization</Typography>
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary">Branch</Typography>
          <Typography variant="body1">Computer Science and Engineering</Typography>
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary">Institution</Typography>
          <Typography variant="body1">Your University</Typography>
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary">Tech Stack</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
            {['React 19', 'TypeScript', 'Vite', 'MUI v7', 'ReactFlow v12', 'Dagre', 'React Router v7'].map(t => (
              <Chip key={t} label={t} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  </Container>
);

export default ProjectOfPage;