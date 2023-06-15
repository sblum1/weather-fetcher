import { useEffect } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import SignIn from "./components/auth/SignIn";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d1939',
    },
    secondary: {
      main: '#d0a84c',
    },
  },
})

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
