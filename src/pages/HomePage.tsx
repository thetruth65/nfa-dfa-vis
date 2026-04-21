import React from 'react';
import { Container, Box, Typography, Card, CardContent, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HubIcon from '@mui/icons-material/Hub';

const HomePage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <HubIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
      <Typography variant="h2" gutterBottom>NFA to DFA Visualizer</Typography>
      <Typography variant="h5" color="text.secondary">
        Understand the Subset Construction algorithm through step-by-step interactive animation.
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
      <Card sx={{ flex: 1, minWidth: 280, borderTop: 3, borderColor: 'primary.main' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>How to use</Typography>
          <List dense>
            {[
              'Define your NFA: states, alphabet, transitions, start & accept states.',
              'Click "Set NFA & Generate Animation" to compute the conversion.',
              'Press Play (or use step controls) to animate the algorithm.',
              'Watch the NFA highlight states being followed, and the DFA grow step by step.',
              'The table and pseudocode update in sync with the animation.',
            ].map((text, i) => (
              <ListItem key={i}>
                <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button component={Link} to="/visualizer" variant="contained" size="large" startIcon={<PlayArrowIcon />}>
              Open Visualizer
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: 280, borderTop: 3, borderColor: 'secondary.main' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>What you'll see</Typography>
          <List dense>
            {[
              'Live NFA graph with highlighted states and transitions.',
              'DFA graph that grows as new subset states are discovered.',
              'Color-coded annotations: which states are active, reachable, or new.',
              'Subset construction table with each row added in real time.',
              'Pseudocode with the currently executing line highlighted.',
              'Final summary of DFA states, accept states, and transition count.',
            ].map((text, i) => (
              <ListItem key={i}>
                <ListItemIcon><CheckCircleOutlineIcon color="secondary" /></ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button component={Link} to="/theory" variant="outlined" size="large">
              Read the Theory
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Container>
);

export default HomePage;