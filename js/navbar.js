import { toggleFileHolder } from "./filetree.js"
import { getFormattedDate } from "./storage.js"
import { openFile } from "./tabs.js"
import { createNewNote } from "./editor.js"
import { files } from "./state.js"

const openFilesBtn = document.getElementById('open-files-btn')
const dailyNoteBtn = document.getElementById('daily-note-btn');

export function createDailyNote(){
  const date = getFormattedDate(new Date())
    const fileIndex = files.findIndex(file => file.title === date)

    if(fileIndex !== -1){
        openFile(files[fileIndex].id)
    } else {
        createNewNote(true)   
    }
}

export function initNavBar(){
  openFilesBtn.addEventListener('click', toggleFileHolder)
  dailyNoteBtn.addEventListener('click', createDailyNote);
}
