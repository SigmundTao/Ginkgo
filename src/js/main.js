import { USER, updateLastLogIn, updateUserData } from './user.js';
import { renderFiletree, renderPinnedFiles } from './filetree.js';
import { initSearch } from './search.js';
import { initShortcuts } from './shortcuts.js';
import { initNavBar } from './navbar.js';
import { createDefaultTab, renderTabs, switchToTab } from './tabs.js';
import { initSettings } from './settings/settings.js';
import { initRightSidebar } from './sidebar/sidebar.js';
import { initKeybinds } from './settings/keybindMenu.js';
import { showToast } from './toast.js';
import { initTodoLists } from './sidebar/todo.js';
import { updateAppearance } from './settings/appearance.js';
import { updateTabTitle, getFileIndex } from './state.js';
import { initCmdPalette } from './commandPalette.js';
import { KEY_BINDS } from './shortcuts.js';

updateAppearance();
renderTabs();
initSearch();
initShortcuts();
initNavBar();
initSettings();
initRightSidebar();
initKeybinds();
initTodoLists();
initCmdPalette();
renderFiletree();
updateLastLogIn();
console.log(document.querySelector('#settings').classList);

if (!USER.tabs.length >= 1) {
    createDefaultTab();
} else {
    switchToTab(USER.tabs[USER.tabs.length - 1].id);
}
renderPinnedFiles();
