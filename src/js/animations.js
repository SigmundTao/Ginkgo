// Pass in newRotation as rotation to keep animation going
export function rotateElement(element, rotation) {
    let newRotation = rotation + 5;
    if (newRotation >= 360) newRotation = 0;

    element.style.rotate = `${newRotation}deg`;
    return newRotation;
}

export function removeTextRightToLeft(string) {
    const splitString = string.split('');
    splitString.pop();
    return splitString.join('');
}
