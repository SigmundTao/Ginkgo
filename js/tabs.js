import { loadFile } from "./editor.js"
import { openTabs, deleteTab, addNewTab, getNumberOfTabs, getTabIndex, tabId, files, getFileHolderState, incrementTabId } from "./state.js"
import { getFileIndex } from "./storage.js"

const tabBar = document.getElementById('tab-bar')
const currentTabEl = document.getElementById('current-tab')

export function createDefaultTab(){
        currentTabEl.innerHTML = ''

        const defaultPage = document.createElement('div')
        defaultPage.classList.add('default-page')

        const noteText = document.createElement('p')
        noteText.textContent = 'Press Alt + n to create a note'
        noteText.classList.add('default-page-text')

        const folderText = document.createElement('p')
        folderText.textContent = 'Press Alt + f to create a new folder'
        folderText.classList.add('default-page-text')

        const searchText = document.createElement('p')
        searchText.textContent = 'Press Alt + f to search for a file'
        searchText.classList.add('default-page-text')
    
        defaultPage.appendChild(noteText)
        defaultPage.appendChild(folderText)
        defaultPage.appendChild(searchText)

        currentTabEl.appendChild(defaultPage)

        addNewTab({fileId: null, id:tabId})
        incrementTabId()
        renderTabs()
}

function renderTabs(){
    tabBar.innerHTML = ''
    openTabs.forEach(tab => {
        tabBar.appendChild(createTabCard(tab))
    })
}

function createTabCard(tab){
    const tabCard = document.createElement('div')
    tabCard.classList.add('tab')

    const tabTitle = document.createElement('p')
    tabTitle.textContent = tab.fileId ? files[getFileIndex(tab.fileId)].title :
    'New tab'

    const closeTabBtn = document.createElement('button')
    closeTabBtn.classList.add('close-tab-btn')
    closeTabBtn.textContent = 'X'
    closeTabBtn.addEventListener('click', () => {
        deleteTab(tab.id)
        if(!openTabs.length){ createDefaultTab() }
    })

    tabCard.appendChild(tabTitle)
    tabCard.appendChild(closeTabBtn)
    return tabCard
}

export function checkForDefaultTabs(){
    openTabs.findIndex(t => t.fileId === null)
}