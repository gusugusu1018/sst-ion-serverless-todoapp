import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { confirmSignUp, signUp } from 'aws-amplify/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpButtonProps {
  onSignUp: () => void;
}

function validatePassword(password: string): string | undefined {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (!/\d/.test(password)) {
    return 'Password must contain at least one digit';
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain at least one special character';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  return undefined;
}

export const SignUpButton: React.FC<SignUpButtonProps> = ({ onSignUp }) => {
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [stage, setStage] = useState<'signUp' | 'confirm'>('signUp');
  const [signUpError, setSignUpError] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => {
    setIsSignUpDialogOpen(true);
  };

  const handleClose = () => {
    setIsSignUpDialogOpen(false);
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

  const handleOnPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPassword(event.target.value);
    const error = validatePassword(password);
    setSignUpError(error || '');
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const credentials = {
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      };
      await signUp(credentials);
      setStage('confirm');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSignUpError(error.message);
      } else {
        setSignUpError('An unknown error occurred');
      }
      console.error('Error signing up', error);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      const credentials = {
        username: email,
        confirmationCode,
      };
      await confirmSignUp(credentials);
      navigate('/');
      onSignUp();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSignUpError(error.message);
      } else {
        setSignUpError('An unknown error occurred');
      }
      console.error('Error signing up', error);
    }
  };

  return (
    <>
      <Button variant="text" onClick={handleOpen}>
        Sign Up
      </Button>
      <Dialog open={isSignUpDialogOpen} onClose={handleClose}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          {stage === 'signUp' ? (
            <>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                helperText={emailError ? 'Invalid email address' : ''}
              />
              <TextField
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={handleOnPasswordChange}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleSignUp}>
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Confirmation Code"
                fullWidth
                margin="normal"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleConfirmSignUp}>
                Confirm Sign Up
              </Button>
            </>
          )}
          {signUpError && (
            <Typography color="error" style={{ marginTop: '16px' }}>
              {signUpError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
