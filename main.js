const noteDisplayDivEl = document.getElementById('notes-display-div');
const createNewNoteBtn = document.getElementById('create-new-note-btn');
const noteTitleEl = document.getElementById('note-title');
const noteBodyEl = document.getElementById('note-body');
const sidebarEl = document.getElementById('sidebar');
const saveNoteBtn = document.getElementById('save-note-btn');

const noteDisplayStates = ['Idle', 'Editing', 'Creating'];
let currentNoteDisplayState = 'idle';
let currentNoteTitle = ''

let idNum = 2;

const notes = [{title: 'note1', body:'This is the first note in this app', date:'16-03-2026', id:'1'},
    {title: 'note2', body:'this is the second note in the app', date:'16-03-2026', id:'2'}
]

function getNoteIndex(title){
    return notes.findIndex(i => i.title === title);
}

function loadNote(title){
    const noteIndex = getNoteIndex(title);
    const note = notes[noteIndex];

    noteTitleEl.value = note.title;
    noteBodyEl.value = note.body;
    updateCurrentNoteTitle()

    currentNoteDisplayState = 'Editing'
}

function createSidebarNoteCard(title, date, containerEl){
    const sidebarNoteCard = document.createElement('div');
    sidebarNoteCard.innerHTML = `
        <h2>${title}</h2>
        <p>${date}</p>
    `;

    sidebarNoteCard.addEventListener('click', () => loadNote(title))
    containerEl.appendChild(sidebarNoteCard)
}

function updateNotes(){
    sidebarEl.innerHTML = '';
    notes.forEach(note => createSidebarNoteCard(note.title, note.date, sidebarEl));
}

function createBlankNote(){
    noteBodyEl.value = '';
    noteTitleEl.value = 'Untitled Note';
    currentNoteDisplayState = 'Creating';
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
    updateCurrentNoteTitle();
    updateNotes();
    currentNoteDisplayState = 'Editing';
}

function checkForDuplicateNoteTitles(title){
    console.log('this function is running')
    let hasDuplicates = false;
    notes.forEach(note => {
        console.log(title, note.title)
        if(note.title === title){
            hasDuplicates = true;
        }
    })
    return hasDuplicates;
}

function saveNoteChanges(){
    const noteIndex = getNoteIndex(currentNoteTitle);

    if(checkForDuplicateNoteTitles(noteTitleEl.value)){
        return;
    }
    notes[noteIndex].title = noteTitleEl.value;
    notes[noteIndex].body = noteBodyEl.value;
    updateCurrentNoteTitle()
    updateNotes(); 
    currentNoteDisplayState = 'Editing';
}

function updateCurrentNoteTitle(){
    currentNoteTitle = noteTitleEl.value;
}

function saveNote(){
    if(currentNoteDisplayState === 'Editing') return
    createNewNote()
}

createNewNoteBtn.addEventListener('click', createBlankNote);
saveNoteBtn.addEventListener('click', createOrEdit);

noteTitleEl.value = '';
noteBodyEl.value = '';
updateNotes()