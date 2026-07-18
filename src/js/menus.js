import { closeSettingsMenu } from './settings/settings.js';
import { createTabMenu } from './tabs/tabMenu.js';
import { removeModuleMenu } from './sidebar/sidebar.js';
import { closeCmdPalette } from './commandPalette.js';
import { removeCheatSheet, getCheatSheet } from './cheatsheet.js';
import { closeSearchMenu } from './search.js';

export let openMenu = null;

const MENU_FUNCTIONS = {
    'settings': closeSettingsMenu,
    'tab menu': () => document.querySelector('.tab-menu')?.remove(),
    'module menu': removeModuleMenu,
    'command palette': closeCmdPalette,
    'quick capture': () => document.querySelector('.quick-capture')?.remove(),
    'md cheatsheet': () => removeCheatSheet(getCheatSheet()),
    'search': closeSearchMenu,
}

export function setOpenMenu(menu) {
    if(openMenu && openMenu !== menu) closeOpenMenu()
    openMenu = menu;
}

export function clearOpenMenu() {
    openMenu = null;
}

export function closeOpenMenu() {
  MENU_FUNCTIONS[openMenu]();
}
