const noteDisplayDivEl = document.getElementById('notes-display-div');
const createNewNoteBtn = document.getElementById('create-new-note-btn');
const noteTitleEl = document.getElementById('note-title');
const noteBodyEl = document.getElementById('note-body');
const sidebarEl = document.getElementById('sidebar');
const saveNoteBtn = document.getElementById('save-note-btn');

const noteDisplayStates = ['Idle', 'Editing', 'Creating'];
let currentNoteDisplayState = 'Idle';
let currentNoteID = 0;

const notes = JSON.parse(localStorage.getItem('notes')) || [];

let idNum = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;


function updateNoteData(){
    localStorage.setItem('notes', JSON.stringify(notes));
}

function getNoteIndex(id){
    return notes.findIndex(i => i.id === id);
}

function loadNote(id){
    const noteIndex = getNoteIndex(id);
    const note = notes[noteIndex];

    noteTitleEl.value = note.title;
    noteBodyEl.value = note.body;
    updateCurrentNoteID(note.id)

    currentNoteDisplayState = 'Editing'
}

function createSidebarNoteCard(title, date, containerEl, noteID){
    const sidebarNoteCard = document.createElement('div');
    sidebarNoteCard.classList.add('note-card')
    sidebarNoteCard.innerHTML = `
        <h2>${title}</h2>
        <p>${date}</p>
    `;

    const deleteNoteBtn = document.createElement('button');
    deleteNoteBtn.classList.add('delete-note-btn');
    deleteNoteBtn.textContent = 'x';
    deleteNoteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notes.splice(getNoteIndex(noteID), 1);
        updateNoteData()
        renderSidebarNoteCards()
    })

    sidebarNoteCard.appendChild(deleteNoteBtn) 

    sidebarNoteCard.addEventListener('click', () => loadNote(noteID))
    containerEl.appendChild(sidebarNoteCard)
}

function renderSidebarNoteCards(){
    sidebarEl.innerHTML = '';
    notes.forEach(note => createSidebarNoteCard(note.title, note.date, sidebarEl, note.id));
}

function createBlankNote(){
    noteBodyEl.value = '';
    noteTitleEl.value = 'Untitled Note';
    currentNoteDisplayState = 'Creating';
}

function saveNoteChanges(){
    const noteIndex = getNoteIndex(currentNoteID);
    if(noteIndex === -1) return console.log('note not found, currentNoteID:', currentNoteID)
    if(checkForDuplicateNoteTitles(noteTitleEl.value, notes[noteIndex].id)){
        return;
    }
    notes[noteIndex].title = noteTitleEl.value;
    notes[noteIndex].body = noteBodyEl.value;
    updateCurrentNoteID(notes[noteIndex].id)
    updateNoteData()
    renderSidebarNoteCards(); 
    currentNoteDisplayState = 'Editing';
}

function createOrEdit(){
    if(currentNoteDisplayState === 'Creating') createNewNote();
    if(currentNoteDisplayState === 'Editing') saveNoteChanges();
}

function createNewNote(){
    const noteTitle =  noteTitleEl.value;
    const noteBody = noteBodyEl.value;
    const day = new Date();
    const date = `${day.getDate()}-${day.getMonth() + 1}-${day.getFullYear()}`;
    const id = idNum;
    idNum++;

    notes.push({title: noteTitle, body: noteBody, id:id, date: date});
    updateNoteData()
    updateCurrentNoteID(id);
    renderSidebarNoteCards();
    currentNoteDisplayState = 'Editing';
}

function checkForDuplicateNoteTitles(title, id){
    let hasDuplicates = false;
    notes.forEach(note => {
        if(note.id === id){
            return;
        } else {
            if(note.title === title){
                hasDuplicates = true;
            }
        }
        
    })
    return hasDuplicates;
}

function updateCurrentNoteID(id){
    currentNoteID = id;
}

function saveNote(){
    if(currentNoteDisplayState !== 'Creating') return;
    createNewNote();
}

createNewNoteBtn.addEventListener('click', createBlankNote);
saveNoteBtn.addEventListener('click', createOrEdit);

//Save note with ctrl+s
window.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === 's'){
        e.preventDefault()
        if(currentNoteDisplayState === 'Creating'){
            saveNote()
        } else if(currentNoteDisplayState === 'Editing'){
            saveNoteChanges()
        }
    }
})

noteTitleEl.value = '';
noteBodyEl.value = '';
renderSidebarNoteCards()