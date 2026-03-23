export function highlightSelectedFile(id){
    document.querySelectorAll('.file-card').forEach(card => card.classList.remove('selected-note'))
    const selectedCard = document.getElementById(id)
    if(selectedCard) selectedCard.classList.add('selected-note')
}

export function loadFile(id){
    const fileIndex = getFileIndex(id)
    if(fileIndex === -1) return
    const file = files[fileIndex]
    setSelectedFileId(file.id)
    setAppState('Editing')
    highlightSelectedFile(file.id)
}

export function saveNoteChanges(file, title, body){
    const fileIndex = getFileIndex(file.id)
    if(fileIndex === -1) return
    if(checkForDuplicateTitles(title, file.id)) return
    files[fileIndex].title = title
    files[fileIndex].body = body
    files[fileIndex].lastEdited = getFormattedDate(new Date())
    setSelectedFileId(file.id)
    setAppState('Editing')
    updateFileData()
    renderFolderContents()
}

export function createNewNote(){
    const date = getFormattedDate(new Date())
    const id = idNum
    files.push({
        title: 'Untitled',
        body: '',
        id,
        type: 'note',
        parentId: currentFolderId,
        date,
        lastEdited: date,
        tags: []
    })
    incrementIdNum()
    updateFileData()
    setSelectedFileId(id)
    setAppState('Editing')
    renderFolderContents()
    return id
}

class Tab {
    constructor(file){

    }

    createPage(){
        const titleInput = document.createElement('input')
        titleInput.type = 'text'
        titleInput.classList.add('title-input')
    }
}

export function initEditor(){
    
}