import { KEY_BINDS } from '../shortcuts.js';
import { showToast, TOAST_TYPES } from '../toast.js';

const bindsInUse = new Set();

export function initKeybinds() {
  bindsInUse.clear()
  KEY_BINDS.forEach(bind => {
    bindsInUse.add(bind.keyValue);
  })
}

function isBindInUse(key) {
  return bindsInUse.has(key) ? true : false;
}

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

function createKeybindOption(keybindDataObj) {
  const optionEl = document.createElement('div');
  optionEl.classList.add('keybind-option');

  const bindTitle = document.createElement('p');
  bindTitle.textContent = `${keybindDataObj.title}:`;
  optionEl.appendChild(bindTitle);

  const bindInput = document.createElement('input');
  bindInput.value = keybindDataObj.keyValue;
  optionEl.appendChild(bindInput);

  bindInput.addEventListener('keydown', (e) => {
    const keyInput = bindInput.value;
    if(e.key !== 'Enter' || keyInput.length !== 1) return
    if(!isBindInUse(keyInput)){
      keybindDataObj.keyValue = keyInput;
      updateUserData()
      initKeybinds()
    } else {
      showToast('Bind already in use', TOAST_TYPES.ERROR)
    }
  })

  return optionEl;
}
