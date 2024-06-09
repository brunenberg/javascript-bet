class Truck {
    constructor(length, width, interval, type) {
        this.length = length;
        this.width = width;
        this.interval = interval * 1000; // Convert seconds to milliseconds
        this.type = type;
        this.inDock = true;
        this.grid = Array.from({ length: length }, () => Array.from({ length: width }, () => ""));
    }

    // Clears the truck's grid
    clearGrid() {
        this.grid = Array.from({ length: this.length }, () => Array.from({ length: this.width }, () => ""));
    }

    // Simulates sending the truck away and returning after the interval
    sendAndReturn(callback) {
        this.inDock = false; // Set the truck to no longer be in the dock
        // Clear the grid immediately to simulate sending the truck away
        this.clearGrid();
    
        // Set a timeout to simulate the truck returning after the interval
        setTimeout(() => {
            this.inDock = true; // The truck is now back in the dock
            if (callback) {
                callback(this); // Call the provided callback function when the truck returns
            }
        }, this.interval);
    }
}