const transportTypes = [
    { value: 'cold', display: 'Koud transport' },
    { value: 'fragile', display: 'Breekbaar transport' },
    { value: 'general', display: 'Algemeen transport' },
    { value: 'pallets', display: 'Pallets' },
    { value: 'express', display: 'Snelkoerier' }
];

function loadTransportTypes() {
    const selectElement = document.getElementById('type');
    selectElement.innerHTML = '';
    transportTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.display;
        selectElement.appendChild(option);
    });
}

function createTruck(length, width, interval, type) {
    
}

function generatePackage() {

}

document.addEventListener('DOMContentLoaded', function() {
    loadTransportTypes();

    document.getElementById('truckForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the page from reloading

        // Collect the values of the input fields
        const length = document.getElementById('length').value;
        const width = document.getElementById('width').value;
        const interval = document.getElementById('interval').value;
        const type = document.getElementById('type').value;

        // Add a new Truck instance and call the create method
        const truck = new Truck(length, width, interval, type);
        truck.create();
    });

    document.getElementById('fetchWeatherButton').addEventListener('click', function() {
        const cityInfo = document.getElementById('weatherLocation').value;

        // Add a new Weather instance and call the fetchWeather method
        const weather = new Weather(cityInfo);
        weather.fetchWeather();
    });
});