class LoadingDock {
    constructor(id) {
        this.id = id;
        this.trucks = [];
        this.dockElement = document.getElementById(this.id);
        if (this.dockElement) {
            this.dockElement.style.display = "block"; // Ensure the dock is visible
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
        this.trucks.forEach(truck => {
            const truckElement = document.createElement('div');
            truckElement.classList.add('truck');
            truckElement.textContent = `Truck: ${truck.length} x ${truck.width}, Type: ${truck.type}`;
            this.dockElement.appendChild(truckElement);
        });
    }
}
