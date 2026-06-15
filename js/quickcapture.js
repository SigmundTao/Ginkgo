import { getUntitledTitle } from "./editor.js";
import { renderFiletree } from "./filetree.js";
import { files, idNum, currentFolderId, incrementIdNum } from "./state.js";
import { updateFileData, getFormattedDate } from "./storage.js";
import { currentTabEl } from "./tabs.js";

export function createQuickCaptureEl(){
    const quickCaptureEl = document.createElement('div')
    quickCaptureEl.classList.add('quick-capture')
    quickCaptureEl.innerHTML = `
        <p class="qc-txt">Quick Capture:</p>
    `
    const input = document.createElement('input')
    input.classList.add('qc-input')
    quickCaptureEl.appendChild(input)

    currentTabEl.appendChild(quickCaptureEl)
    input.focus()

    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            quickCapture(input.value)
            quickCaptureEl.remove()
        }
    })

    window.addEventListener('click', (e) => {
        if(e.target !== quickCaptureEl){
            quickCaptureEl.remove()
        }
    }, {once: true})

    window.addEventListener('keydown', (e) => {
        if(e.key === 'Escape'){
            quickCaptureEl.remove()
        }
    }, {once:true})
}   

function quickCapture(content){
    const date = getFormattedDate(new Date())
    const id = idNum
    const title = getUntitledTitle()
    files.push({
        title: title,
        body: content,
        id,
        type: 'note',
        parentId: currentFolderId,
        date,
        lastEdited: date,
        tags: []
    })

    incrementIdNum()
    updateFileData()
    renderFiletree()
}

