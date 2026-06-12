import { createFlashcardModule } from "./sidebar/flashcards.js";
import { createPomodoroModule } from "./sidebar/timer.js";
import { createKeybindMenu } from "./settings/keybindMenu.js";

const settingEl = document.getElementById('settings');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const openSettingsBtn = document.getElementById('settings-btn');
const settingsOutputEl = document.getElementById('settings-output');
const flashcardBtn = document.getElementById('flashcard-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const keybindBtn = document.getElementById('keybinds-btn');

const savedTheme = localStorage.getItem('theme') || 'sakura';

function openSettingsMenu(){
    settingEl.showModal()
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
}

function render(element){
  clearSettingsOutput()
  settingsOutputEl.appendChild(element)
}

function clearSettingsOutput(){
  settingsOutputEl.innerHTML = ``;
}

