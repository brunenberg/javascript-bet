class Package {
    constructor(element, loadingDock1, loadingDock2, type) {
        this.packageElement = element;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        console.debug('Package class created');
        this.packageElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.body.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.body.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.clonedElement = null;
        this.loadingDock1 = loadingDock1;
        this.loadingDock2 = loadingDock2;
        this.type = type;
    }

    handleMouseDown(event) {
        console.debug('Mouse down event triggered');
        this.offsetX = event.offsetX;
        this.offsetY = event.offsetY;

        const clonedElement = this.packageElement.cloneNode(true);
        clonedElement.style.position = 'absolute';
        clonedElement.style.top = `${this.offsetY - 20}px`;
        clonedElement.style.left = `${this.offsetX - 20}px`;
        clonedElement.classList.add('dragging');
        this.clonedElement = clonedElement;
        document.body.appendChild(clonedElement);
        this.isDragging = true;
    }

    handleMouseMove(event) {
        if (!this.isDragging) {
            return;
        }
        console.debug('Mouse move event triggered');
        let x = event.clientX - this.offsetX + window.scrollX;
        let y = event.clientY - this.offsetY + window.scrollY;

        this.clonedElement.style.transform = `translate(${x}px, ${y}px)`;

        // Check if package is over a truck grid
        const truckGrids = document.querySelectorAll('.grid');
        truckGrids.forEach(grid => {
            const gridRect = grid.getBoundingClientRect();
            if (event.clientX >= gridRect.left && event.clientX <= gridRect.right && event.clientY >= gridRect.top && event.clientY <= gridRect.bottom) {
                grid.classList.add('highlight');
            } else {
                grid.classList.remove('highlight');
            }
        });
    }

    handleMouseUp(event) {
        if (!this.isDragging) {
            return;
        }
        console.debug('Mouse up event triggered');
        document.body.removeChild(this.clonedElement);
        this.isDragging = false;

        // Check if package is over a truck grid
        const truckGrids = document.querySelectorAll('.grid');
        truckGrids.forEach(grid => {
            const gridRect = grid.getBoundingClientRect();
            if (event.clientX >= gridRect.left && event.clientX <= gridRect.right && event.clientY >= gridRect.top && event.clientY <= gridRect.bottom) {
                const truckId = grid.getAttribute('data-truck-id');
                const dock = grid.getAttribute('data-dock-id');
                const width = grid.getAttribute('data-width');

                // Find the grid item that the package is over
                const gridItems = grid.querySelectorAll('.grid-item');
                const gridItem = Array.from(gridItems).find(item => {
                    const itemRect = item.getBoundingClientRect();
                    return event.clientX >= itemRect.left && event.clientX <= itemRect.right && event.clientY >= itemRect.top && event.clientY <= itemRect.bottom;
                });
                const gridItemIndex = Array.from(grid.children).indexOf(gridItem);
                // Calculate the row and column of the grid item
                const row = Math.floor(gridItemIndex / width);
                const column = gridItemIndex % width;

                console.debug('Truck ID:', truckId, 'Dock:', dock, 'Row:', row, 'Column:', column, 'GridItemIndex', gridItemIndex, 'Width:', width);

                if (dock === 'LoadingDock1') {
                    if (this.checkCollission(this.loadingDock1.trucks[truckId].grid, row, column, this.type)) {
                        return;
                    }
                    this.animateToTruck(this.packageElement, grid, gridItem)
                    // Add cells for the package
                    setTimeout(() => {
                        this.addCells(this.loadingDock1.trucks[truckId].grid, row, column, this.type);
                        this.loadingDock1.displayTrucks();
                    }, 700);
                } else {
                    if (this.checkCollission(this.loadingDock2.trucks[truckId].grid, row, column, this.type)) {
                        return;
                    }
                    this.animateToTruck(this.packageElement, grid, gridItem)
                    // Add cells for the package
                    setTimeout(() => {
                        this.addCells(this.loadingDock2.trucks[truckId].grid, row, column, this.type);
                        this.loadingDock2.displayTrucks();
                    }, 700);
                }
                grid.classList.remove('highlight');
            }
        });
    }

    addCells(grid, row, column, type) {
        if (type === 'T') {
            grid[row][column] = type;
            grid[row][column + 1] = type;
            grid[row][column + 2] = type;
            grid[row + 1][column + 1] = type;
        } else if (type === 'L') {
            grid[row][column] = type;
            grid[row + 1][column] = type;
            grid[row + 2][column] = type;
            grid[row + 2][column + 1] = type;
        } else if (type === 'skew') {
            grid[row][column + 1] = type;
            grid[row][column + 2] = type;
            grid[row + 1][column] = type;
            grid[row + 1][column + 1] = type;
        } else if (type === 'square') {
            grid[row][column] = type;
            grid[row][column + 1] = type;
            grid[row + 1][column] = type;
            grid[row + 1][column + 1] = type;
        } else if (type === 'straight') {
            grid[row][column] = type;
            grid[row + 1][column] = type;
            grid[row + 2][column] = type;
            grid[row + 3][column] = type;
        }
    }

    checkCollission(grid, row, column, type) {
        if (type === 'T') {
            if (grid[row][column] !== ''
                || grid[row][column + 1] !== ''
                || grid[row][column + 2] !== ''
                || grid[row + 1][column + 1] !== '') {
                return true;
            }
        } else if (type === 'L') {
            if (grid[row][column] !== ''
                || grid[row + 1][column] !== ''
                || grid[row + 2][column] !== ''
                || grid[row + 2][column + 1] !== '') {
                return true;
            }
        } else if (type === 'skew') {
            if (grid[row][column + 1] !== ''
                || grid[row][column + 2] !== ''
                || grid[row + 1][column] !== ''
                || grid[row + 1][column + 1] !== '') {
                return true;
            }
        } else if (type === 'square') {
            if (grid[row][column] !== ''
                || grid[row][column + 1] !== ''
                || grid[row + 1][column] !== ''
                || grid[row + 1][column + 1] !== '') {
                return true;
            }
        } else if (type === 'straight') {
            if (grid[row][column] !== ''
                || grid[row + 1][column] !== ''
                || grid[row + 2][column] !== ''
                || grid[row + 3][column] !== '') {
                return true;
            }
        }
    }

    animateToTruck(packageElement, gridElement, gridItemElement) {
        // Get the coordinates of the elements
        const packageRect = packageElement.getBoundingClientRect();
        const gridRect = gridElement.getBoundingClientRect();
        const gridItemRect = gridItemElement.getBoundingClientRect();

        // Clone the package element and append it to the body
        const clonedElement = packageElement.cloneNode(true);
        clonedElement.style.position = 'absolute';
        clonedElement.style.top = `${packageRect.top}px`;
        clonedElement.style.left = `${packageRect.left}px`;

        document.body.appendChild(clonedElement);
        packageElement.parentNode.removeChild(packageElement);

        // Calculate the target coordinates
        const targetX = gridItemRect.left - packageRect.left;
        const targetY = gridItemRect.top - packageRect.top;

        // Animates the cloned element to the target coordinates
        clonedElement.style.transition = 'transform .6s';

        setTimeout(() => {
            clonedElement.style.transform = `translate(${targetX}px, ${targetY}px)`;
        }, 100);

        // Remove the cloned element from the DOM after the animation
        setTimeout(() => {
            document.body.removeChild(clonedElement);
        }, 700);

    }
}