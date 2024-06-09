class MainController {
    constructor() {
        // Instantiate controllers
        this.loadingDockController = new LoadingDockController(this);
        this.formController = new FormController(this);
        this.weatherController = new WeatherController(this);
    }
}

const mainController = new MainController();