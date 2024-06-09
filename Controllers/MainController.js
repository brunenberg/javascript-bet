const transportTypes = [
    { value: 'cold', display: 'Koud transport' },
    { value: 'fragile', display: 'Breekbaar transport' },
    { value: 'general', display: 'Algemeen transport' },
    { value: 'pallets', display: 'Pallets' },
    { value: 'express', display: 'Snelkoerier' }
];

const validationConfig = {
    'length': { min: 1, max: 15 },
    'width': { min: 1, max: 10 },
    'interval': { min: 1, max: Infinity }
};

const loadingdock1id = 'LoadingDock1';
const loadingdock2id = 'LoadingDock2';

const loadingdock1 = new LoadingDock(loadingdock1id);
const loadingdock2 = new LoadingDock(loadingdock2id);

let currentDock = loadingdock1;


// Call attachEventListeners after the DOM has loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTransportTypes();
    attachEventListeners();
    setDefaultActiveDock();
    showStep(0);
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
    // Attach event listeners to buttons for switching between docks
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
    document.getElementById('truckForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the page from reloading

        const length = document.getElementById('length').value;
        const width = document.getElementById('width').value;
        const interval = document.getElementById('interval').value;
        const type = document.getElementById('type').value;

        const truck = new Truck(length, width, interval, type);
        currentDock.addTruck(truck);
    });

    // Attach event listener for weather fetching
    document.getElementById('fetchWeatherButton').addEventListener('click', function () {
        const cityInfo = document.getElementById('weatherLocation').value;
        const weather = new Weather(cityInfo);
        weather.fetchWeather();
    });

    // Attach event listeners for conveyor belt and packages
    const conveyor = new Conveyor(loadingdock1, loadingdock2);
    conveyor.init();

    // Load transport types
    loadTransportTypes();

    // Initialize the step-by-step form
    initializeStepByStepForm();
}

function initializeStepByStepForm() {
    let currentStep = 0;
    const steps = document.getElementsByClassName('formStep');
    showStep(currentStep);

    // Next button event listener
    document.querySelectorAll('.nextBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateFormStep(currentStep)) {
                changeStep(1); // Move to the next step
            }
        });
    });

    // Previous button event listener
    document.querySelectorAll('.prevBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeStep(-1); // Ga terug naar de vorige stap
        });
    });

    function changeStep(n) {
        // Hide the current step
        const steps = document.getElementsByClassName('formStep');
        steps[currentStep].style.display = 'none';
        currentStep += n;
    
        // Ensure the step index stays within bounds
        currentStep = Math.max(0, Math.min(steps.length - 1, currentStep));
    
        // Show the new step
        showStep(currentStep);
    }

    // Make sure to hide the "Back" button in the first step
    function showStep(step) {
        const steps = document.getElementsByClassName('formStep');
        for (let i = 0; i < steps.length; i++) {
            steps[i].style.display = 'none';
        }
        steps[step].style.display = 'block';

        // Hide the "Back" button if we are in the first step
        const prevBtn = document.querySelector('.prevBtn');
        if (step === 0 && prevBtn) {
            prevBtn.style.display = 'none';
        } else if (prevBtn) {
            prevBtn.style.display = 'inline';
        }
    }

    function validateFormStep(step) {
        let valid = true;
        const inputs = steps[step].getElementsByTagName('input');
    
        for (let input of inputs) {
            const value = input.value.trim();
            const parsedValue = parseInt(value, 10);
            const isWholeNumber = value && value == parsedValue;
            const { min, max } = validationConfig[input.id] || {};
    
            if (!value || !isValueInRange(parsedValue, min, max) || !isWholeNumber) {
                input.classList.add('invalid');
                const message = getErrorMessage(value, parsedValue, min, max, isWholeNumber);
                showError(input, message);
                valid = false;
            } else {
                input.classList.remove('invalid');
                hideError(input);
            }
        }
        return valid;
    }
    
    function getErrorMessage(value, parsedValue, min, max, isWholeNumber) {
        if (!value) {
            return `Voer een waarde in die groter is dan of gelijk is aan ${min}.`;
        } else if (!isWholeNumber) {
            return 'Voer een geheel getal in.';
        } else if (parsedValue < min) {
            return `Voer een waarde in die groter is dan of gelijk is aan ${min}.`;
        } else {
            return `Voer een waarde in tussen ${min} en ${max}.`;
        }
    }
    
    // Determines if a given value falls within the inclusive range specified by min and max
    function isValueInRange(value, min, max) {
        return !isNaN(value) && value >= min && (max === Infinity || value <= max); // Check for valid number and range
    }
    
    function showError(input, message) {
        // Create or update an error message below the input
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains('error-message')) {
            error = document.createElement('div');
            error.classList.add('error-message');
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        error.textContent = message;
        error.style.display = 'block';
    }
    
    function hideError(input) {
        // Hide the error message
        let error = input.nextElementSibling;
        if (error && error.classList.contains('error-message')) {
            error.style.display = 'none';
        }
    }  

    function submitForm() {
        // Collect all form data
        const length = document.getElementById('length').value;
        const width = document.getElementById('width').value;
        const interval = document.getElementById('interval').value;
        const type = document.getElementById('type').value;
    
        // Create a new Truck instance and add it to the current dock
        const truck = new Truck(length, width, interval, type);
        currentDock.addTruck(truck);
    
        // Reset the form fields for length and width, but keep the dock and transport type
        document.getElementById('length').value = '';
        document.getElementById('width').value = '';
        
        // Reset to the first step
        currentStep = 0;
        showStep(currentStep);
    }
    
    // Add an event listener for the 'Vrachtwagen Aanmaken' button
    document.getElementById('createTruckButton').addEventListener('click', submitForm);
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
        dockElement.style.display = "flex";
        evt.target.classList.add("active");
        currentDock = dockName === 'LoadingDock1' ? loadingdock1 : loadingdock2;
    } else {
        console.error('No element found with id:', dockName);
    }
}