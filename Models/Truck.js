class Truck {
    constructor(length, width, interval, type, refreshCallback) {
        this.length = length;
        this.width = width;
        this.interval = interval * 1000; // Convert seconds to milliseconds
        this.type = type;
        this.grid = Array.from({ length: length }, () => Array.from({ length: width }, () => ""));
        this.refreshCallback = refreshCallback; // Store the callback function
        this.startInterval(); // Start the interval timer when the truck is created
    }

    // Starts an interval timer that clears the grid and calls the refresh callback after each interval
    startInterval() {
        this.intervalId = setInterval(() => {
            this.clearGrid();
            // Optionally, call a method to update the display or handle other logic
            if (this.refreshCallback) {
                this.refreshCallback(this); // Pass this truck instance if needed
            }
        }, this.interval); // Convert interval from seconds to milliseconds
    }

    // Clears the truck's grid
    clearGrid() {
        this.grid = Array.from({ length: this.length }, () => Array.from({ length: this.width }, () => ""));
    }

    // Stops the interval timer
    stopInterval() {
        clearInterval(this.intervalId);
    }
}