import { USER, updateUserData } from "./user.js";
import { MODULE_TYPES, NOTE_MODES,selectedFileId, openFolderIds, setCurrentTabId, tabId, currentTabId, getTabIndex, getTabIndexFromFileId, incrementTabId, setSelectedFileId, currentNoteMode, setCurrentNoteMode } from "./state.js";
import { checkForDuplicateTitles, getFileIndex } from "./storage.js";
import { highlightSelectedFile, getTitleInput, getBodyInput, saveNote } from "./editor.js";
import { deleteFile } from "./filetree.js";
import { marked } from './markdown.js';
import { createDashboard } from "./dashboard.js";
import { createFlashcardModule } from './sidebar/flashcards.js';
import { createPomodoroModule } from './sidebar/pomodoro.js';
import { createToDoList } from './sidebar/todo.js';
import { createTabMenu } from './tabs/tabMenu.js';

const page = document.getElementById('page');
export const currentTabEl = document.getElementById('current-tab');
const tabBar = document.getElementById('tab-bar');
let noteDebounce;
const MODULE_CREATORS = {
  pomodoro: createPomodoroModule,
  todo: createToDoList,
  flashcards: createFlashcardModule,
}

export function createTab(fileId, moduleType = null){
    USER.tabs.push({file: fileId, id: tabId, moduleType})
    setCurrentTabId(tabId)
    incrementTabId()
    loadTab(currentTabId)
    renderTabs()
    updateUserData()
}

export function loadTab(id){
    const tabIndex = getTabIndex(id)
    if(tabIndex === -1) return
    const tab = USER.tabs[tabIndex]
    setCurrentTabId(id)

    if(tab.moduleType){
        createModuleView(tab.moduleType)
        setSelectedFileId(null)
        highlightSelectedFile()
    } else if(tab.file === null){
        createDefaultView()
        setSelectedFileId(null)
        highlightSelectedFile()
    } else {
        const file = USER.files[getFileIndex(tab.file)]
        setSelectedFileId(file.id)
        highlightSelectedFile(file.id)
        createNoteView(file)
    }
}

function createModuleView(type){
  currentTabEl.innerHTML = '';
  currentTabEl.appendChild(getModuleContent(type))
  renderTabs()
}

function getModuleContent(type){
  return MODULE_CREATORS[type]?.();
}

export function createDefaultTab(){
    if(checkForDefaultTabs() !== -1){
        switchToTab(USER.tabs[USER.tabs.findIndex(t => t.file === null)].id)
        return
    }
    createTab(null)
}

export function switchToTab(id){
    setCurrentTabId(id)
    loadTab(id)
    renderTabs()
}

export function switchToNextTab(){
  const currentIndex = getTabIndex(currentTabId)
  if(currentIndex + 1 > USER.tabs.length - 1) return;
  switchToTab(USER.tabs[currentIndex + 1].id)
}

export function switchToPrevTab(){
  const currentIndex = getTabIndex(currentTabId)
  if(currentIndex - 1 < 0) return;
  switchToTab(USER.tabs[currentIndex - 1].id)
}

export function deleteTab(id){
    const tabIndex = getTabIndex(id)
    USER.tabs.splice(tabIndex, 1)
    if(USER.tabs.length < 1){
        currentTabEl.innerHTML = ''
        createDefaultTab()
        highlightSelectedFile(null)
        return
    }

    if(currentTabId === id){
        const nextTab = USER.tabs[tabIndex] || USER.tabs[tabIndex - 1]
        switchToTab(nextTab.id)
    } else {
        renderTabs()
    }
}

export function renderTabs(isFirstRender){
    if(isFirstRender) {
      for(let i = 0; i < USER.tabs.length; i++) {
        if(USER.tabs[i].moduleType) {
          USER.tabs = USER.tabs.filter(t => !t.moduleType);
        }
      }
    }
    tabBar.innerHTML = ''
    USER.tabs.forEach(tab => {
        const tabCard = createTabCard(tab)

        if(tab.id === currentTabId){
          tabCard.classList.add('current-tab')
          const currentFile = USER.files[getFileIndex(tab.file)];

          if(currentFile){
            let parentId = currentFile.parentId;
            while(parentId){
                openFolderIds.add(parentId);
                const parentFolder = USER.files.find(f => f.id === parentId && f.type === 'folder');
                parentId = parentFolder ? parentFolder.parentId : null;
            }
          }
        }
        tabBar.appendChild(tabCard)
    })
    
  const addTabBtn = document.createElement('button');
  addTabBtn.textContent = '+';
  addTabBtn.addEventListener('click', (e) => {
     page.appendChild(createTabMenu(e.clientX, e.clientY))
  })

  tabBar.appendChild(addTabBtn);
}

function createTabCard(tab){
    const tabCard = document.createElement('div')
    tabCard.classList.add('tab-card')
    tabCard.id = tab.id

    const tabTitle = document.createElement('p')
    if(tab.moduleType){
      tabTitle.textContent = tab.moduleType.charAt(0).toUpperCase() + tab.moduleType.slice(1)
    } else if(!tab.file) {
      tabTitle.textContent = 'Dashboard';
    } else {
      tabTitle.textContent = USER.files[getFileIndex(tab.file)].title;
    }

    const closeTabBtn = document.createElement('button')
    closeTabBtn.classList.add('close-tab-btn')
    closeTabBtn.textContent = 'X'
    closeTabBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        deleteTab(tab.id)
        updateUserData()
    })

    tabCard.addEventListener('click', () => switchToTab(tab.id))
    tabCard.appendChild(tabTitle)
    tabCard.appendChild(closeTabBtn)
    return tabCard
}

