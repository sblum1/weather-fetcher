import axios from "axios";
import { apiKey, latLongURI, currWeatherURI, forecastURI } from "../openWeatherResources";

// Create URI String to fetch data from current weather from API
export const getCurrWeatherStr = (lat, long) => {
    return `${currWeatherURI}?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
}

// Create URI string to fetch data for forecast data from API
export const getForecastStr = (lat, long) => {
    return `${forecastURI}?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`
}

export const getLatLongStr = (city, state) => {
    return `${latLongURI}?q=${city},${state},US&limit=1&appid=${apiKey}`;
}

// Capitalize first letter of weather description string
export const capitalizeFirstLetter = (description) => {
    let descriptionStr = description.charAt(0).toUpperCase() + description.slice(1);
    return descriptionStr;
}

// Get most common value in an array
const getMostCommonVal = (arr) => {
    const arrCounts = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    const mostCommonVal = Object.keys(arrCounts).reduce((a, b) => arrCounts[a] > arrCounts[b] ? a : b);

    return mostCommonVal;
}

// Group forecast data (which is every 3 hours over the span of 5 days) by date and get the average of each day
export const parseForecastData = (forecastArr) => {
    let parsedForecastData = [];

    // Group data by date
    const groupedData = Object.values(forecastArr.reduce((acc, obj) => {
        // Extract date part of the timestamp
        const date = obj.dt_txt.split(" ")[0];

        if (acc[date]) {
            acc[date].push(obj);
        } else {
            acc[date] = [obj];
        }

        return acc;
    }, {}));

    groupedData.forEach((day) => {
        let temps = [];
        let weatherTypes = [];
        let icons = [];
        let lows = [];
        let highs = [];

        day.forEach((obj) => {
            temps.push(obj.main.temp);
            weatherTypes.push(obj.weather[0].description);
            icons.push(obj.weather[0].icon);
            lows.push(obj.main.temp_min);
            highs.push(obj.main.temp_max);
        })

        // Get the date timestamp
        const date = day[0].dt_txt;

        // Get the day of the week
        const dateObj = new Date(day[0].dt_txt);
        const weekday = dateObj.toLocaleDateString('en-US', {weekday: 'short'});

        // Calculate the average temperature for the day
        const avgTemp = Math.round(temps.reduce((sum, num) => sum + num, 0) / temps.length);

        // Count each type of weather from throughout the day and return the most common value
        const weather = getMostCommonVal(weatherTypes);

        // Count each type of icon from throughout the day and return the most common value
        const icon = getMostCommonVal(icons);

        // Get the lowest temperature for the day
        const minTemp = Math.round(Math.min(...lows));

        // Get the highest temperature for the day
        const maxTemp = Math.round(Math.max(...highs));

        parsedForecastData.push( { date, weekday, weather, icon, avgTemp, minTemp, maxTemp });
    })

    console.log(parsedForecastData);
    return parsedForecastData;
} 