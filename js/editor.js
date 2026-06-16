import { USER, updateUserData } from "./user.js"
import { openTabs, getFileIndex, idNum, currentFolderId, incrementIdNum, setSelectedFileId, setAppState, getTabIndexFromFileId } from "./state.js"
import { getFormattedDate, checkForDuplicateTitles } from "./storage.js"
import { renderTabs, checkForDefaultTabs, createTab, overwriteDefaultTab, loadTab } from "./tabs.js"
import { renderFiletree } from "./filetree.js"

export function highlightSelectedFile(id){
    document.querySelectorAll('.file-card').forEach(card => card.classList.remove('selected-file'))
    if(!id) return
    const targets = document.querySelectorAll(`[id="${id}"]`);
    targets.forEach(target => {

        if(target.classList.contains('file-card')){
           target.classList.add('selected-file')   
        }
    })
}

 export function getTitleInput(){
    return document.querySelector('.note-title')
}

export function getBodyInput(){
    return document.querySelector('.note-body')
}

export function saveNote(file){
    const fileIndex = getFileIndex(file.id)
    if(fileIndex === -1) return
    if(checkForDuplicateTitles(file.title, file.id)) return
    file.title = getTitleInput().value
    console.log(getTitleInput().value)
    file.body = getBodyInput().value
    file.lastEdited = getFormattedDate(new Date())
    setSelectedFileId(file.id)
    setAppState('Editing')
    updateUserData()
    renderFiletree()
    renderTabs()
}

export function createNewNote(isDailyNote){
    const date = getFormattedDate(new Date())
    const id = idNum
    let title = getUntitledTitle()
    if(isDailyNote){
        title = date
    }
    USER.files.push({
        title: title,
        body: '',
        id,
        type: 'note',
        parentId: currentFolderId,
        date,
        lastEdited: date,
        tags: []
    })
    if(checkForDefaultTabs() !== -1){
        overwriteDefaultTab(id)
        loadTab(openTabs[getTabIndexFromFileId(id)].id)
        renderTabs()
    } else {
        createTab(id)
    }
    incrementIdNum()
    updateUserData()
    setSelectedFileId(id)
    setAppState('Editing')
    renderFiletree()
    getTitleInput().focus()
    return id
}

export function getUntitledTitle(){
    const untitledTitles = new Set(USER.files.filter(f => f.title.startsWith('Untitled')).map(f => f.title))
    if(!untitledTitles.has('Untitled')) return 'Untitled'
    let i = 1
    while(untitledTitles.has(`Untitled ${i}`)){
        i++
        if(i > 1000) break
    }
    return `Untitled ${i}`
}
