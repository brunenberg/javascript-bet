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
        this.trucks.forEach(truck => {
            const truckElement = document.createElement('div');
            truckElement.classList.add('truck');
            truckElement.textContent = `Truck: ${truck.length} x ${truck.width}, Type: ${truck.type}`;
            const gridElement = document.createElement('div');
            gridElement.classList.add('grid');
            const gridSize = truck.length * truck.width;
            for (let i = 0; i < gridSize; i++) {
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');
                gridElement.setAttribute('data-width', truck.width);
                gridElement.appendChild(gridItem);
            }

            truckElement.appendChild(gridElement);
            this.dockElement.appendChild(truckElement);
        });
    }
}
