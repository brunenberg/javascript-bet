import { Package } from './Packages.js';

export class Conveyor {
    constructor() {
        this.conveyorElement = document.createElement('div');
        this.conveyorElement.classList.add('conveyor');
        this.packages = [];
    }

    addPackage() {
        const tetrominos = ['straight', 'square', 'T', 'L', 'skew'];
        const randomTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
        const tetrominoElement = document.querySelector('#' + randomTetromino);
    
        const packageElement = tetrominoElement.cloneNode(true);
        const packageInstance = new Package(packageElement); // Create an instance of the Package class
        packageElement.classList.add('package');
        packageElement.classList.add('rolling');
    
        this.conveyorElement.appendChild(packageElement);
    
        setTimeout(() => {
            this.conveyorElement.removeChild(packageElement);
        }, 20000); // Remove the package after 20 seconds
    
        this.packages.push(packageInstance);
    }
}
