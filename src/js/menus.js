import { closeSettingsMenu } from './settings/settings.js';
import { createTabMenu } from './tabs/tabMenu.js';
import { removeModuleMenu } from './sidebar/sidebar.js';
import { closeCmdPalette } from './commandPalette.js';

let openMenu = null;

const MENU_FUNCTIONS = {
    'settings': closeSettingsMenu,
    'tab menu': () => document.querySelector('.tab-menu').remove(),
    'module menu': removeModuleMenu,
    'command palette': closeCmdPalette,
    'quick capture': () => document.querySelector('.quick-capture').remove(),
}

export function setOpenMenu(menu) {
    if(openMenu && openMenu !== menu) MENU_FUNCTIONS[openMenu]();
    console.log(MENU_FUNCTIONS[openMenu])
    openMenu = menu;
}
