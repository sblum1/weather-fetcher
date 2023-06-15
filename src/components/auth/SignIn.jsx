import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, FormControlLabel, Checkbox, Typography, Container, Divider, Alert } from '@mui/material';

// Add error handling
export default function SignIn() {
  const navigate = useNavigate();

  // State variable that stores the email and password entered by the user   
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  // State variable that stores the error message to be displayed if necessary   
  const [errorMessage, setErrorMessage] = useState(null);

  // Destructure credentials state variable   
  const { email, password } = credentials;

  // Filler credentials object that mocks a valid login   
  const correctCredentials = { "email": "sethblumer1@gmail.com", "password": "Password123!"}

  // Update values of credentials state variable upon user typing   
  const handleChange = (e) => {
    let { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Checks if user entered a valid e-mail   
  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // Error handling upon signing in   
  const validateCredentials = () => {
    let isValid = true; 

    // Check credentials if user has entered both e-mail and password
    if (email !== correctCredentials.email || password !== correctCredentials.password) {
        isValid = false;
        setErrorMessage("The credentials you entered are incorrect. Please try again.")
    }

    // Check if password field is empty
    if (password === "") {
        isValid = false;
        setErrorMessage("The password field is empty. Please enter a valid password.")
    } 

    // Check if email is blank or e-mail is invalid
    if (email === "" || !validateEmail(email)) {
        isValid = false;
        setErrorMessage("Please enter a valid e-mail address");
    } 

    return isValid;
  }

  // Validates the credentials; if they are valid, redirects to home page   
  const checkCredentials = () => {
    validateCredentials();
    if (validateCredentials()) {
        sessionStorage.setItem("isSignedIn", true);
        navigate("/");
    }
  }

  // Checks if user is already signed in to redirect to home page   
  const checkIfLoggedIn = () => {
    const isSignedIn = JSON.parse(sessionStorage.getItem("isSignedIn"))
    if (isSignedIn === true) {
      navigate("/");
    }
  }

  // Upon page render, checks if user is logged in to redirect to home page. 
  // Also re-renders if an error message needs to be displayed   
  useEffect(() => {
    checkIfLoggedIn();
  }, [navigate, errorMessage])

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Sign in header */}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          {/* Display error message if needed */}
          {errorMessage && <Alert sx={{ mt: 3 }}severity="error">{errorMessage}</Alert>}

          {/* E-mail input field */}
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
              value={email}
            />

            {/* Password input field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              value={password}
            />

            {/* Sign in button which checks credentials */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
              onClick={checkCredentials}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
  );
}