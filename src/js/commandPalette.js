import { FUNCTION_MAP, SUPER } from './shortcuts.js';
import { USER } from './user.js';

const cmdPalette = document.getElementById('cmd-palette');
const cmdInput = document.getElementById('cmd-search-bar');
const cmdOutput = document.getElementById('cmd-holder');
let cmdDebounce;

export function initCmdPalette() {
    cmdInput.addEventListener(
        'input',
        () => {
            clearTimeout(cmdDebounce);

            displayCommands(cmdInput.value.trim(), cmdOutput);
        },
        300
    );
}

class Command {
    constructor(cmdObj) {
        this.title = cmdObj.title;
        this.key = cmdObj.keyValue;
        this.fn = FUNCTION_MAP[this.title];
    }

    createElement() {
        const card = document.createElement('div');
        card.classList.add('cmd');

        card.innerHTML = `
      <p>${this.title}</p>
      <p>${SUPER} + ${this.key}</p>
    `;

        card.addEventListener('click', () => {
            this.fn();
            closeCmdPalette();
        });

        return card;
    }
}

function openCmdPalette() {
    cmdInput.value = '';
    cmdOutput.innerHTML = '';
    USER.settings.keybinds.forEach((bind) => {
        const command = new Command(bind);
        cmdOutput.appendChild(command.createElement());
    });
    cmdPalette.classList.add('cmd-palette-showing');
    cmdPalette.showModal();
    cmdInput.focus();
}

function closeCmdPalette() {
    cmdPalette.classList.remove('cmd-palette-showing');
    cmdPalette.close();
}

export function toggleCmdPalette() {
    if (cmdPalette.classList.contains('cmd-palette-showing')) closeCmdPalette();
    else openCmdPalette();
}

function displayCommands(input, output) {
    output.innerHTML = '';
    const filteredCommands = USER.settings.keybinds.filter((bind) =>
        bind.title.toLowerCase().includes(input.toLowerCase())
    );

    filteredCommands.forEach((cmd) => {
        const commandClass = new Command(cmd);
        output.appendChild(commandClass.createElement());
    });
}
