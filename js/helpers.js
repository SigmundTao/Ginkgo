export function appendChildren(parent, childArray){
    childArray.forEach(child => {
        parent.appendChild(child)
    });
}

