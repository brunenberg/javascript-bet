class LoadingDock {
    constructor(id) {
        this.id = id;
        this.trucks = [];
        this.dockElement = document.getElementById(this.id);
        if (this.dockElement) {
            this.dockElement.style.display = "flex"; // Ensure the dock is visible
        } else {
            console.error('No element found with id:', this.id);
        }
    }

    addTruck(truck) {
        this.trucks.push(truck);
        this.displayTrucks();
    }

    displayTrucks() {
        if (!this.dockElement) {
            return;
        }
        this.dockElement.innerHTML = '';
        this.trucks.forEach(async (truck, index) => {
            let weatherCheck = await truck.checkWeather();
            const truckElement = document.createElement('div');
            truckElement.classList.add('truck');
            if (weatherCheck === false) {
                console.debug('Truck', index, 'cannot leave due to weather conditions', 'Weather check:', weatherCheck);
                truckElement.textContent = `Truck: ${truck.length} x ${truck.width}, Type: ${truck.type}\r\nWeather conditions prevent departure.`;
                this.dockElement.appendChild(truckElement);
                return; // Continue
            }
            console.debug('Truck', index, 'can leave', 'Weather check:', weatherCheck);
            truckElement.textContent = `Truck: ${truck.length} x ${truck.width}, Type: ${truck.type}`;
            const gridElement = document.createElement('div');
            const grid = truck.grid;
            gridElement.classList.add('grid');
            grid.forEach(row => {
                row.forEach(cell => {
                    const cellElement = document.createElement('div');
                    cellElement.classList.add('grid-item');
                    if (cell !== '') {
                        cellElement.classList.add(`${cell}`);
                    }
                    gridElement.appendChild(cellElement);
                });
            });
            gridElement.setAttribute('data-width', truck.width);
            gridElement.setAttribute('data-truck-id', this.trucks.indexOf(truck));
            gridElement.setAttribute('data-dock-id', this.id)

            // Create a send button for each truck
            const sendButton = document.createElement('button');
            sendButton.textContent = 'Verstuur';
            sendButton.addEventListener('click', () => {
                truck.sendAndReturn(this.refreshTruck.bind(this));
            });

            truckElement.appendChild(gridElement);
            truckElement.appendChild(sendButton); // Append the send button to the truck element
            this.dockElement.appendChild(truckElement);
        });
    }

    sendTruck(truck, index) {
        // Logic to handle sending the truck away
        console.log(`Sending truck ${index} away`);

        // Start a timer based on the truck's interval
        setTimeout(() => {
            this.returnTruck(truck, index);
        }, truck.interval);
    }

    returnTruck(truck, index) {
        // Logic to handle the truck's return
        console.log(`Truck ${index} has returned`);
        truck.clearGrid(); // Clear the truck's grid
        this.refreshTruck(truck); // Refresh the truck's display
    }

    refreshTruck(truck) {
        // Find the grid element for the specific truck using the data-truck-id attribute
        const truckIndex = this.trucks.indexOf(truck);
        const gridElement = this.dockElement.querySelector(`.grid[data-truck-id="${truckIndex}"]`);

        // Clear the existing grid display
        if (gridElement) {
            gridElement.innerHTML = '';

            // Rebuild the grid display based on the truck's current grid
            truck.grid.forEach(row => {
                row.forEach(cell => {
                    const cellElement = document.createElement('div');
                    cellElement.classList.add('grid-item');
                    if (cell !== '') {
                        cellElement.classList.add(`${cell}`);
                    }
                    gridElement.appendChild(cellElement);
                });
            });
        }
    }
}
