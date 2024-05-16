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
});