import { Conveyor } from './Conveyors.js';
import { Package } from './Packages.js';
import { Truck } from './Truck.js';

let activeConveyors = [];
const addBeltButton = document.querySelector('#addBeltButton');
addBeltButton.addEventListener('click', createConveyorElement);

const packageElements = document.querySelectorAll('.package');
const packages = Array.from(packageElements).map(element => new Package(element));

function createConveyorElement() {
    console.info('Creating a new conveyor');
    const conveyor = new Conveyor();
    const beltsElement = document.querySelector('.belts');
    beltsElement.appendChild(conveyor.conveyorElement);
    activeConveyors.push(conveyor);
}

setInterval(() => {
    activeConveyors.forEach(conveyor => {
        conveyor.addPackage();
    });
}, 2000);
