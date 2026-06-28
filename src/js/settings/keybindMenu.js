import { KEY_BINDS } from '../shortcuts.js';

const validKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3','4', '5', '6', '7', '8', '9', '0', '/',','];

export function createKeybindMenu(){
  const menu = document.createElement('div');
  menu.classList.add('keybind-menu');

  const menuTitle = document.createElement('h3');
  menuTitle.classList.add('keybind-menu-title');
  menuTitle.textContent = 'Keybinds';
  menu.appendChild(menuTitle);

  const keybindHolder = document.createElement('div');
  keybindHolder.classList.add('keybind-holder');
  menu.appendChild(keybindHolder);

  KEY_BINDS.forEach(bind => {
    keybindHolder.appendChild(createKeybindOption(bind))
  })
  
  return menu
}

function createKeybindOption(keybindDataObj){
  const optionEl = document.createElement('div');
  optionEl.classList.add('keybind-option');

  const bindTitle = document.createElement('p');
  bindTitle.textContent = `${keybindDataObj.title}:`;
  optionEl.appendChild(bindTitle);

  const bindInput = document.createElement('input');
  bindInput.value = keybindDataObj.keyValue;
  optionEl.appendChild(bindInput);

  bindInput.addEventListener('input', (e) => {
    keybindDataObj.keyValue = e.target.value;
  })

  return optionEl;
}

function throwKeybindError(){
  console.log('ERROR!')
}

function saveKeyBinds(){
  localStorage.setItem('keybinds', JSON.stringify(KEY_BINDS))
}
