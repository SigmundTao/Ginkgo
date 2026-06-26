import { createAppearanceMenu } from "./appearance.js"
import { createFlashcardModule } from "../sidebar/flashcards.js"
import { createPomodoroModule } from "../sidebar/pomodoro.js"
import { createKeybindMenu } from "./keybindMenu.js"
import { createDailyNoteSettings } from "./daily-note.js"
import { createExportSettings } from '../export.js'

const settingEl = document.getElementById('settings')
const appearanceBtn = document.getElementById('appearance-btn')
const closeSettingsBtn = document.getElementById('close-settings-btn')
const openSettingsBtn = document.getElementById('settings-btn')
const settingsOutputEl = document.getElementById('settings-output')
const flashcardBtn = document.getElementById('flashcard-btn')
const pomodoroBtn = document.getElementById('pomodoro-btn')
const keybindBtn = document.getElementById('keybinds-btn')
const dailyNoteBtn = document.getElementById('daily-note-settings-btn')
const exportBtn = document.getElementById('export-settings-btn')

const savedTheme = localStorage.getItem('theme') || 'sakura';

function openSettingsMenu(){
    settingEl.showModal()
    settingsOutputEl.innerHTML = '';
}

function closeSettingsMenu(){
    settingEl.close()
}

export function toggleConfigMenu(){
  if(settingEl.classList.contains('.settings-closed')){
    openSettingsMenu()
    settingEl.classList.toggle('.settings-closed');
  } else {
    closeSettingsMenu()
    settingEl.classList.toggle('.settings-closed');
  }
}

function setTheme(theme){
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
}

closeSettingsBtn.addEventListener('click', closeSettingsMenu)

export function initSettings(){
  openSettingsBtn.addEventListener('click', openSettingsMenu)

  flashcardBtn.addEventListener('click', () => render(createFlashcardModule(false)))

  pomodoroBtn.addEventListener('click', () => render(createPomodoroModule(false)))

  keybindBtn.addEventListener('click', () => render(createKeybindMenu()))

  appearanceBtn.addEventListener('click', () => render(createAppearanceMenu()))

  dailyNoteBtn.addEventListener('click', () => render(createDailyNoteSettings()))

  exportBtn.addEventListener('click', () => render(createExportSettings()))
}

function render(element){
  clearSettingsOutput()
  settingsOutputEl.appendChild(element)
}

function clearSettingsOutput(){
  settingsOutputEl.innerHTML = ``;
}

