import { openSearchMenu } from './search.js'
import { createFolder, toggleFileHolder } from './filetree.js'
import { createDefaultTab, toggleNoteView, switchToNextTab, switchToPrevTab, createTab } from './tabs.js'
import { createQuickCaptureEl } from './quickcapture.js'
import { toggleConfigMenu } from './settings/settings.js'
import { openAndCloseSidebar, createModuleMenu, modules } from './sidebar/sidebar.js'
import { createDailyNote } from './navbar.js'
import { createNewNote } from './editor.js'

export const SUPER = 'Alt';
const saved = JSON.parse(localStorage.getItem('keybinds')) || [];

const FUNCTION_MAP = {
  'Create note': createNewNote,
  'Create daily note': createDailyNote,
  'Search': openSearchMenu,
  'Open filetree': toggleFileHolder,
  'Create folder': createFolder,
  'Open dashboard': createDefaultTab,
  'Toggle note view': toggleNoteView,
  'Quick capture': createQuickCaptureEl,
  'Open config': toggleConfigMenu,
  'Open toolbar': openAndCloseSidebar,
  'Open module menu': createModuleMenu,
  'Next tab': switchToNextTab,
  'Previous tab': switchToPrevTab,
  'Open todo list': () => modules[0].createModule(),
  'Open todo list tab': () => createTab(null, 'todo'),
  'Open pomodoro timer': () => modules[1].createModule(),
  'Open pomodoro timer tab': () => createTab(null, 'pomodoro'),
  'Open flashcards': () => modules[2].createModule(),
  'Open flashcard tab': () => createTab(null, 'flashcards'),
}

const DEFAULTS = [
  { title: 'Create note',        keyValue: 'n' },
  { title: 'Create daily note',  keyValue: 'd' },
  { title: 'Search',             keyValue: 'f' },
  { title: 'Open filetree',      keyValue: 'i' },
  { title: 'Create folder',      keyValue: 'c' },
  { title: 'Open dashboard',     keyValue: 't' },
  { title: 'Toggle note view',   keyValue: 'p' },
  { title: 'Quick capture',      keyValue: 'q' },
  { title: 'Open config',        keyValue: 'm' },
  { title: 'Open toolbar',       keyValue: '/' },
  { title: 'Open module menu',   keyValue: 'u' },
  { title: 'Next tab',           keyValue: 'l' },
  { title: 'Previous tab',       keyValue: 'h' },
  { title: 'Open todo list',     keyValue: '1' },
  { title: 'Open todo list tab',     keyValue: '4' },
  { title: 'Open pomodoro timer',keyValue: '2' },
  { title: 'Open pomodoro timer tab',keyValue: '5' },
  { title: 'Open flashcards',    keyValue: '3' },
  { title: 'Open flashcard tab',    keyValue: '6' },
]

export const KEY_BINDS = (saved.length ? saved : DEFAULTS)
  .map(bind => ({ ...bind, function: FUNCTION_MAP[bind.title] }))

function getBindIndexFromKey(key){
  return KEY_BINDS.findIndex(bind => bind.keyValue === key)
}

export function initShortcuts(){
  window.addEventListener('keydown', handleKeydown)
}

function handleKeydown(e){
  const leaderHeld = SUPER === 'Alt' ? e.altKey : e.ctrlKey;
  if (!leaderHeld) return;
  e.preventDefault();
  const bindIndex = getBindIndexFromKey(e.key)
  if (bindIndex === -1) return;
  KEY_BINDS[bindIndex].function()
}
