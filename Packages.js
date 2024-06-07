// Define the Package class
export class Package {
    constructor(element) {
        this.element = element;
        this.element.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.element.addEventListener('drag', this.handleDragMove.bind(this));
        this.element.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    handleDragStart(event) {
        // Add a custom data transfer item
        event.dataTransfer.setData('text/plain', 'Drag started');
        
        // Clone the element and append it to the body
        const clone = this.element.cloneNode(true);
        clone.classList.add('dragging');
        clone.classList.remove('rolling');
        document.body.appendChild(clone);
    }

    handleDragMove(event) {
        // Update the position of the clone
        const clone = document.querySelector('.dragging');
        const x = event.clientX;
        const y = event.clientY;
        clone.style.transform = `translate(${x}px, ${y}px`;
    }

    handleDragEnd(event) {
        // Remove the clone from the body
        const clone = document.querySelector('.dragging');
        document.body.removeChild(clone);
    }
}