import { USER, updateUserData } from "./user.js"
import { createNewNote, highlightSelectedFile } from './editor.js';
import { currentFolderId, isFileHolderOpen, toggleFileHolderState, incrementIdNum, idNum, getSelectedFileId, setSelectedFileId, setAppState, setDraggedElid, getDraggedElId, selectedFileId, getTabIndexFromFileId, openFolderIds } from './state.js'
import { getFileIndex, getFormattedDate } from './storage.js'
import { openFile, checkIfTabExists, deleteTab } from './tabs.js';

export const fileTreeEl = document.getElementById('filetree');
const fileTreeContainerEl = document.getElementById('files-container')
const createNoteBtn = document.getElementById('create-note-btn');
const createFolderBtn = document.getElementById('create-folder-btn')
const pinnedDisplayEl = document.getElementById('pinned')

createNoteBtn.addEventListener('click', () => createNewNote(false))
createFolderBtn.addEventListener('click', createFolder)

fileTreeContainerEl.addEventListener('dragenter', dragEnter)
fileTreeContainerEl.addEventListener('dragover', dragOver)
fileTreeContainerEl.addEventListener('dragleave', dragLeave)
fileTreeContainerEl.addEventListener('drop', drop)
pinnedDisplayEl.addEventListener('dragenter', dragEnter)
pinnedDisplayEl.addEventListener('dragover', dragOver)
pinnedDisplayEl.addEventListener('dragleave', dragLeave)
pinnedDisplayEl.addEventListener('drop', drop)

export function renderFiletree(){
    fileTreeContainerEl.innerHTML = ''
    USER.files.forEach(file => {
        if(file.parentId) return
        if(file.type === 'folder'){
            renderFolder(file, 0, fileTreeContainerEl)
        } else {
            fileTreeContainerEl.appendChild(renderFile(file))
        }
    })
    highlightSelectedFile(selectedFileId)
}

function renderFolder(folder, depth = 0, container, lastOfFolder) {
    const folderCard = new FileCard(folder, container, lastOfFolder)
    folderCard.element.style.paddingLeft = `${depth * 12}px`
    container.appendChild(folderCard.element)

    if (!openFolderIds.has(folder.id)) return

    const folderContents = USER.files.filter(f => f.parentId === folder.id)
    const lastIndex = folderContents.length - 1;

    folderContents.forEach((file, index) => {
        const isLast = index === lastIndex;

        if (file.type === 'folder') {
            renderFolder(file, depth + 1, container, isLast)
        } else {
            const card = renderFile(file, isLast);
            card.style.paddingLeft = `${(depth + 1) * 12}px`
            container.appendChild(card)
        }
    })
}

function renderFile(file, lastOfFolder){
    const fileCard = new FileCard(file, fileTreeContainerEl, lastOfFolder)
    return fileCard.element
}

class FileCard {
    constructor(file, container = fileTreeContainerEl, lastOfFolder){
        this.file = file;
        this.id = file.id;
        this.container = container;
        this.lastOfFolder = lastOfFolder;
        this.element = this.createElement();
    }

    createElement(){
        const card = document.createElement('div')
        card.id = this.file.id
        card.addEventListener('click', () => { openFile(this.file.id) })
        this.addDragEventListner(card)
        const type = this.file.type
        const imgSrc = returnImgBasedOnFileType(type, this.lastOfFolder, this.id)
        card.classList.add('file-card')
        const fileCardHeader = document.createElement('div')
        fileCardHeader.classList.add('file-card-header')
        fileCardHeader.innerHTML = `
            <img class="file-card-img" src="${imgSrc}">
            <p class="file-name">${this.file.title}</p>
        `
        card.appendChild(fileCardHeader)
        
        if(this.file.type === 'folder'){
            this.addDropListener(card)
            card.classList.add('folder')
            fileCardHeader.addEventListener('click', () => {
                if(openFolderIds.has(this.id)){
                    openFolderIds.delete(this.id)
                } else {
                    openFolderIds.add(this.id)
                }
                renderFiletree()
                renderPinnedFiles()
            })
        }
        return card
    }

    addDragEventListner(card){
        card.draggable = 'true'
        card.addEventListener('dragstart', dragstart)
    }

    addDropListener(card){
        card.addEventListener('dragenter', dragEnter)
        card.addEventListener('dragover', dragOver)
        card.addEventListener('dragleave', dragLeave)
        card.addEventListener('drop', drop)
    }
}

function dragstart(e){
    setDraggedElid(e.currentTarget.id)
}

function dragEnter(e){
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
}

function dragOver(e){
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
}

