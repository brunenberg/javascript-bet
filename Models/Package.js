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
        const x = event.clientX - this.offsetX;
        const y = event.clientY - this.offsetY;
        this.clonedElement.style.transform = `translate(${x}px, ${y}px)`;
    }

    handleMouseUp() {
        console.debug('Mouse up event triggered');
        document.body.removeChild(this.clonedElement);
    }
}