import { currentTabEl } from './tabs.js';
import { createNewNote } from './editor.js';
import { openSearchMenu } from './search.js';
import { openSettingsMenu } from './settings.js';

class DashboardShortcut {
  constructor(shortcutObj){
    this.img = shortcutObj.img;
    this.name = shortcutObj.name;
    this.key = shortcutObj.key;
    this.function = shortcutObj.function;
  }

  createShortcutEl(){
    const element = document.createElement('div');
    element.classList.add('dashboard-shortcut-el');

    const nameAndIconSpan = document.createElement('span');
    nameAndIconSpan.classList.add('name-icon-span');

    const icon = document.createElement('div');
    icon.classList.add('dashboard-shortcut-icon');
    icon.style.backgroundImage = `url(${this.img})`;
    icon.style.backgroundPosition = 'center';
    icon.style.backgroundSize = 'contain';
    icon.style.backgroundRepeat = 'no-repeat';
    nameAndIconSpan.appendChild(icon);

    const name = document.createElement('p');
    name.classList.add('dashboard-shortcut-name');
    name.textContent = this.name;
    nameAndIconSpan.appendChild(name);

    element.appendChild(nameAndIconSpan);

    const shortcut = document.createElement('p');
    shortcut.textContent = this.key;
    element.appendChild(shortcut);
    shortcut.addEventListener('keydown', (e) => {
      if(e.key === this.key){
        e.preventDefault()
        this.function();
      }
    })

    return element;
  }
}

const DASHBOARD_SHORTCUTS = [
  new DashboardShortcut({
    name: 'New File',
    key: 'n',
    img: '../assets/file.svg',
    function: createNewNote,
  }),
  new DashboardShortcut({
    name: 'Find File',
    key: 'f',
    img: '../assets/file.svg',
    function: openSearchMenu,
  }),
  new DashboardShortcut({
    name: 'Config',
    key: 'c',
    img: '../assets/settings.svg',
    function: openSettingsMenu,
  }),
  new DashboardShortcut({
    name: 'Daily Note',
    key: 'd',
    img: '../assets/dailynote.svg',
    function: () => createNewNote(true),
  }),
]


export function createDashboard(){
  currentTabEl.innerHTML = ``;

  const dashboard = document.createElement('div');
  dashboard.classList.add('dashboard');
  currentTabEl.appendChild(dashboard);

  const logo = document.createElement('img');
  logo.src = `assets/kangae-logo.svg`;
  logo.classList.add('dashboard-logo');
  dashboard.appendChild(logo);

  const shorcutHolder = document.createElement('div');
  shorcutHolder.classList.add('dashboard-shortcut-holder');

  DASHBOARD_SHORTCUTS.forEach(shortcut => {
    shorcutHolder.appendChild(shortcut.createShortcutEl())
  })

  dashboard.appendChild(shorcutHolder)
  currentTabEl.appendChild(dashboard)
}