function dragLeave(e){
    e.currentTarget.classList.remove('drag-over')
}

function drop(e){
    e.currentTarget.classList.remove('drag-over')
    const draggedId = Number(getDraggedElId())
    const targetId = Number(e.currentTarget.id)

    if(draggedId === targetId) return
    if(isDescendant(draggedId, targetId)) return

    const draggedFile = USER.files[getFileIndex(draggedId)]
    if(!draggedFile) return
    
    if(e.currentTarget.id === 'files-container'){
        draggedFile.parentId = null
        draggedFile.pinned = false
    } else if(e.currentTarget.id === 'pinned'){
        draggedFile.pinned = true
        draggedFile.parentId = null
        renderPinnedFiles()
    } else {
        if(draggedId === selectedFileId && !openFolderIds.has(targetId)){
            openFolderIds.add(targetId)
        }
        draggedFile.parentId = targetId
        draggedFile.pinned = false
    }
    setDraggedElid(null)
    updateUserData()
    renderFiletree()
    renderPinnedFiles()
}

function isDescendant(draggedId, targetId){
    let current = USER.files[getFileIndex(targetId)]
    while(current && current.parentId !== null){
        if(current.parentId === draggedId) return true
        current = USER.files[getFileIndex(current.parentId)]
    }
    return false
}

function returnImgBasedOnFileType(fileType, lastOfFolder, fileId){
    if(lastOfFolder && fileType !== 'folder') return '/src/assets/filetree-el.svg';
    else if(fileType === 'note') return 'src/assets/filetree-file.svg'
    else if(fileType === 'folder'){
      if(openFolderIds.has(fileId))return 'src/assets/folder-open.svg';
      else return 'src/assets/folder-closed.svg';
    } 
}

export function createFolder(){
    removeTempFile()
    const temporaryCard = document.createElement('div')
    temporaryCard.classList.add('file-card')
    temporaryCard.classList.add('temp')
    temporaryCard.innerHTML = `
        <div class="file-card-header">
            <img class="file-card-img" src="./assets/empty-folder.svg">
            <input type="text" class="temp-card-input">
        </div>
    `
    fileTreeContainerEl.appendChild(temporaryCard)
    const input = document.querySelector('.temp-card-input')
    input.focus()
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            if(input.value.trim() === '') return
            saveFolder()
            removeTempFile()
            renderFiletree()
        }
    })
}

function removeTempFile(){
    const tempFile = document.querySelector('.temp')
    if(tempFile) tempFile.remove()
}

function saveFolder(){
    const folderName = document.querySelector('.temp-card-input').value
    const id = idNum
    const date = getFormattedDate(new Date())
    USER.files.push({
        title: folderName,
        body: '',
        id,
        type: 'folder',
        parentId: currentFolderId,
        date,
        lastEdited: date,
        tags: []
    })
    incrementIdNum()
    updateUserData()
}

export function openFileHolder(){
    fileTreeEl.classList.remove('closed')
}

export function closeFileHolder(){
    fileTreeEl.classList.add('closed')
}

export function toggleFileHolder(){
    isFileHolderOpen ? closeFileHolder() : openFileHolder()
    toggleFileHolderState()
}

function createRightClickMenu(posX, posY, file){
    const menu = document.createElement('div')
    menu.classList.add('right-click-menu')
    menu.appendChild(createDeleteBtn(file.id, menu))
    if(file.parentId){
        if(USER.files[getFileIndex(file.parentId)].pinned){

        }
    } else {
        menu.append(createPinBtn(file, menu))
    }

    if(file.type === 'note'){
        const menuEditBtn = document.createElement('div')
        menuEditBtn.classList.add('rc-menu-item')
        menuEditBtn.textContent = 'Edit'
        menuEditBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            openFile(file.id)
            menu.remove()
        })
        menu.appendChild(menuEditBtn)

        const duplicateBtn = createDuplicateBtn(file.id, menu)
        menu.appendChild(duplicateBtn)
    }

    if(file.type === 'folder'){

      menu.appendChild(createRenameBtn(file, menu));
    }

    menu.style.left = posX + 'px'
    menu.style.top = posY + 'px'
    menu.style.position = 'fixed'
    return menu
}

function createDuplicateBtn(fileID, menu){

  const btn = document.createElement('div');

  btn.classList.add('rc-menu-item');
  btn.classList.add('rc-duplicate-btn');
  btn.textContent = 'duplicate';

  btn.addEventListener('click', () => {
      duplicateFile(fileID)
      menu.remove()
  })

  return btn;
}

