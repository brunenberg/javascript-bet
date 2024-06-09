class MainController {
    constructor() {
        this.transportTypes = [
            { value: 'cold', display: 'Koud transport' },
            { value: 'fragile', display: 'Breekbaar transport' },
            { value: 'general', display: 'Algemeen transport' },
            { value: 'pallets', display: 'Pallets' },
            { value: 'express', display: 'Snelkoerier' }
        ];

        this.loadingdock1id = 'LoadingDock1';
        this.loadingdock2id = 'LoadingDock2';

        this.loadingdock1 = new LoadingDock(this.loadingdock1id);
        this.loadingdock2 = new LoadingDock(this.loadingdock2id);

        this.currentDock = this.loadingdock1;

        this.formController = new FormController(this);

        // Call attachEventListeners after the DOM has loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.loadTransportTypes();
            this.attachEventListeners();
            this.setDefaultActiveDock();
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
    
        // Attach event listener for weather fetching
        document.getElementById('fetchWeatherButton').addEventListener('click', () => {
            const cityInfo = document.getElementById('weatherLocation').value;
            const weather = new Weather(cityInfo);
            weather.fetchWeather();
        });
    
        // Attach event listeners for conveyor belt and packages
        const conveyor = new Conveyor(this.loadingdock1, this.loadingdock2);
        conveyor.init();
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