import React, { useState } from 'react';
import {
  Toolbar, Typography, Button, Box, Paper,
  useMediaQuery, useTheme, IconButton, Drawer,
  List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HubIcon from '@mui/icons-material/Hub';

const navItems = [
  { text: 'Home', path: '/' },
  { text: 'Visualizer', path: '/visualizer' },
  { text: 'Theory', path: '/theory' },
  { text: 'Project Of', path: '/project-of' },
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const linkStyle = { textDecoration: 'none', color: 'white', margin: '0 4px' };
  const activeStyle = { textDecoration: 'underline', textUnderlineOffset: '4px' };

  return (
    <Paper elevation={4} sx={{ borderRadius: '16px', bgcolor: 'primary.main', color: 'white' }}>
      <Toolbar>
        <HubIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          NFA → DFA Visualizer
        </Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setOpen(true)}><MenuIcon /></IconButton>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
              <Box sx={{ width: 240 }} onClick={() => setOpen(false)}>
                <List>
                  {navItems.map(item => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton component={NavLink} to={item.path}>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box>
            {navItems.map(item => (
              <NavLink
                key={item.text}
                to={item.path}
                style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}
              >
                <Button color="inherit">{item.text}</Button>
              </NavLink>
            ))}
          </Box>
        )}
      </Toolbar>
    </Paper>
  );
};

export default Navbar;