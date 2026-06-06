import { createFlashcardModule } from "./sidebar/flashcards.js";

const settingEl = document.getElementById('settings');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const openSettingsBtn = document.getElementById('settings-btn');
const settingsOutputEl = document.getElementById('settings-output');
const flashcardBtn = document.getElementById('flashcard-btn');

const savedTheme = localStorage.getItem('theme') || 'sakura';

export function openSettingsMenu(){
    settingEl.showModal()
}

function closeSettingsMenu(){
    settingEl.close()
}

function setTheme(theme){
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
}

closeSettingsBtn.addEventListener('click', closeSettingsMenu)

// Flashcard Settings
export function initSettings(){
    openSettingsBtn.addEventListener('click', openSettingsMenu)

    flashcardBtn.addEventListener('click', () => {
        settingsOutputEl.innerHTML = ``;
        settingsOutputEl.appendChild(createFlashcardModule(false))
        console.log('firing');
    })
}

