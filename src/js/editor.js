import { USER, updateUserData } from "./user.js"
import { openFolderIds, getFileIndex, idNum, currentFolderId, incrementIdNum, setSelectedFileId, setAppState, getTabIndexFromFileId } from "./state.js"
import { getFormattedDate, checkForDuplicateTitles } from "./storage.js"
import { currentTabEl, renderTabs, checkForDefaultTabs, createTab, overwriteDefaultTab, loadTab } from "./tabs.js"
import { renderFiletree } from "./filetree.js"
import { rotateElement, removeTextRightToLeft } from "./animations.js"

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
    indicateAutoSave()
}

function indicateAutoSave() {
  const saveElement = document.createElement('div');
  saveElement.classList.add('auto-save-indicator');
  const saveText = document.createElement('p');
  saveText.textContent = 'Saving...';
  const icon = document.createElement('div');
  icon.classList.add('save-icon');
  icon.style.backgroundImage = `url('src/assets/save-icon.svg')`;
  saveElement.appendChild(icon);
  saveElement.appendChild(saveText);
  currentTabEl.appendChild(saveElement);

  let rotation = 0;
  const rotating = setInterval(() => {
    rotation = rotateElement(icon, rotation);
  }, 100);

  setTimeout(() => {
    clearInterval(rotating);
    icon.style.rotate = '0deg';
    saveText.textContent = 'Saved';
    icon.style.backgroundImage = `url('src/assets/saved.svg')`;

    setTimeout(() => {
      const removingText = setInterval(() => {
        saveText.textContent = removeTextRightToLeft(saveText.textContent);
        if (saveText.textContent === '') {
          clearInterval(removingText);
          setTimeout(() => {
            saveElement.remove();
          }, 500);
        }
      }, 35);
    }, 200);

  }, 800);
}

export function createNewNote(isDailyNote){
    const date = getFormattedDate(new Date())
    const id = idNum;
    let title = getUntitledTitle()
    let body = '';
    let parent = null;
    if(isDailyNote){
        title = date;
        body = USER.settings.dailyNote.preset;
        parent = USER.settings.dailyNote.folder;
    }

    USER.files.push({
        title: title,
        body: body,
        id,
        type: 'note',
        parentId: parent,
        date,
        lastEdited: date,
        tags: []
    })

    if(parent !== null){
      if(!openFolderIds.has(parent)){
      openFolderIds.add(parent)
      }
    }

    if(checkForDefaultTabs() !== -1){
        overwriteDefaultTab(id)
        loadTab(USER.tabs[getTabIndexFromFileId(id)].id)
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
