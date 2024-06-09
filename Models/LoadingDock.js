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

            truckElement.appendChild(gridElement);
            this.dockElement.appendChild(truckElement);
        });
    }
}
