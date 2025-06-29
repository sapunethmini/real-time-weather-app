document.addEventListener('DOMContentLoaded', () => {
    // --- API KEYS (ACTION REQUIRED) ---

    // FIX: The variable for WeatherAPI.com was missing. It has been added back.
    // Key for current weather and forecast from WeatherAPI.com
    const weatherApiKey = '42c01faf2f2a49c5bf643937252906'; // This is your main key for weather data.

    // Key for map layers from OpenWeatherMap.org
    // IMPORTANT: This is a DIFFERENT key that you must get from OpenWeatherMap.org for the map layers to work.
    const openWeatherMapApiKey = 'YOUR_OPENWEATHERMAP_API_KEY_HERE'; 


    // --- ELEMENT REFERENCES ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const geoButton = document.getElementById('geolocation-button');
    const themeSwitcher = document.getElementById('theme-switcher');
    const celsiusBtn = document.getElementById('celsius-btn');
    const fahrenheitBtn = document.getElementById('fahrenheit-btn');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const weatherContainer = document.getElementById('weather-container');
    const forecastContainer = document.getElementById('forecast-container');
    const dailyForecastBtn = document.getElementById('daily-forecast-btn');
    const hourlyForecastBtn = document.getElementById('hourly-forecast-btn');
    const historicalDataPlaceholder = document.getElementById('historical-data-placeholder');

    // ---STATE MANAGEMENT---
    const apiBaseUrl = 'https://api.weatherapi.com/v1';
    let currentUnit = 'c';
    let map;
    let currentWeatherData = null;
    let forecastView = 'daily';
    let historicalChartInstance = null;

    // ---EVENT LISTENERS---
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    geoButton.addEventListener('click', handleGeolocation);
    themeSwitcher.addEventListener('click', toggleTheme);
    celsiusBtn.addEventListener('click', () => switchUnit('c'));
    fahrenheitBtn.addEventListener('click', () => switchUnit('f'));
    dailyForecastBtn.addEventListener('click', () => setForecastView('daily'));
    hourlyForecastBtn.addEventListener('click', () => setForecastView('hourly'));

    // --- MAIN FUNCTIONS ---

    async function fetchWeatherData(location) {
        showLoader(true);
        hideError();
        weatherContainer.classList.add('d-none');
        const url = `${apiBaseUrl}/forecast.json?key=${weatherApiKey}&q=${location}&days=7&aqi=no&alerts=yes`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
            }
            currentWeatherData = await response.json();
            updateUI();
        } catch (error) {
            showError(`Could not fetch weather data: ${error.message}`);
        } finally {
            showLoader(false);
        }
    }

    function updateUI() {
        if (!currentWeatherData) return;
        weatherContainer.classList.remove('d-none');
        updateUnitButtons();
        updateCurrentWeather();
        updateForecast();
        updateAlerts();
        updateMap();
        const { lat, lon } = currentWeatherData.location;
        fetchHistoricalData(lat, lon);
    }
    
    // --- COMPONENT-SPECIFIC FUNCTIONS ---

    function updateCurrentWeather() {
        const { current, location } = currentWeatherData;
        document.getElementById('location-name').textContent = `${location.name}, ${location.country}`;
        document.querySelector('.last-updated').textContent = `Last updated: ${new Date(current.last_updated_epoch * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        document.getElementById('current-weather-desc').textContent = current.condition.text;
        document.getElementById('current-weather-icon').src = `https:${current.condition.icon}`;
        document.querySelector('#current-weather .detail-card:nth-child(2) .detail-value').textContent = `${current.humidity}%`;
        
        if (currentUnit === 'c') {
            document.getElementById('current-temp').innerHTML = `${Math.round(current.temp_c)}&deg;`;
            document.querySelector('#current-weather .detail-card:first-child .detail-value').textContent = `${Math.round(current.feelslike_c)}°`;
            document.getElementById('current-wind').textContent = `${current.wind_kph} kph`;
            document.getElementById('current-precip').textContent = `${current.precip_mm} mm`;
        } else {
            document.getElementById('current-temp').innerHTML = `${Math.round(current.temp_f)}&deg;F`;
            document.querySelector('#current-weather .detail-card:first-child .detail-value').textContent = `${Math.round(current.feelslike_f)}°`;
            document.getElementById('current-wind').textContent = `${current.wind_mph} mph`;
            document.getElementById('current-precip').textContent = `${current.precip_in} in`;
        }
        document.querySelector('.detail-card:nth-child(4) .detail-value').textContent = current.uv;
    }

    function setForecastView(view) {
        forecastView = view;
        dailyForecastBtn.classList.toggle('active', view === 'daily');
        hourlyForecastBtn.classList.toggle('active', view === 'hourly');
        updateForecast();
    }

    function updateForecast() {
        if (!currentWeatherData) return;
        if (forecastView === 'daily') {
            renderDailyForecast();
        } else {
            renderHourlyForecast();
        }
    }

    function renderDailyForecast() {
        forecastContainer.className = 'forecast-grid';
        forecastContainer.innerHTML = '';
        const { forecastday } = currentWeatherData.forecast;
        forecastday.forEach(day => {
            const date = new Date(day.date + 'T00:00:00');
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const maxTemp = currentUnit === 'c' ? `${Math.round(day.day.maxtemp_c)}&deg;` : `${Math.round(day.day.maxtemp_f)}&deg;`;
            const minTemp = currentUnit === 'c' ? `${Math.round(day.day.mintemp_c)}&deg;` : `${Math.round(day.day.mintemp_f)}&deg;`;
            const forecastCardHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">${dayName}</h6>
                        <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="weather-icon-sm">
                        <p class="card-text"><strong>${maxTemp}</strong> / ${minTemp}</p>
                        <p class="card-text" style="font-size: 0.8rem; color: var(--gray-500);">${day.day.condition.text}</p>
                        <p class="card-text"><small>Rain: ${day.day.daily_chance_of_rain}%</small></p>
                    </div>
                </div>
            `;
            forecastContainer.innerHTML += forecastCardHTML;
        });
    }

    function renderHourlyForecast() {
        forecastContainer.className = 'forecast-grid hourly-view';
        forecastContainer.innerHTML = '';
        const currentHour = new Date().getHours();
        const todaysHours = currentWeatherData.forecast.forecastday[0].hour.slice(currentHour);
        const tomorrowsHours = currentWeatherData.forecast.forecastday[1].hour;
        const next24Hours = [...todaysHours, ...tomorrowsHours].slice(0, 24);
        next24Hours.forEach(hour => {
            const date = new Date(hour.time_epoch * 1000);
            const displayTime = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const temp = currentUnit === 'c' ? `${Math.round(hour.temp_c)}&deg;` : `${Math.round(hour.temp_f)}&deg;`;
            const hourlyCardHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">${displayTime}</h6>
                        <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" class="weather-icon-sm">
                        <p class="card-text"><strong>${temp}</strong></p>
                    </div>
                </div>
            `;
            forecastContainer.innerHTML += hourlyCardHTML;
        });
    }

    async function fetchHistoricalData(lat, lon) {
        document.getElementById('historical-chart').style.display = 'block';
        historicalDataPlaceholder.classList.add('d-none');
        const endDate = new Date();
        const startDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        startDate.setDate(startDate.getDate() - 7);
        const formatDate = (date) => date.toISOString().split('T')[0];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch historical data.');
            const data = await response.json();
            renderHistoricalChart(data);
        } catch (error) {
            console.error("Historical Data Error:", error);
            document.getElementById('historical-chart').style.display = 'none';
            historicalDataPlaceholder.classList.remove('d-none');
        }
    }

    function renderHistoricalChart(data) {
        const ctx = document.getElementById('historical-chart').getContext('2d');
        const labels = data.daily.time.map(t => new Date(t + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }));
        const maxTemps = data.daily.temperature_2m_max;
        const minTemps = data.daily.temperature_2m_min;
        if (historicalChartInstance) {
            historicalChartInstance.destroy();
        }
        historicalChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Max Temp (°C)',
                    data: maxTemps,
                    borderColor: '#dc2626',
                    backgroundColor: '#fecaca',
                    tension: 0.2
                }, {
                    label: 'Min Temp (°C)',
                    data: minTemps,
                    borderColor: '#2563eb',
                    backgroundColor: '#dbeafe',
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true }, title: { display: false } },
                scales: { y: { ticks: { callback: (value) => value + '°C' } } }
            }
        });
    }

    function updateMap() {
        const { lat, lon } = currentWeatherData.location;
        const locationName = currentWeatherData.location.name;
        const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' });
        const precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${openWeatherMapApiKey}`);
        const cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${openWeatherMapApiKey}`);
        const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${openWeatherMapApiKey}`);
        const baseMaps = { "Street Map": baseLayer };
        const overlayMaps = { "Precipitation": precipitationLayer, "Clouds": cloudsLayer, "Temperature": tempLayer };
        if (!map) {
            map = L.map('map', { zoomControl: true, layers: [baseLayer] }).setView([lat, lon], 10);
            L.control.layers(baseMaps, overlayMaps).addTo(map);
        } else {
            map.setView([lat, lon], 10);
        }
        L.marker([lat, lon]).addTo(map).bindPopup(`<b>${locationName}</b>`);
    }

    function updateAlerts() {
        const alertsContainer = document.getElementById('weather-alerts');
        alertsContainer.innerHTML = '';
        const { alerts } = currentWeatherData;
        if (alerts && alerts.alert.length > 0) {
            alerts.alert.forEach(alert => {
                const alertDiv = `
                    <div class="info-banner" style="background-color: #fffbeb; border-color: #fde68a; margin-bottom: 2rem;">
                         <div class="info-icon" style="color: #facc15;">⚠️</div>
                         <div class="info-text">
                            <strong>${alert.event}:</strong> ${alert.headline}
                         </div>
                    </div>
                `;
                alertsContainer.innerHTML += alertDiv;
            });
        }
    }

    // --- UTILITY & HELPER FUNCTIONS ---

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) fetchWeatherData(query);
    }

    function handleGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchWeatherData(`${position.coords.latitude},${position.coords.longitude}`),
                () => showError('Unable to retrieve your location. Please grant permission.')
            );
        } else {
            showError('Geolocation is not supported by your browser.');
        }
    }

    function switchUnit(unit) {
        if (unit !== currentUnit) {
            currentUnit = unit;
            updateUI();
        }
    }
    
    function toggleTheme() {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-bs-theme', newTheme);
    }

    function updateUnitButtons() {
        celsiusBtn.classList.toggle('active', currentUnit === 'c');
        fahrenheitBtn.classList.toggle('active', currentUnit === 'f');
    }

    const showLoader = (show) => loader.classList.toggle('d-none', !show);

    function showError(message) {
        errorMessage.querySelector('.error-text').textContent = message;
        errorMessage.classList.remove('d-none');
    }

    const hideError = () => {
        errorMessage.classList.add('d-none');
        errorMessage.querySelector('.error-text').textContent = '';
    };

    // --- INITIALIZATION ---
    fetchWeatherData('Colombo');
});