import { notes, tags, currentNoteID, resetDisplayingNotes } from './state.js'
import { updateTagData, updateNoteData, getNoteIndex } from './storage.js'
import { renderSidebarNoteCards } from './sidebar.js'
import { focusOnNoteBody } from './editor.js'

const tagInputEl = document.getElementById('tags-input')
const tagDisplayEl = document.getElementById('tags-display')
const tagSelectEl = document.getElementById('tag-select')

export function clearTags(){
    tagInputEl.value = ''
    tagDisplayEl.innerHTML = ''
}

export function initTags(){
    tagInputEl.addEventListener('blur', handleTagBlur)
    tagDisplayEl.addEventListener('click', handleTagDisplayClick)
    tagSelectEl.addEventListener('change', handleTagSelectChange)
}

function handleTagBlur(){
    const parsedTags = getTags()
    tagInputEl.style.display = 'none'
    tagDisplayEl.style.display = 'flex'
    tagDisplayEl.innerHTML = parsedTags.map(tag => `<span class="tag">${tag}</span>`).join('')
    saveTags(parsedTags)
}

tagInputEl.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        handleTagBlur()
        focusOnNoteBody()
    }
})

export function handleTagDisplayClick(){
    tagDisplayEl.style.display = 'none'
    tagInputEl.style.display = 'block'
    tagInputEl.focus()
}

function handleTagSelectChange(){
    const selected = tagSelectEl.value
    if(selected === 'All'){
        resetDisplayingNotes()
        renderSidebarNoteCards()
    } else {
        filterByTag(selected)
    }
}

export function getTags(){
    const matches = tagInputEl.value.match(/\[([^\]]+)\]/g) || []
    return matches.map(tag => tag.slice(1, -1))
}

export function loadTagsForNote(note){
    tagInputEl.value = note.tags && note.tags.length > 0
        ? note.tags.map(tag => `[${tag}]`).join(' ')
        : ''
    tagDisplayEl.innerHTML = note.tags.length > 0
        ? note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
        : ''
    tagInputEl.style.display = 'none'
    tagDisplayEl.style.display = 'flex'
}

export function saveTags(tagArr){
    const index = getNoteIndex(currentNoteID)
    if(index === -1) return

    const oldTags = notes[index].tags || []
    const removedTags = oldTags.filter(tag => !tagArr.includes(tag))

    notes[index].tags = tagArr

    tagArr.forEach(tag => {
        if(!tags.includes(tag)) tags.push(tag)
    })

    console.log('tags before splice:', [...tags])
    console.log('removed tags:', removedTags)

    removedTags.forEach(t => {
        const stillInUse = notes.some(note => note.tags && note.tags.includes(t))
        if(!stillInUse) tags.splice(tags.indexOf(t), 1)
    })

    updateTagData()
    updateTagSelect()
    updateNoteData()
}

export function updateTagSelect(){
    tagSelectEl.innerHTML = ''
    const allOption = document.createElement('option')
    allOption.textContent = 'All'
    tagSelectEl.appendChild(allOption)
    tags.forEach(tag => {
        const option = document.createElement('option')
        option.textContent = tag
        option.value = tag
        tagSelectEl.appendChild(option)
    })
}

function filterByTag(tag){
    import('./state.js').then(({ notes, setDisplayingNotes }) => {
        setDisplayingNotes(notes.filter(note => note.tags && note.tags.includes(tag)))
        renderSidebarNoteCards()
    })
}