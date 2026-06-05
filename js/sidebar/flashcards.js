export const flashcards = JSON.parse(localStorage.getItem('flashcards')) || []

export function createFlashcardModule(){
    const containerEl = document.createElement('div')
    
    flashcards.forEach(pack => {
        containerEl.appendChild(createFlashcardPackEl(pack.title));
    });

    return containerEl;
}

function createFlashcardPackEl(){
    const pack = document.createElement('div')
    pack.classList.add('flashcard-pack-element')

    return pack;
}


