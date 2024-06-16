import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { signIn, signInWithRedirect } from 'aws-amplify/auth';
import React, { useState } from 'react';
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';

interface SignInButtonProps {
  onSignIn: () => void;
}

export const SignInButton: React.FC<SignInButtonProps> = ({ onSignIn }) => {
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [signInError, setSignInError] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => {
    setIsSignInDialogOpen(true);
  };

  const handleClose = () => {
    setIsSignInDialogOpen(false);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);

    if (value.length !== 0 && !value.includes('@')) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const credentials = { username: email, password };
      await signIn(credentials);
      onSignIn();
      navigate('/todos');
      setIsSignInDialogOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSignInError(error.message);
      } else {
        setSignInError('An unknown error occurred');
      }
      console.error('Error signing in', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Sign In
      </Button>
      <Dialog open={isSignInDialogOpen} onClose={handleClose}>
        <DialogTitle>SignIn</DialogTitle>
        <DialogContent>
          <>
            <GoogleButton onClick={handleGoogleSignIn} />
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              error={emailError}
              helperText={emailError ? 'Email should include @' : ''}
              fullWidth
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              SignIn
            </Button>
            {signInError && (
              <Typography color="error" style={{ marginTop: '16px' }}>
                {signInError}
              </Typography>
            )}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
