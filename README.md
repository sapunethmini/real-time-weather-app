# Real-Time Weather Dashboard

This is a comprehensive, real-time weather dashboard created as a final project for the iCET Certified Master in Web Development program. The application is built using modern front-end technologies and integrates multiple APIs to provide users with current, future, and historical weather data in a user-friendly interface.


## Features

-   **Current Weather Display:** Shows real-time conditions including temperature, "feels like" temperature, humidity, wind speed, precipitation, and UV index.
-   **7-Day & Hourly Forecast:** Toggle between a 7-day daily forecast and a 24-hour hourly forecast.
-   **Historical Data:** Displays a 7-day historical weather trend in an interactive line chart.
-   **Global Search:** Users can search for any city, region, or country worldwide.
-   **Geolocation:** Instantly fetch weather for the user's current location with a single click.
-   **Interactive Map with Layers:** A dynamic map showing the location, with the ability to overlay precipitation, cloud, and temperature layers.
-   **Severe Weather Alerts:** Displays official weather alerts for the selected location when available.
-   **Dual Unit System:** Seamlessly switch between Metric (°C, kph) and Imperial (°F, mph) units.
-   **Light & Dark Mode:** A theme switcher for user comfort and preference.
-   **Fully Responsive Design:** Optimized for a great user experience on desktops, tablets, and mobile devices.

## Technologies Used

-   **Core:** HTML5, CSS3 (Flexbox, Grid), Vanilla JavaScript (ES6+)
-   **Libraries:**
    -   [Leaflet.js](https://leafletjs.com/): For interactive maps.
    -   [Chart.js](https://www.chartjs.org/): For rendering the historical data chart.
-   **APIs:**
    -   [**WeatherAPI.com**](https://www.weatherapi.com/): For current weather, forecast data, and alerts.
    -   [**Open-Meteo API**](https://open-meteo.com/): For 7-day historical weather data.
    -   [**OpenWeatherMap API**](https://openweathermap.org/): For the map's weather overlay layers.
-   **Development Tools:**
    -   Git & GitHub
    -   Visual Studio Code
-   **Deployment:**
    -   GitHub Pages

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone [[https://github.com/sapunethmini/real-time-weather-app.git](https://github.com/sapunethmini/real-time-weather-app.git](https://github.com/sapunethmini/real-time-weather-app.git))
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd real-time-weather-app
    ```

3.  **Get API Keys:** This project requires **two** separate, free API keys.
    -   Sign up at [WeatherAPI.com](https://www.weatherapi.com/) to get your primary weather data key.
    -   Sign up at [OpenWeatherMap.org](https://openweathermap.org/) to get a key for the map overlays.

4.  **Add API Keys to the Script:**
    -   Open the `script.js` file.
    -   Find the `// --- API KEYS ---` section at the top.
    -   Paste your keys into the corresponding placeholder variables:
        ```javascript
        const weatherApiKey = 'YOUR_WEATHERAPI.COM_KEY_HERE';
        const openWeatherMapApiKey = 'YOUR_OPENWEATHERMAP.ORG_KEY_HERE';
        ```

5.  **Run the Application:**
    -   Simply open the `index.html` file in your web browser.
    -   For the best development experience, use a live server extension (like "Live Server" in VS Code).

## Project Requirements Checklist

This project successfully fulfills the requirements outlined in the course module:

-   [x] Current weather display
-   [x] Forecast display (Daily & Hourly)
-   [x] Location-based weather (Search & Geolocation)
-   [x] Historical weather data (Implemented via a supplementary API)
-   [x] Interactive maps (with advanced weather overlays)
-   [x] Alerts and notifications
-   [x] Multiple units and formats
-   [x] Responsive design
-   [x] User customization (Themes & Units)
-   [x] API integration (Multiple APIs)
-   [x] Performance optimization
-   [x] User-friendly interface
-   [x] Cross-browser compatibility
-   [x] Security (Implemented HTTPS; API key protection strategy documented).

## Acknowledgments

-   Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/), [Open-Meteo](https://open-meteo.com/), and [OpenWeatherMap](https://openweathermap.org/).
-   Icons and assets from various open-source libraries.
-   Design inspiration from UI/UX examples on Dribbble.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
