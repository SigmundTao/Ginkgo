import { selectedFileId, currentAppState, files, currentFolderId, currentNoteMode } from './state.js'
import { getFileIndex } from './storage.js'
import { saveNote, createNewNote } from './editor.js'
import { openSearchMenu } from './search.js'
import { createFolder, fileTreeEl, toggleFileHolder } from './filetree.js'
import { createDefaultTab, getCountHolder, openFile, toggleNoteMode, updateCountHolder, switchToNextTab, switchToPrevTab } from './tabs.js'
import { createQuickCaputeEl } from './quickcapture.js'
import { openSettingsMenu } from './settings.js'
import { openAndCloseSidebar, createModuleMenu } from './sidebar/sidebar.js'
import { createDailyNote } from './navbar.js';

export const LEADER_KEY = 'Alt'; // swap to 'Control' for Electron

export function initShortcuts(){
  window.addEventListener('keydown', handleKeydown)
}

function handleKeydown(e){
  const leaderHeld = LEADER_KEY === 'Alt' ? e.altKey : e.ctrlKey;
  if (!leaderHeld) return;

  e.preventDefault();

  switch(e.key){
    case 's':
      saveNote(files[getFileIndex(selectedFileId)])
      break
    case 'n':
      createNewNote()
      break
    case 'd':
      createDailyNote()
      break
    case 'f':
      openSearchMenu()
      break
    case 'i':
      toggleFileHolder()
      break
    case 'c':
      createFolder()
      break
    case 'ArrowDown': {
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
    }
    case 't':
      createDefaultTab()
      break
    case 'p':
      toggleNoteMode()
      updateCountHolder(getCountHolder(), files[getFileIndex(selectedFileId)], currentNoteMode)
      break
    case 'q':
      createQuickCaputeEl()
      break
    case 'm':
      openSettingsMenu()
      break
    case '/':
      openAndCloseSidebar()
      break
    case 'u':
      createModuleMenu()
      break
    case 'h':
      switchToPrevTab()
      break
    case 'l':
      switchToNextTab()
      break
  }
}
