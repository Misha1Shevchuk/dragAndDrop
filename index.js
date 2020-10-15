const LEFT = 'left', TOP = 'top', RIGHT = 'right', BOTTOM = 'bottom';

const container = document.querySelector('.container');
const draggableElement = document.querySelector('.draggableElement');
const showDraggableBtn = document.querySelector('#showDraggableBtn');

draggableElement.addEventListener('dragstart', event => {
    const style = window.getComputedStyle(event.target);

    const position = JSON.stringify({
        left: parseInt(style.getPropertyValue("left")) - event.clientX,
        top: parseInt(style.getPropertyValue("top")) - event.clientY
    });
    event.dataTransfer.setData("Position", position);
});

container.addEventListener('dragover', event => event.preventDefault());

container.addEventListener('drop', event => {
    event.preventDefault();

    const position = JSON.parse(event.dataTransfer.getData("Position"));
    let left = event.clientX + parseInt(position.left, 10);
    let top = event.clientY + parseInt(position.top, 10);

    const isOutsideLeft = left < 0;
    const isOutsideTop = top < 0;
    const isOutsideRight = left + draggableElement.offsetWidth > container.offsetWidth;
    const isOutsideBottom = top + draggableElement.offsetHeight > container.offsetHeight;

    let outsideDirection;

    if (isOutsideLeft) outsideDirection = LEFT;
    if (isOutsideRight) outsideDirection = RIGHT;
    if (isOutsideTop) outsideDirection = TOP;
    if (isOutsideBottom) outsideDirection = BOTTOM;

    if (isOutsideRight || isOutsideLeft) top = event.clientY;
    if (isOutsideTop || isOutsideBottom) left = event.clientX;

    if (outsideDirection) {
        showButtonToDisplayDraggableElement(getButtonPosition(left, top, outsideDirection));
        draggableElement.classList.add('display-none');
    } else {
        showDraggableBtn.classList.add('display-none');
        draggableElement.style.left = `${left}px`;
        draggableElement.style.top = `${top}px`;
    }
});

function getButtonPosition(left, top, outsideDirection) {
    const buttonWidth = parseInt(window.getComputedStyle(showDraggableBtn).getPropertyValue('width'), 10);
    const buttonHeight = parseInt(window.getComputedStyle(showDraggableBtn).getPropertyValue('height'), 10);

    left -= buttonWidth / 2;
    top -= buttonHeight / 2;

    if (outsideDirection === TOP) top = 0;
    else if (outsideDirection === LEFT) left = 0;
    else if (outsideDirection === BOTTOM) top = container.offsetHeight - buttonHeight;
    else if (outsideDirection === RIGHT) left = container.offsetWidth - buttonWidth;

    return { left, top, outsideDirection };
}

function showButtonToDisplayDraggableElement({ left, top, outsideDirection }) {
    const arrowDirection = ({ top: 0, right: 0.25, bottom: 0.5, left: 0.75 })[outsideDirection];

    showDraggableBtn.classList.remove('display-none');
    showDraggableBtn.setAttribute('onclick', `showDraggableElement(${left}, ${top})`);
    showDraggableBtn.style.cssText = `position: absolute;
                                      left: ${left}px;
                                      top: ${top}px;
                                      transform: rotate(${arrowDirection}turn);`;
}

function showDraggableElement(left, top) {
    showDraggableBtn.classList.add('display-none');
    draggableElement.classList.remove('display-none');

    const maxLeftPosition = container.offsetWidth - draggableElement.offsetWidth;
    const maxTopPosition = container.offsetHeight - draggableElement.offsetHeight;
    const minLeftPosition = 0, minTopPosition = 0;

    left -= draggableElement.offsetWidth / 2;
    top -= draggableElement.offsetHeight / 2;

    left = Math.min(maxLeftPosition, Math.max(minLeftPosition, left));
    top = Math.min(maxTopPosition, Math.max(minTopPosition, top));

    draggableElement.style.cssText = `left: ${left}px; top: ${top}px;`;
}