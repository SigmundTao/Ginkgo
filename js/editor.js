import { notes, currentNoteID, currentNoteDisplayState, setCurrentNoteID, setDisplayState, resetDisplayingNotes, idNum, incrementIdNum, updateEditorVisibility } from './state.js'
import { getNoteIndex, updateNoteData } from './storage.js'
import { renderSidebarNoteCards } from './sidebar.js'
import { loadTagsForNote, clearTags, handleTagDisplayClick } from './tags.js'

const noteTitleEl = document.getElementById('note-title')
const noteBodyEl = document.getElementById('note-body')
const wordCountEl = document.getElementById('word-count')
const characterCountEl = document.getElementById('character-count')

let bodyDebounce

export function initEditor(){
    noteBodyEl.addEventListener('input', handleBodyInput)
}

function handleBodyInput(){
    clearTimeout(bodyDebounce)
    bodyDebounce = setTimeout(() => {
        updateWordCount()
        if(currentNoteDisplayState === 'Editing') saveNoteChanges()
    }, 300)
}

noteTitleEl.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') handleTagDisplayClick()
})

export function focusOnNoteBody(){
    noteBodyEl.focus()
}

function highlightSelectedNote(id){
    const noteCards = document.querySelectorAll('.note-card')
    noteCards.forEach(card => card.classList.remove('selected-note'))
    const selectedCard = document.getElementById(id)
    selectedCard.classList.add('selected-note')
}

export function loadNote(id){
    const noteIndex = getNoteIndex(id)
    console.log(noteIndex)
    if(noteIndex === -1) return
    const note = notes[noteIndex]

    noteTitleEl.value = note.title
    noteBodyEl.value = note.body
    loadTagsForNote(note)
    setCurrentNoteID(note.id)
    setDisplayState('Editing')
    updateEditorVisibility()
    updateWordCount()
    highlightSelectedNote(note.id)
    displayDates(note)
}

export function createBlankNote(){
    clearTags()
    noteBodyEl.value = ''
    noteTitleEl.value = 'Untitled Note'
    setDisplayState('Creating')
    updateEditorVisibility()
    noteTitleEl.focus()
}

function getLastEdited(today, lastEdited){
    if(today !== lastEdited) return today
    else { return lastEdited }
}

export function saveNoteChanges(){
    const noteIndex = getNoteIndex(currentNoteID)
    if(noteIndex === -1) return
    const note = notes[noteIndex];
    if(checkForDuplicateNoteTitles(noteTitleEl.value, note.id)) return
    note.title = noteTitleEl.value
    note.body = noteBodyEl.value
    note.lastEdited = getLastEdited(getFormattedDate(new Date()), note.lastEdited)
    setCurrentNoteID(note.id)
    setDisplayState('Editing')
    displayDates(note)
    updateNoteData()
    renderSidebarNoteCards()
    console.log('firing')
}

function getFormattedDate(dateObj){
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`
}

export function createNewNote(){
    const date = getFormattedDate(new Date())
    const id = idNum

    notes.push({
        title: noteTitleEl.value,
        body: noteBodyEl.value,
        id,
        date,
        lastEdited: date,
        bookmarked: false,
        tags: []
    })

    incrementIdNum()
    updateNoteData()
    resetDisplayingNotes()
    setCurrentNoteID(id)
    setDisplayState('Editing')
    renderSidebarNoteCards()
}


export function saveNote(){
    if(currentNoteDisplayState !== 'Creating') return
    createNewNote()
}

function checkForDuplicateNoteTitles(title, id){
    return notes.some(note => note.id !== id && note.title === title)
}

export function updateWordCount(){
    const text = noteBodyEl.value.trim()
    const words = text === '' ? 0 : text.split(/\s+/).length
    const characters = noteBodyEl.value.length
    wordCountEl.textContent = `${words} Words`
    characterCountEl.textContent = `${characters} Characters`
}

const dateCreatedEl = document.getElementById('date-created');
const lastEditedEl = document.getElementById('date-last-edited');

export function updateDates(id){
    const note = notes[getNoteIndex(id)]
    const today = getFormattedDate(new Date())

    note.lastEdited = today;
    displayDates(note)
}

function displayDates(note){
    if(!note.lastEdited){
        note.lastEdited = note.date
    }
    dateCreatedEl.innerHTML = `
        <div class="created-at"></div>
        <p>${note.date}</p>    
    `
    lastEditedEl.textContent = note.lastEdited
}