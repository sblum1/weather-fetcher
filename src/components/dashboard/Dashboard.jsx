import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrWeatherStr, getForecastStr, getLatLongStr, parseForecastData } from '../../util/weatherFunctions';
import { statesWithAbbreviations } from '../../statesWithAbbreviations';
import { styled } from '@mui/material/styles';
import { Avatar, Autocomplete, Button, Container, CssBaseline, Box, Toolbar, List, Typography, Divider, Grid, IconButton, Paper, TextField }  from '@mui/material';

import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Chart from './Chart';
import { mainListItems } from './listItems';
import { secondaryListItems } from './listItems';
import { ForecastTable } from './ForecastTable';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Get weather data for users current location; includes current weather and forecast
  const getWeatherData = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Save both URIs as strings 
        let uris = [getCurrWeatherStr(latitude, longitude), getForecastStr(latitude, longitude)]

        // Make requests and return promises
        const requests = uris.map((uri) => axios.get(uri));

        await axios.all(requests).then((responses) => {
          for (let i = 0; i < responses.length; i++) {
            // Current weather data
            if (i === 0) {
              setWeatherData(responses[i].data)
            // Forecast data
            } else {
              let forecastData = responses[i].data.list;
              // Get average of next 5 days
              // Each day will have an object like the following: {day: Friday, icon: ...png, min temp, max temp}
              setForecastData(parseForecastData(forecastData))
            }
          }
          setLoading(false);
        })
    }) 
  }

  // Get weather data and forecast for data input by user (city and state)
  const getUserInputWeatherData = async () => {
    const inputCity = document.getElementById("cityInputField").value;
    const inputState = document.getElementById("usaStateInputField").value;
    
    // Make URI string for get lat and long of city and state
    const latLongURI = getLatLongStr(inputCity, inputState);

    // Get lat & long, and then get weather data
    await axios.get(latLongURI).then(async (res) => {
      const latitude = res.data[0].lat;
      const longitude = res.data[0].lon;

      let uris = [getCurrWeatherStr(latitude, longitude), getForecastStr(latitude, longitude)];

      // Make requests and return promises
      const requests = uris.map((uri) => axios.get(uri));

      await axios.all(requests).then((responses) => {
        for (let i = 0; i < responses.length; i++) {
          // Current weather data
          if (i === 0) {
            setWeatherData(responses[i].data)
          // Forecast data
          } else {
            let forecastData = responses[i].data.list;
            // Get average of next 5 days
            // Each day will have an object like the following: {day: Friday, icon: ...png, min temp, max temp}
            setForecastData(parseForecastData(forecastData))
          }
        }
        setLoading(false);
      })
    })
  }

  const Navbar = () => (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Weather App
        </Typography>
      </Toolbar>
    </AppBar>
  )

  const Menu = () => (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {mainListItems}
        <Divider sx={{ my: 1 }} />
        {secondaryListItems}
      </List>
    </Drawer>
  )

  // Icon element for current weather
  const MainIconImage = () => (
    <Avatar
        sx={{ width: 60, height: 60, backgroundColor: "lightblue" }}
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
    />
  )

  // Current weather in the given location
  const MainWeatherCard = () => (
      <>
        <Container maxWidth="xs" sx={{ display: "flex",  flexDirection: "column", mt: 4, mb: 2 }}>
            <Box display="flex" sx={{justifyContent: "center", alignItems: "center", textAlign: "center", marginBottom: "20px"}}>
              <Typography component="h2" variant="h5" color="primary" marginRight={3}>{weatherData.name}</Typography>
              <MainIconImage />
              <Typography component="h2" variant="h5" color="primary" marginLeft={3}>{Math.round(weatherData.main.temp)}° F</Typography>
            </Box>
      </Container>
    </>
  )

  // Search field for states that autocompletes states
  const SearchField = () => {
    const statesArr = statesWithAbbreviations.map((obj) => {
      return obj.name;
    })
  
    return (
      <Box display="flex" justifyContent={"center"} alignItems='center' flexDirection={ {xs: 'column', sm: 'row' } } 
            mt={{xs: 1, sm: 2}} mr={{xs: 2, sm: 0}} ml={{xs: 2, sm: 0}}>
        {/* User enters city */}
        <Box display="flex">
          <TextField label="City" variant="standard" 
              sx={{ marginRight: 4 }} id="cityInputField"  />
    

          {/* User enters state */}
          <Autocomplete sx={{ minWidth: { xs: 150, sm: 200 } }} disablePortal options={statesArr} autoComplete
                        renderInput={(params) => <TextField {...params} label="State" variant="standard" />} id="usaStateInputField" />
        </Box>
  
     
        {/* User gets weather for input city and state */}
        <Button variant="contained" sx={{ marginLeft: {xs: 0, sm: 4 }, 
            marginTop: { xs: 2, sm: 0 }, width: { xs: "100%", sm: "max-content "} }}
            onClick={() => { getUserInputWeatherData() }}
          >
              Get weather
          </Button>
      </Box>
    )
  }

  // Main landing page component
  const DashboardContent = () => (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* Navbar component */}
        <Navbar />

        {/* Drawer component */}
        <Menu />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            paddingLeft: {xs: 1, sm: 5},
            paddingRight: {xs: 1, sm: 5},
            paddingBottom: 2
          }}
        >
          <Toolbar />

          {/* Search field for user */}
          <SearchField />

          {/* Shows weather and location of where user is */}
          <MainWeatherCard />

          {/* Shows forecast data in table form */}
          <Box display="flex" flexDirection={ {xs: "column", sm: "row" } } alignItems="center">
            <ForecastTable forecastData={forecastData} />
            <Chart data={forecastData.map(({ weekday, avgTemp }) => ({ weekday, avgTemp }) )} />
          </Box>
        </Box>
      </Box>
    )

    useEffect(() => {
      getWeatherData();
    }, []);

    return (
      <>
        {loading || weatherData === null ? (
            <>Loading...</>
        ) : (
            <DashboardContent />
        )}
      </>
    );
}