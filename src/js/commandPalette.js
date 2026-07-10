import { DEFAULT as defaultKeybinds, FUNCTION_MAP, SUPER } from './shortcuts.js';
import { USER } from './user.js';

const cmdPalette = document.getElementById('cmd-palette');
const cmdInput = document.getElementById('cmd-search-bar');
const cmdOuput = document.getElementById('cmd-holder');

class Command {
  constructor(cmdObj) {
    this.title = cmdObj.title;
    this.key = cmdObj.keyValue;
    this.fn = FUNCTION_MAP.cmdObj.title;
  }

  createElement() {
    const card = document.createElement('div');
    card.classList.add('cmd');

    card.innerHTML = `
      <p>${this.title}</p>
      <p>${SUPER} + ${this.key}</p>
    `

    card.addEventListener('click', () => {
      this.fn()
      closeCmdPalette()
    })

    return card;
  }
}

function openCmdPalette() {
  cmdInput.value = '';
  cmdPalette.show();
}

function closeCmdPalette() {
  cmdPalette.close()
}

function displayCommands(input) {
  const filteredCommands = USER..filter
}
