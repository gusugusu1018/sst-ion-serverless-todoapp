import { AccountCircle } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useRoutes,
} from 'react-router-dom';

import { SignInButton } from './components/SignInButton';
import { SignUpButton } from './components/SignUpButton';
import NotFound from './pages/NotFound';
import TodoList from './pages/TodoList';
import Welcome from './pages/Welcome';

const App: React.FC = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setSignedIn(true);
        navigate('/todos');
      } catch {
        setSignedIn(false);
      }
    };

    checkAuth();
  }, [signedIn, location.pathname]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSignedIn(false);
      navigate('/');
      setAnchorEl(null);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const routing = useRoutes([
    {
      path: '/',
      element: <Welcome />,
    },
    {
      path: '/todos',
      element: <TodoList />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <RouterLink
              to="/"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              ion todo
            </RouterLink>
          </Typography>
          {!signedIn ? (
            <>
              <Box mr={2}>
                <SignInButton onSignIn={() => setSignedIn(true)} />
              </Box>
              <SignUpButton onSignUp={() => setSignedIn(true)} />
            </>
          ) : (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                <MenuItem onClick={handleSignOut}> Sign out</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>{routing}</Container>
    </>
  );
};

export default App;