export function openFile(fileId){
    if(USER.files[getFileIndex(fileId)].type === 'folder') return
    if(checkIfTabExists(fileId)){
        const tabIndex = getTabIndexFromFileId(fileId)
        switchToTab(USER.tabs[tabIndex].id)
    } else {
        if(checkForDefaultTabs() !== -1){
            overwriteDefaultTab(fileId)
            loadTab(USER.tabs[getTabIndexFromFileId(fileId)].id)
            const defaultTabIndex = USER.tabs.findIndex(t => t.file === fileId)
            switchToTab(USER.tabs[defaultTabIndex].id)
        } else {
            createTab(fileId)
        }
    }
}

export function checkForDefaultTabs(){
    return USER.tabs.findIndex(t => t.file === null)
}

export function checkIfTabExists(fileId){
    return USER.tabs.findIndex(t => t.file === fileId) !== -1
}

function createDefaultView(){
  createDashboard()
}

function createNoteView(file){
    currentTabEl.innerHTML = ''

    const tab = document.createElement('div')
    tab.classList.add('tab')

    const titleInput = document.createElement('input')
    titleInput.type = 'text'
    titleInput.classList.add('note-title')
    titleInput.value = file.title

    const persistentTitle = document.createElement('div')
    persistentTitle.textContent = titleInput.value
    persistentTitle.classList.add('persistent-title')

    const noteContentInput = document.createElement('textarea')
    noteContentInput.classList.add('note-body')
    noteContentInput.value = file.body

    const markdownDisplay = document.createElement('div');
    markdownDisplay.classList.add('note-body')
    markdownDisplay.classList.add('markdown-display')
    markdownDisplay.id = 'markdown-div'
    markdownDisplay.addEventListener('click', (e) => {
      if (e.target.matches('input[type="checkbox"]')) {
        toggleCheckboxInBody(file, e.target, markdownDisplay, noteContentInput);
      } else {
        switchToEditMode(noteContentInput, markdownDisplay);
      }
    });
    const countHolder = document.createElement('div')
    countHolder.classList.add('count-holder')

    tab.appendChild(titleInput)
    tab.appendChild(noteContentInput)
    tab.appendChild(markdownDisplay)
    tab.appendChild(countHolder)
    currentTabEl.appendChild(tab)
    currentTabEl.appendChild(persistentTitle)
    updateCountHolder(countHolder, file, currentNoteMode)
    switchToDisplayMode(noteContentInput, markdownDisplay)

    titleInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            saveNote(file)
            switchToEditMode(noteContentInput, markdownDisplay)
            noteContentInput.focus()
        }
    })

    noteContentInput.addEventListener('input', () => {
        clearTimeout(noteDebounce)

        noteDebounce = setTimeout(() => {
            saveNote(file)
            updateCountHolder(countHolder, file)
        }, 1500);
    })

    titleInput.focus()
}

function toggleCheckboxInBody(file, target, markdownElement, noteBody){
  const checkboxes = [...markdownElement.querySelectorAll('input[type="checkbox"]')];
  const index = checkboxes.indexOf(target);
  let count = -1;
  file.body = file.body.replace(/- \[(x| )\]/gi, (match) => {
    count++;
    return count === index ? (match.includes('x') ? '- [ ]' : '- [x]') : match;
  });
  noteBody.value = file.body;
  saveNote(file);
  switchToDisplayMode(noteBody, markdownElement);
}

function getMarkdownEl(){
    return document.getElementById('markdown-div')
}

export function toggleNoteView(){
    const bodyInput = getBodyInput()
    const markdownEl = getMarkdownEl()

    if(bodyInput && markdownEl){
            if(currentNoteMode === 'display'){
            switchToEditMode(bodyInput, markdownEl)
        } else {
            switchToDisplayMode(bodyInput, markdownEl)
        }
    }
    
    updateCountHolder(getCountHolder(), USER.files[getFileIndex(selectedFileId)], currentNoteMode)
}
    

function switchToDisplayMode(bodyInput, markdownDiv){
    markdownDiv.innerHTML = marked.parse(bodyInput.value)
    markdownDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.disabled = false
    })
    bodyInput.style.display = 'none'
    markdownDiv.style.display = 'flex'
    setCurrentNoteMode('display')
    setTimeout(() => {
        const bars = document.querySelectorAll('.progress-bar-fill')
        bars.forEach(bar => {
            bar.style.width = bar.dataset.value + '%'
        })
    }, 0)
}

function switchToEditMode(bodyInput, markdownDiv){
    markdownDiv.style.display = 'none'
    bodyInput.style.display = 'flex'
    setCurrentNoteMode('edit')
}

export function updateCountHolder(holder, file, mode){
    let imgClass;

    if(mode === 'display') imgClass = 'display-mode'
    else imgClass = 'edit-mode'

    holder.innerHTML = `
        <div class="note-mode-img ${imgClass}" ></div>
        <div class="word-count">${getWordCount(file)} Words</div>
        <div class="char-count">${getCharacterCount(file)} Characters</div>`
}

export function getCountHolder(){
    return document.querySelector('.count-holder')
}

export function getWordCount(file){
    return file.body.split(' ').length;
}

function getCharacterCount(file){
    return file.body.length;
}

export function overwriteDefaultTab(fileId){
    const defaultTabIndex = getTabIndexFromFileId(null)

    USER.tabs[defaultTabIndex].file = fileId

    updateUserData()
}

