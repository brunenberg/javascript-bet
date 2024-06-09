class MainController {
    constructor() {
        this.transportTypes = [
            { value: 'cold', display: 'Koud transport' },
            { value: 'fragile', display: 'Breekbaar transport' },
            { value: 'general', display: 'Algemeen transport' },
            { value: 'pallets', display: 'Pallets' },
            { value: 'express', display: 'Snelkoerier' }
        ];

        this.validationConfig = {
            'length': { min: 1, max: 15 },
            'width': { min: 1, max: 10 },
            'interval': { min: 1, max: Infinity }
        };

        this.loadingdock1id = 'LoadingDock1';
        this.loadingdock2id = 'LoadingDock2';

        this.loadingdock1 = new LoadingDock(this.loadingdock1id);
        this.loadingdock2 = new LoadingDock(this.loadingdock2id);

        this.currentDock = this.loadingdock1;

        // Call attachEventListeners after the DOM has loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.loadTransportTypes();
            this.attachEventListeners();
            this.setDefaultActiveDock();
            this.showStep(0);
        });
    }

    setDefaultActiveDock() {
        const defaultDockId = this.loadingdock1id;
        const defaultButton = document.querySelector(`button[data-dock-id="${defaultDockId}"]`);
        if (defaultButton) {
            defaultButton.classList.add("active");
            this.openDock({ target: defaultButton }, defaultDockId);
        }
    }

    loadTransportTypes() {
        const selectElement = document.getElementById('type');
        selectElement.innerHTML = '';
        this.transportTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.display;
            selectElement.appendChild(option);
        });
    }

    attachEventListeners() {
        // Attach event listeners to buttons for switching between docks
        document.getElementById('dockTabs').addEventListener('click', (event) => {
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
                this.openDock(event, dockId);
            }
        });

        // Attach event listener to the truck form submission
        document.getElementById('truckForm').addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the page from reloading

            const length = document.getElementById('length').value;
            const width = document.getElementById('width').value;
            const interval = document.getElementById('interval').value;
            const type = document.getElementById('type').value;

            const truck = new Truck(length, width, interval, type);
            this.currentDock.addTruck(truck);
        });

        // Attach event listener for weather fetching
        document.getElementById('fetchWeatherButton').addEventListener('click', () => {
            const cityInfo = document.getElementById('weatherLocation').value;
            const weather = new Weather(cityInfo);
            weather.fetchWeather();
        });

        // Attach event listeners for conveyor belt and packages
        const conveyor = new Conveyor(this.loadingdock1, this.loadingdock2);
        conveyor.init();

        // Load transport types
        this.loadTransportTypes();

        // Initialize the step-by-step form
        this.initializeStepByStepForm();
    }

    initializeStepByStepForm() {
        this.currentStep = 0;
        this.steps = document.getElementsByClassName('formStep');
        this.showStep(this.currentStep);

        // Next button event listener
        document.querySelectorAll('.nextBtn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.validateFormStep(this.currentStep)) {
                    this.changeStep(1); // Move to the next step
                }
            });
        });

        // Previous button event listener
        document.querySelectorAll('.prevBtn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeStep(-1); // Go back to the previous step
            });
        });

        document.getElementById('createTruckButton').addEventListener('click', this.submitForm.bind(this));
    }

    changeStep(n) {
        // Hide the current step
        this.steps[this.currentStep].style.display = 'none';
        this.currentStep += n;
    
        // Ensure the step index stays within bounds
        this.currentStep = Math.max(0, Math.min(this.steps.length - 1, this.currentStep));
    
        // Show the new step
        this.showStep(this.currentStep);
    }

    showStep(step) {
        // Hide all steps and then display the current step
        Array.from(this.steps).forEach(s => s.style.display = 'none');
        this.steps[step].style.display = 'block';

        // Hide the "Back" button if we are in the first step
        const prevBtn = document.querySelector('.prevBtn');
        if (step === 0 && prevBtn) {
            prevBtn.style.display = 'none';
        } else if (prevBtn) {
            prevBtn.style.display = 'inline';
        }
    }

    validateFormStep(step) {
        let valid = true;
        const inputs = this.steps[step].getElementsByTagName('input');
    
        for (let input of inputs) {
            const value = input.value.trim();
            const parsedValue = parseInt(value, 10);
            const isWholeNumber = value && value == parsedValue;
            const { min, max } = this.validationConfig[input.id] || {};
    
            if (!value || !this.isValueInRange(parsedValue, min, max) || !isWholeNumber) {
                input.classList.add('invalid');
                const message = this.getErrorMessage(value, parsedValue, min, max, isWholeNumber);
                this.showError(input, message);
                valid = false;
            } else {
                input.classList.remove('invalid');
                this.hideError(input);
            }
        }
        return valid;
    };

    getErrorMessage(value, parsedValue, min, max, isWholeNumber) {
        if (!value) {
            return `Voer een waarde in die groter is dan of gelijk is aan ${min}.`;
        } else if (!isWholeNumber) {
            return 'Voer een geheel getal in.';
        } else if (parsedValue < min) {
            return `Voer een waarde in die groter is dan of gelijk is aan ${min}.`;
        } else {
            return `Voer een waarde in tussen ${min} en ${max}.`;
        }
    };

    isValueInRange(value, min, max) {
        return !isNaN(value) && value >= min && (max === Infinity || value <= max);
    };

    showError(input, message) {
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains('error-message')) {
            error = document.createElement('div');
            error.classList.add('error-message');
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        error.textContent = message;
        error.style.display = 'block';
    };

    hideError(input) {
        let error = input.nextElementSibling;
        if (error && error.classList.contains('error-message')) {
            error.style.display = 'none';
        }
    };

    submitForm() {
        const length = document.getElementById('length').value;
        const width = document.getElementById('width').value;
        const interval = document.getElementById('interval').value;
        const type = document.getElementById('type').value;
    
        const truck = new Truck(length, width, interval, type, this.currentDock);
        this.currentDock.addTruck(truck);
    
        document.getElementById('length').value = '';
        document.getElementById('width').value = '';
        
        this.currentStep = 0;
        this.showStep(this.currentStep);
    };

    openDock(evt, dockName) {
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
            this.currentDock = dockName === this.loadingdock1id ? this.loadingdock1 : this.loadingdock2;
        } else {
            console.error('No element found with id:', dockName);
        }
    }
}

const mainController = new MainController();