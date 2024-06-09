class FormController {
    constructor(mainController) {
        this.validationConfig = {
            'length': { min: 1, max: 15 },
            'width': { min: 1, max: 10 },
            'interval': { min: 1, max: Infinity }
        };

        this.mainController = mainController;
        this.currentStep = 0;
        this.steps = document.getElementsByClassName('formStep');
        this.attachFormEventListeners();
    }

    attachFormEventListeners() {
        // Initialize the step-by-step form
        this.initializeStepByStepForm();

        // Attach event listener to the truck form submission
        document.getElementById('truckForm').addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the page from reloading

            const length = document.getElementById('length').value;
            const width = document.getElementById('width').value;
            const interval = document.getElementById('interval').value;
            const type = document.getElementById('type').value;

            // Create a new Truck instance and add it to the current dock
            const truck = new Truck(length, width, interval, type);
            this.mainController.currentDock.addTruck(truck);
        });
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
    
        const truck = new Truck(length, width, interval, type, this.mainController.loadingDockController.currentDock);
        this.mainController.loadingDockController.currentDock.addTruck(truck);
    
        document.getElementById('length').value = '';
        document.getElementById('width').value = '';
        
        this.currentStep = 0;
        this.showStep(this.currentStep);
    };
}