class Truck {
    constructor(length, width, interval, type) {
        this.length = length;
        this.width = width;
        this.interval = interval;
        this.type = type;
        this.grid = Array.from({ length: length }, () => Array.from({ length: width }, () => ""));
    }
}