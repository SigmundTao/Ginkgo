import { createAppearanceMenu } from './appearance.js';
import { createFlashcardModule } from '../sidebar/flashcards.js';
import { createPomodoroModule } from '../sidebar/pomodoro.js';
import { createKeybindMenu } from './keybindMenu.js';
import { createDailyNoteSettings } from './daily-note.js';
import { createExportSettings } from '../export.js';
import { createPomodoroSettings } from './pomodoroSettings.js';
import { createNoteRecoverySettings } from './recentlyDeleted.js';
import { setOpenMenu } from '../menus.js';
import { USER } from '../user.js';

const settingsEl = document.getElementById('settings');
const appearanceBtn = document.getElementById('appearance-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const openSettingsBtn = document.getElementById('settings-btn');
const settingsOutputEl = document.getElementById('settings-output');
const flashcardBtn = document.getElementById('flashcard-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const keybindBtn = document.getElementById('keybinds-btn');
const dailyNoteBtn = document.getElementById('daily-note-settings-btn');
const exportBtn = document.getElementById('export-settings-btn');
const recentlyDeletedBtn = document.getElementById('recently-deleted-btn');

export function openSettingsMenu() {
    settingsEl.classList.remove('settings-closed');
    settingsEl.classList.add('settings-open');
    settingsOutputEl.innerHTML = '';
    setOpenMenu('settings')
}

export function closeSettingsMenu() {
    settingsEl.classList.remove('settings-open');
    settingsEl.classList.add('settings-closed');
}

export function toggleConfigMenu() {
    if (settingsEl.classList.contains('settings-closed')) {
        openSettingsMenu();
    } else {
        closeSettingsMenu();
    }
}

export function initSettings() {
    openSettingsBtn.addEventListener('click', openSettingsMenu);
    closeSettingsBtn.addEventListener('click', closeSettingsMenu);

    flashcardBtn.addEventListener('click', () => render(createFlashcardModule(false)));

    pomodoroBtn.addEventListener('click', () => render(createPomodoroSettings()));

    keybindBtn.addEventListener('click', () => render(createKeybindMenu()));

    appearanceBtn.addEventListener('click', () => render(createAppearanceMenu()));

    dailyNoteBtn.addEventListener('click', () => render(createDailyNoteSettings()));

    exportBtn.addEventListener('click', () => render(createExportSettings()));

    recentlyDeletedBtn.addEventListener('click', () =>
        render(createNoteRecoverySettings(USER.recentlyDeleted))
    );
}

export function render(element) {
    clearSettingsOutput();
    settingsOutputEl.appendChild(element);
}

function clearSettingsOutput() {
    settingsOutputEl.innerHTML = ``;
}
