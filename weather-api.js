const apiKey = '3ecd629ca2d2d34c7d2974c446a66534';

function fetchWeather(cityInfo) {
    let url;
    const messageContainer = document.getElementById('messageContainer');

    // Check if cityInfo is a number (city ID) or a string (city name)
    if (!isNaN(cityInfo)) {
        // It's a city ID
        url = `http://api.openweathermap.org/data/2.5/forecast?id=${cityInfo}&appid=${apiKey}`;
    } else {
        // It's a city name
        url = `http://api.openweathermap.org/data/2.5/weather?q=${cityInfo}&appid=${apiKey}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weerdata kon niet worden opgehaald.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            messageContainer.textContent = 'Weerdata succesvol opgehaald!';
            messageContainer.style.color = 'green';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            messageContainer.textContent = 'Fout bij het ophalen van weerdata.';
            messageContainer.style.color = 'red';
        });
}
