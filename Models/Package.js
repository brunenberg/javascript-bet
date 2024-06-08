class Package {
    constructor(element) {
        this.packageElement = element;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        console.debug('Package class created');
        this.packageElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.body.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.body.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.clonedElement = null;
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
                grid.appendChild(this.packageElement);
                this.packageElement.classList.remove('package');
                grid.classList.remove('highlight');
            }
        });
    }
}