import { USER } from './user.js'
import { renderFiletree, renderPinnedFiles } from './filetree.js';
import { initSearch } from './search.js';
import { initShortcuts } from './shortcuts.js';
import { initNavBar } from './navbar.js';
import { createDefaultTab, renderTabs, switchToTab } from './tabs.js';
import { initSettings } from './settings/settings.js';
import { initRightSidebar } from './sidebar/sidebar.js';
import { initKeybinds } from './settings/keybindMenu.js';

renderTabs(true)
initSearch()
initShortcuts()
initNavBar()
initSettings()
initRightSidebar()
initKeybinds()
renderFiletree()

if(!USER.tabs.length >= 1){
    createDefaultTab()
} else {
   switchToTab(USER.tabs[USER.tabs.length - 1].id) 
}
renderPinnedFiles()
