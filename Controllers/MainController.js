const transportTypes = [
    { value: 'cold', display: 'Koud transport' },
    { value: 'fragile', display: 'Breekbaar transport' },
    { value: 'general', display: 'Algemeen transport' },
    { value: 'pallets', display: 'Pallets' },
    { value: 'express', display: 'Snelkoerier' }
];

const loadingdock1id = 'LoadingDock1';
const loadingdock2id = 'LoadingDock2';

const loadingdock1 = new LoadingDock(loadingdock1id);
const loadingdock2 = new LoadingDock(loadingdock2id);

let currentDock = loadingdock1;

document.addEventListener('DOMContentLoaded', function() {
    loadTransportTypes();
    attachEventListeners();
    setDefaultActiveDock();
});

function setDefaultActiveDock() {
    const defaultDockId = loadingdock1id;
    const defaultButton = document.querySelector(`button[data-dock-id="${defaultDockId}"]`);
    if (defaultButton) {
        defaultButton.classList.add("active");
        openDock({ target: defaultButton }, defaultDockId);
    }
}

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

function attachEventListeners() {
    // Attach event listeners to dock buttons
    document.getElementById('dockTabs').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            // Remove active class from all buttons
            var tablinks = document.getElementsByClassName("tablink");
            for (var i = 0; i < tablinks.length; i++) {
                tablinks[i].classList.remove("active");
            }
            // Add active class to the clicked button
            event.target.classList.add("active");

            // Call openDock to change the content
            const dockId = event.target.getAttribute('data-dock-id');
            openDock(event, dockId);
        }
    });

    // Attach event listener to the truck form submission
    document.getElementById('truckForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the page from reloading

        const length = document.getElementById('length').value;
        const width = document.getElementById('width').value;
        const interval = document.getElementById('interval').value;
        const type = document.getElementById('type').value;

        const truck = new Truck(length, width, interval, type);
        currentDock.addTruck(truck);
    });

    // Attach event listener for weather fetching
    document.getElementById('fetchWeatherButton').addEventListener('click', function() {
        const cityInfo = document.getElementById('weatherLocation').value;
        const weather = new Weather(cityInfo);
        weather.fetchWeather();
    });

    // Attach event listeners for conveyor belt and packages
    const conveyor = new Conveyor();
    conveyor.init();

    // Load transport types
    loadTransportTypes();
}

function openDock(evt, dockName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("dock");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    const dockElement = document.getElementById(dockName);
    if (dockElement) {
        dockElement.style.display = "block";
        evt.target.classList.add("active");
        currentDock = dockName === 'LoadingDock1' ? loadingdock1 : loadingdock2;
    } else {
        console.error('No element found with id:', dockName);
    }
}
