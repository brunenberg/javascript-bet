class MainController {
    constructor() {
        // Instantiate LoadingDockController
        this.loadingDockController = new LoadingDockController(this);

        // Instantiate FormController
        this.formController = new FormController(this);

        // Call attachEventListeners after the DOM has loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.loadingDockController.loadTransportTypes();
            this.loadingDockController.setDefaultActiveDock();
            this.attachEventListeners();
        });
    }

    attachEventListeners() {
        // Attach event listener for weather fetching
        document.getElementById('fetchWeatherButton').addEventListener('click', () => {
            const cityInfo = document.getElementById('weatherLocation').value;
            const weather = new Weather(cityInfo);
            weather.fetchWeather();
            this.loadingDockController.currentDock.displayTrucks();
        });
    
        // Attach event listeners for conveyor belt and packages
        const conveyor = new Conveyor(this.loadingDockController.loadingdock1, this.loadingDockController.loadingdock2);
        conveyor.init();
    }
}

const mainController = new MainController();