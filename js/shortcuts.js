import { selectedFileId, currentAppState, files, currentFolderId, currentNoteMode } from './state.js'
import { getFileIndex } from './storage.js'
import { saveNote, createNewNote } from './editor.js'
import { openSearchMenu } from './search.js'
import { createFolder, fileTreeEl, toggleFileHolder } from './filetree.js'
import { createDefaultTab, getCountHolder, openFile, toggleEditMode, updateCountHolder, switchToNextTab, switchToPrevTab } from './tabs.js'
import { createQuickCaptureEl } from './quickcapture.js'
import { toggleConfigMenu} from './settings.js'
import { openAndCloseSidebar, createModuleMenu, modules } from './sidebar/sidebar.js'
import { createDailyNote } from './navbar.js';

export const SUPER = 'Alt';

const KEY_BINDS = [
  {
    title: 'Create note',
    keyValue: 'n',
    function: createNewNote,
  },
  {
    title: 'Create daily note',
    keyValue: 'd',
    function: createDailyNote,
  },
  {
    title: 'Search',
    keyValue: 'f',
    function: openSearchMenu,
  },
  {
    title: 'Open filetree',
    keyValue: 'i',
    function: toggleFileHolder,
  },
  {
    title: 'Create folder',
    keyValue: 'c',
    function: createFolder,
  },
  {
    title: 'Open dashboard',
    keyValue: 't',
    function: createDefaultTab,
  },
  {
    title: 'Toggle edit mode',
    keyValue: 'p',
    function: toggleEditMode,
  },
  {
    title: 'Quick capture',
    keyValue: 'q',
    function: createQuickCaptureEl,
  },
  {
    title: 'Open config',
    keyValue: 'm',
    function: toggleConfigMenu,
  },
  {
    title: 'Open toolbar',
    keyValue: '/',
    function: openAndCloseSidebar,
  },
  {
    title: 'Open module menu',
    keyValue: 'u',
    function: createModuleMenu,
  },
  {
    title: 'Open module menu',
    keyValue: 'l',
    function: switchToNextTab,
  },
  {
    title: 'Open module menu',
    keyValue: 'h',
    function: switchToPrevTab,
  },
  {
    title: 'Open todo list',
    keyValue: '1',
    function: modules[0].createModule(),
  },
  {
    title: 'Open pomodoro timer',
    keyValue: '2',
    function: modules[0].createModule(),
  },
  {
    title: 'Open flashcards',
    keyValue: '2',
    function: modules[0].createModule(),
  },
]

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
  KEY_BINDS[bindIndex].function()
}

/*case 'ArrowDown': {
      const folderContents = files.filter(f => f.parentId === currentFolderId)
      if(selectedFileId === null){
        openFile(folderContents[0].id)
      } else {
        const nextIndex = folderContents.findIndex(f => f.id === selectedFileId) + 1
        if(nextIndex > folderContents.length - 1) return
        openFile(folderContents[nextIndex].id)
      }
      break
    }
    case 'ArrowUp': {
      const folderContents = files.filter(f => f.parentId === currentFolderId)
      if(selectedFileId === null){
        openFile(folderContents[folderContents.length - 1].id)
      } else {
        const prevIndex = folderContents.findIndex(f => f.id === selectedFileId) - 1
        if(prevIndex < 0) return
        openFile(folderContents[prevIndex].id)
      }
      break
    }] */
