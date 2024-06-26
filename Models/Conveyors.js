class Conveyor {
    constructor(LoadingDock1, LoadingDock2) {
        this.LoadingDock1 = LoadingDock1;
        this.LoadingDock2 = LoadingDock2;
        this.beltsElement = document.querySelector('.belts');
        this.addBeltButton = document.querySelector('#addBeltButton');
        this.conveyorElements = document.querySelectorAll('.conveyor');
        this.tetrominos = ['straight', 'square', 'T', 'L', 'skew'];
    }

    createConveyorElement() {
        const newConveyorElement = document.createElement('div');
        newConveyorElement.classList.add('conveyor');
        this.beltsElement.appendChild(newConveyorElement);
    }

    addPackageToConveyor() {
        this.conveyorElements = document.querySelectorAll('.conveyor');
        this.conveyorElements.forEach(conveyorElement => {
            const randomTetromino = this.tetrominos[Math.floor(Math.random() * this.tetrominos.length)];
            let tetrominoElement = document.querySelector('#' + randomTetromino);
            let packageElement = tetrominoElement.cloneNode(true);
            packageElement.classList.add('package');
            packageElement.removeAttribute('id');
            new Package(packageElement, this.LoadingDock1, this.LoadingDock2, randomTetromino);
            conveyorElement.appendChild(packageElement);


            packageElement.style.transition = 'left 20s linear';
            setTimeout(() => {
                packageElement.style.left = '95%';
            }, 100);

            setTimeout(() => {
                if (conveyorElement.contains(packageElement)) {
                    conveyorElement.removeChild(packageElement);
                }
            }, 20000);
        });
    }

    init() {
        this.addBeltButton.addEventListener('click', this.createConveyorElement.bind(this));
        setInterval(this.addPackageToConveyor.bind(this), 3000);
    }
}
