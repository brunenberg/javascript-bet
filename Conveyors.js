function createConveyorElement() {
    // Create a new conveyor element
    const newConveyorElement = document.createElement('div');
    newConveyorElement.classList.add('conveyor');

    // Append the new conveyor element to the .belts element
    const beltsElement = document.querySelector('.belts');
    beltsElement.appendChild(newConveyorElement);
}

const addBeltButton = document.querySelector('#addBeltButton');
addBeltButton.addEventListener('click', createConveyorElement);

setInterval(addPackageToConveyor, 5000); // Add a package to the conveyor every 5 seconds

function addPackageToConveyor() {
    const conveyorElements = document.querySelectorAll('.conveyor');
    conveyorElements.forEach(conveyorElement => {
        const packageElement = document.createElement('div');
        packageElement.classList.add('package');
        conveyorElement.appendChild(packageElement);

        setTimeout(() => {
            conveyorElement.removeChild(packageElement);
        }, 20000); // Remove the package after 20 seconds
    });
}