function duplicateFile(fileID){
  const file = USER.files[getFileIndex(fileID)];
  const id = idNum
  const date = getFormattedDate(new Date())

  USER.files.push({
        title: `${file.title}(duplicate)`,
        body: file.body,
        id,
        type: 'note',
        parentId: file.parentId,
        date,
        lastEdited: date,
    })

  updateUserData()
  incrementIdNum()
  renderFiletree()
  openFile(id)
}

export function deleteFile(id){
    const file = USER.files[getFileIndex(id)]
    if(file.pinned){
        unpinFile(file)
    }
    file.dateOfDeletion = new Date();
    USER.recentlyDeleted.push(file)
    USER.files.splice(getFileIndex(id), 1)
    updateUserData()
    renderFiletree()
    renderPinnedFiles()
    if(id === getSelectedFileId()){
        setSelectedFileId(null)
        setAppState('Idle')
    }
    if(checkIfTabExists(id)){
        deleteTab(USER.tabs[getTabIndexFromFileId(id)].id)
    }
}

function createDeleteBtn(toBeDeleted, menu){
    const deleteBtn = document.createElement('div')
    deleteBtn.classList.add('rc-menu-item')
    deleteBtn.id = 'rc-delete-btn'
    deleteBtn.textContent = 'Delete'
    deleteBtn.addEventListener('click', () => {
        deleteFile(toBeDeleted)
        menu.remove()
    })
    return deleteBtn
}

function createPinBtn(file, menu){
    const pinBtn = document.createElement('div')
    pinBtn.classList.add('rc-menu-item')
    pinBtn.classList.add('rc-pin-btn')
    if(file.pinned){
        pinBtn.textContent = 'Unpin'
        pinBtn.addEventListener('click', () => {
            unpinFile(file)
            menu.remove()
        })
    } else {
        pinBtn.textContent = 'Pin'
        pinBtn.addEventListener('click', () => {
            pinFile(file)
            menu.remove()
        })
    }
    return pinBtn
}

function createRenameBtn(file, menu){

  const renameBtn = document.createElement('div');

  renameBtn.classList.add('rc-menu-item');
  renameBtn.classList.add('rc-rename-btn');
  renameBtn.textContent = 'Rename';

  renameBtn.addEventListener('click', () => {
      changeTitleToInput(findFileTreeEl(file.id), file);
      menu.remove()
  })

  return renameBtn;
}

function changeTitleToInput(element, file){
    element.innerHTML = ``;
    const input = document.createElement('input');
    input.classList.add('temp-card-input');
    input.value = file.title;

    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            file.title = input.value;
            updateUserData()
            renderFiletree()
        }
    })

    element.appendChild(input)
    input.focus()
}

function findFileTreeEl(fileId){
    const fileCards = document.querySelectorAll('.file-card');
    return Array.from(fileCards).find(card => card.id === String(fileId));  
}

fileTreeContainerEl.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    const file = event.target.closest('.file-card')
    if(!file) return
    document.querySelector('.right-click-menu')?.remove()
    const menu = createRightClickMenu(event.clientX, event.clientY, USER.files[getFileIndex(Number(file.id))])
    fileTreeEl.appendChild(menu)
    menu.addEventListener('click', (e) => e.stopPropagation())
    window.addEventListener('click', () => menu.remove(), { once: true })
})

pinnedDisplayEl.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    const file = event.target.closest('.file-card')
    if(!file) return
    document.querySelector('.right-click-menu')?.remove()
    const menu = createRightClickMenu(event.clientX, event.clientY, USER.files[getFileIndex(Number(file.id))])
    fileTreeEl.appendChild(menu)
    menu.addEventListener('click', (e) => e.stopPropagation())
    window.addEventListener('click', () => menu.remove(), { once: true })
})

function unpinFile(file){
    file.pinned = false
    updateUserData()
    renderPinnedFiles()
}

function pinFile(file){
    file.pinned = true
    updateUserData()
    renderPinnedFiles()
}

export function renderPinnedFiles(){
    pinnedDisplayEl.innerHTML = ''
    const pinnedFiles = USER.files.filter(f => f.pinned === true)

    if(pinnedFiles.length < 1){
        pinnedDisplayEl.style.display = 'none'
        return
    }

    pinnedDisplayEl.style.display = 'block'

    pinnedFiles.forEach(file => {
        if(file.type === 'folder'){
            renderFolder(file, 0, pinnedDisplayEl)
        } else {
            pinnedDisplayEl.appendChild(renderFile(file))
        }
    })
    highlightSelectedFile(getSelectedFileId())
}
