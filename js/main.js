import { renderFiletree, renderPinnedFiles } from './filetree.js'
import { initSearch } from './search.js'
import { initShortcuts } from './shortcuts.js'
import { initNavBar } from './navbar.js'
import { createDefaultTab, renderTabs, switchToTab } from './tabs.js'
import { initSettings } from './settings.js'
import { openTabs } from './state.js'


initSearch()
initShortcuts()
initNavBar()
initSettings()
renderFiletree()

if(!openTabs >= 1){
    createDefaultTab()
} else {
   switchToTab(openTabs[openTabs.length - 1].id) 
}

renderTabs()
renderPinnedFiles()