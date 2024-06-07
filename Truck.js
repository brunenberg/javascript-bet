export class Truck {
    constructor(length, width, interval, type) {
        this.length = length;
        this.width = width;
        this.interval = interval;
        this.type = type;
    }

    create() {
        // TODO: add logic for creating a TRUCK!!!
        console.log('Creating a truck with the following properties:', this.length, this.width, this.interval, this.type);
    }
}