class Truck {
    constructor(length, width, interval, type) {
        this.length = length;
        this.width = width;
        this.interval = interval * 1000; // Convert seconds to milliseconds
        this.type = type;
        this.grid = Array.from({ length: length }, () => Array.from({ length: width }, () => ""));
    }

    // Clears the truck's grid
    clearGrid() {
        this.grid = Array.from({ length: this.length }, () => Array.from({ length: this.width }, () => ""));
    }

    // Simulates sending the truck away and returning after the interval
    sendAndReturn(callback) {
        // Clear the grid immediately to simulate sending the truck away
        this.clearGrid();

        // Set a timeout to simulate the truck returning after the interval
        setTimeout(() => {
            if (callback) {
                callback(this); // Call the provided callback function when the truck returns
            }
        }, this.interval);
    }

    // Weather rules
    async checkWeather() {
        const weatherInput = document.getElementById('weatherLocation').value;
        if (weatherInput === '') {
            return true; // No weather input, so no weather check
        }
        const weatherAPI = new Weather(weatherInput);
        const weather = await weatherAPI.fetchWeather();
        console.debug('Weather in Truck.js:', weather, 'Truck type:', this.type);
        if (this.type === 'cold') {
            // Als het boven de 35 graden is rijd de Koud transport niet.
            if (weather.main.temp - 272.15 > 35) {
                console.debug('Too hot for cold transport');
                return false;
            }
        } else if (this.type === 'fragile') {
            // Als het regent of sneeuwt rijd de Breekbaar Transport niet.
            if (weather.weather[0].main === 'Rain'
                || weather.weather[0].main === 'Snow'
                || weather.weather[0].main === 'Drizzle'
                || weather.weather[0].main === 'Thunderstorm') {
                console.debug('Too wet for fragile transport');
                return false;
            }
        } else if (this.type === 'pallets') {
            // Bij harde wind rijdt de palletvrachtwagen niet.
            if (weather.wind.speed > 10) {
                console.debug('Too windy for pallet transport');
                return false;
            }
        } else {
            return true; // No weather check for other types of transport
        }
    }
}