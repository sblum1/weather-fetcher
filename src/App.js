import { useState, useEffect } from 'react';
import { apiKey, latLongURI, currWeatherURI } from './openWeatherResources';
import { states } from './states';
import "./style.css"
import axios from 'axios';

function App() {
  /* 
    VARIABLES 
    ---------
  */

  // Loading variable for conditional rendering
  const [loading, setLoading] = useState(false);

  // Location useState variable and onChange function
  const [location, setLocation] = useState('');
  function changeLocation(event) {
    setLocation(event.target.value);
  }

  // State useState variable and onChange function
  const [usaState, setUsaState] = useState(states[0].abbreviation);
  const changeUsaState = (e) => {
    console.log(e.target.value);
    setUsaState(e.target.value);
  }

  // Weather useState data (temperature in Fahrenheit)
  const [temp, setTemp] = useState(null);

  /* 
    COMPONENTS 
    ----------
  */

  // State select dropdown component
  const StateSelect = () => {
    return (
      <form> 
        <select value={usaState} onChange={(e) => changeUsaState(e)}>
          {states.map((state) => {
            return (
              <option value={state.abbreviation} key={state.abbreviation}>
                {state.abbreviation}
              </option>
            )
          })}
        </select>
      </form>
    )
  }

  /* 
    FUNCTIONS 
    ---------
  */

  // Get full state string from abbreviation
  const getFullStateStr = () => {
    const stateObj = states.find(state => state.abbreviation === usaState);
    return stateObj.name;
  }

  // Create URI String based on user input to get lat and long
  const getLatLongStr = () => {
    return `${latLongURI}?q=${location},${getFullStateStr(usaState)},US&limit=1&appid=${apiKey}`;
  }

  // Create URI String to fetch data from current weather API
  const getCurrWeatherStr = (data) => {
    return `${currWeatherURI}?lat=${data.lat}&lon=${data.lon}&appid=${apiKey}`;
  }

  // Convert from Kelvin to Fahrenheit
  const convertToFahrenheit = (kelvinTemp) => {
    return Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);
  }

  // Get temperature function
  const getTemp = async () => {
    // First get lat and long of city and state
    setLoading(true);
    await axios.get(getLatLongStr())
        .then(async (res) => {
          console.log(res.data[0]);
          let data = res.data[0];
          await axios.get(getCurrWeatherStr(data))
            .then((res) => {
              console.log(res.data); 
              let tempInKelvin = res.data.main.temp;
              let tempInFahrenheit = convertToFahrenheit(tempInKelvin);
              console.log(tempInFahrenheit);
              setTemp(tempInFahrenheit);
              setLoading(false);
            })
        })
  }

  // Clear weather and inputs
  const clearWeather = () => {
    setTemp(null);
    setLocation("");
    setUsaState();
  }

  // Update UI anytime temperature changes
  useEffect(() => {
    console.log('temp: ' + temp);
  }, [temp])

  return (
      <div className="wrapper">
        <div className="input-container">
          <input value={location} onChange={changeLocation} placeholder="Put city here" className='location-input' />
          <StateSelect />
        </div>
        <div>
          <button onClick={getTemp} className="weather-buttons">Get weather</button>
          {temp === null ? (<></>) : (<button className="weather-buttons" onClick={clearWeather}>Clear weather</button>)}
        </div>
        <div>
          {temp === null ? (<></>) : loading ? (<h1>Loading...</h1>) : (<h1>{temp} degrees</h1>)}
        </div>
      </div>
  );
}

export default App;
