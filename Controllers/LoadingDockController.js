class LoadingDockController {
    constructor(mainController) {
        this.mainController = mainController;
        this.loadingdock1id = 'LoadingDock1';
        this.loadingdock2id = 'LoadingDock2';
        this.loadingdock1 = new LoadingDock(this.loadingdock1id);
        this.loadingdock2 = new LoadingDock(this.loadingdock2id);
        this.currentDock = this.loadingdock1;
        this.transportTypes = [
            { value: 'cold', display: 'Koud transport' },
            { value: 'fragile', display: 'Breekbaar transport' },
            { value: 'general', display: 'Algemeen transport' },
            { value: 'pallets', display: 'Pallets' },
            { value: 'express', display: 'Snelkoerier' }
        ];
        this.attachLoadingDockEventListeners();
    }

    attachLoadingDockEventListeners() {
        document.getElementById('dockTabs').addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                this.setActiveDock(event);
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            this.loadTransportTypes();
            this.setDefaultActiveDock();
        });

        // Attach event listeners for conveyor belt and packages
        const conveyor = new Conveyor(this.loadingdock1, this.loadingdock2);
        conveyor.init();
    }

    setActiveDock(evt) {
        const dockId = evt.target.getAttribute('data-dock-id');
        this.openDock(evt, dockId);
    }

    setDefaultActiveDock() {
        const defaultDockId = this.loadingdock1id;
        const defaultButton = document.querySelector(`button[data-dock-id="${defaultDockId}"]`);
        if (defaultButton) {
            defaultButton.classList.add("active");
            this.openDock({ target: defaultButton }, defaultDockId);
        }
    }

    loadTransportTypes() {
        const selectElement = document.getElementById('type');
        selectElement.innerHTML = '';
        this.transportTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.display;
            selectElement.appendChild(option);
        });
    }

    openDock(evt, dockName) {
        var tabcontent = document.getElementsByClassName("dock");
        Array.from(tabcontent).forEach(content => content.style.display = "none");

        var tablinks = document.getElementsByClassName("tablink");
        Array.from(tablinks).forEach(link => link.classList.remove("active"));

        const dockElement = document.getElementById(dockName);
        if (dockElement) {
            dockElement.style.display = "flex";
            evt.target.classList.add("active");
            this.currentDock = dockName === this.loadingdock1id ? this.loadingdock1 : this.loadingdock2;
        } else {
            console.error('No element found with id:', dockName);
        }
    }
}
