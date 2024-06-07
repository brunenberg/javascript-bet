class Weather {
    constructor(cityInfo) {
        this.cityInfo = cityInfo;
        this.apiKey = '3ecd629ca2d2d34c7d2974c446a66534';
    }

    fetchWeather() {
        let url;
        const messageContainer = document.getElementById('messageContainer');

        if (!isNaN(this.cityInfo)) {
            // city ID
            url = `http://api.openweathermap.org/data/2.5/forecast?id=${this.cityInfo}&appid=${this.apiKey}`;
        } else {
            // city name
            url = `http://api.openweathermap.org/data/2.5/weather?q=${this.cityInfo}&appid=${this.apiKey}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weerdata kon niet worden opgehaald.');
                }
                return response.json();
            })
            .then(data => {
                messageContainer.textContent = 'Weerdata succesvol opgehaald!\n' + ((data.main.temp - 272.15).toFixed(1)) + '°C\nWindsnelheid: ' + data.wind.speed + ' m/s';
                messageContainer.style.color = 'green';
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                messageContainer.textContent = 'Fout bij het ophalen van weerdata.';
                messageContainer.style.color = 'red';
            });
    }
}