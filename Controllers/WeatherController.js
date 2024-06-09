class WeatherController {
    constructor(mainController) {
        this.mainController = mainController;
        this.weatherButton = document.getElementById('fetchWeatherButton');
        this.weatherLocationInput = document.getElementById('weatherLocation');
        this.attachWeatherEventListeners();
    }

    attachWeatherEventListeners() {
        this.weatherButton.addEventListener('click', () => {
            this.fetchAndDisplayWeather();
        });
    }

    async fetchAndDisplayWeather() {
        const cityInfo = this.weatherLocationInput.value;
        if (cityInfo) {
            const weather = new Weather(cityInfo);
            try {
                const weatherData = await weather.fetchWeather();
                // Process and display weather data
                console.log(weatherData);
                // Call displayTrucks if needed after fetching weather
                this.mainController.loadingDockController.currentDock.displayTrucks();
            } catch (error) {
                console.error('Failed to fetch weather data:', error);
            }
        }
    }
}