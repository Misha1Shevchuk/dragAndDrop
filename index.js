const container = document.querySelector('.container');
const draggableElement = document.querySelector('.remoteCamerasContainer');
const showCamerasBtn = document.querySelector('#showRemoteCameras');

const ARROW_DIRECTION = { top: 0, right: 0.25, bottom: 0.5, left: 0.75 };
const LEFT = 'left', TOP = 'top', RIGHT = 'right', BOTTOM = 'bottom';
const outsideDirection = [];

draggableElement.addEventListener('dragstart', event => {
    const style = window.getComputedStyle(event.target);
    const position = JSON.stringify({
        left: parseInt(style.getPropertyValue("left")) - event.clientX,
        top: parseInt(style.getPropertyValue("top")) - event.clientY
    });
    event.dataTransfer.setData("Position", position);
});

container.addEventListener('dragover', e => e.preventDefault());

container.addEventListener('drop', event => {
    event.preventDefault();
    const position = JSON.parse(event.dataTransfer.getData("Position"));
    let left = event.clientX + parseInt(position.left, 10);
    let top = event.clientY + parseInt(position.top, 10);

    outsideDirection.clear();

    if (left + draggableElement.offsetWidth > container.offsetWidth) {
        outsideDirection.push(RIGHT);

        const buttonWidth = parseInt(window.getComputedStyle(showCamerasBtn).getPropertyValue('width'), 10);
        left = container.offsetWidth - buttonWidth - 4;
        top = event.clientY;
    }

    if (top + draggableElement.offsetHeight > container.offsetHeight) {
        outsideDirection.push(BOTTOM);

        const buttonHeight = parseInt(window.getComputedStyle(showCamerasBtn).getPropertyValue('height'), 10);
        top = container.offsetHeight - buttonHeight - 4;
        left = event.clientX;
    }

    if (left < 0) {
        outsideDirection.push(LEFT);

        top = event.clientY;
        left = 0;
    }

    if (top < 0) {
        outsideDirection.push(TOP);

        left = event.clientX;
        top = 0;
    }

    if (outsideDirection.length > 0) {
        createButton(left, top, outsideDirection);
        draggableElement.classList.add('display-none');
    } else {
        showCamerasBtn.classList.add('display-none');
        draggableElement.style.left = left + 'px';
        draggableElement.style.top = top + 'px';
    }
});

function createButton(left, top, arrowDirection) {
    showCamerasBtn.classList.remove('display-none');
    showCamerasBtn.setAttribute('onclick', `showRemoteCameras(${left}, ${top})`);
    showCamerasBtn.style.cssText = `
            position: absolute;
            left: ${left}px;
            top: ${top}px;
            transform: rotate(${ARROW_DIRECTION[outsideDirection[outsideDirection.length - 1]]}turn);
        `;
}

function showRemoteCameras(left, top) {
    showCamerasBtn.classList.add('display-none');
    draggableElement.classList.remove('display-none');

    left -= draggableElement.offsetWidth / 2;
    top -= draggableElement.offsetHeight / 2;
    if (left < 0) left = 0;
    if (top < 0) top = 0;

    if (outsideDirection.includes(RIGHT)) {
        left = container.offsetWidth - draggableElement.offsetWidth;
    }
    if (outsideDirection.includes(BOTTOM)) {
        top = container.offsetHeight - draggableElement.offsetHeight;
    }

    document.querySelector('#remoteCamerasContainer').style.cssText = `left: ${left}px; top: ${top}px;`;
}

Array.prototype.clear = function {
    while (this.length) this.pop();
}