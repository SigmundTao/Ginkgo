import { createFlashcardModule } from "./sidebar/flashcards.js";
import { createPomodoroModule } from "./sidebar/timer.js";

const settingEl = document.getElementById('settings');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const openSettingsBtn = document.getElementById('settings-btn');
const settingsOutputEl = document.getElementById('settings-output');
const flashcardBtn = document.getElementById('flashcard-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');

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

export function initSettings(){
    openSettingsBtn.addEventListener('click', openSettingsMenu)

  flashcardBtn.addEventListener('click', () => {
    clearSettingsOuput()
    render(createFlashcardModule(false))
  })

  pomodoroBtn.addEventListener('click', () => {
    clearSettingsOutput()
    render(createPomodoroModule(false))
  })
}

function render(element){
  clearSettingsOutput()
  settingsOutputEl.appendChild(element)
}

function clearSettingsOutput(){
  settingsOutputEl.innerHTML = ``;
}

