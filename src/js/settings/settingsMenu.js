import { createAppearanceMenu } from './appearance.js';
import { createDailyNoteSettings } from './daily-note.js';
import { createKeybindMenu } from './keybindMenu.js';
import { createPomodoroSettings } from './pomodoroSettings.js';
import { createExportSettings } from '../export.js';

function render(settingsOuput, contentElement) {
  settingsOuput.innerHTML = '';
  settingsOuput.appendChild(contentElement);
}

class SettingsItem {
  constructor(obj) {
    this.text = obj.text;
    this.id = obj.id;
    this.fn = obj.fn;
  }

  createEl() {
    const btnEl = document.createElement('div');
    btnEl.classList.add('settings-nav-item');
    btnEl.id = this.id;
    btnEl.textContent = this.text;

    btnEl.onclick = this.fn();
  }

  getContent() {
    this.fn()
  }
}

const SETTINGS_NAV_ITEMS = [
  new SettingsItem(
    {
      text: 'Appearance',
      id: 'appearance-btn',
      fn: createAppearanceMenu,
    }),

  new SettingsItem(
    {
      text: 'Daily Note',
      id: 'daily-note-settings-btn',
      fn: createDailyNoteSettings,
    }),

  new SettingsItem(
    {
      text: 'Key Binds',
      id: 'keybinds-btn',
      fn: createKeybindMenu,
    }),

  new SettingsItem(
    {
      text: 'Flashcards',
      id: 'flashcard-btn',
      fn: createFlashcardMenu,
    }),

  new SettingsItem(
      {
        text: 'Pomodoro Timer',
        id: 'pomodoro-btn',
        fn: createPomodoroSettings,
      }),

  new SettingsItem(
      {
        text: 'Export',
        id: 'export-settings-btn',
        fn: createExportSettings,
      }),

  new SettingsItem(
      {
        text: 'Recently Deleted',
        id: 'recently-deleted-btn',
        fn: () => {createNoteRecoverySettings(USER.recentlyDeleted)},
      }),
]

function getNavItems(navEl, contentContainer) {
  SETTINGS_NAV_ITEMS.forEach(el => {
    const btn = el.createEl();
    btn.onclick = () {
      render(contentContainer, el.getContent())
    }
    navEl.appendChild(btn);
  })
}

export function createSettingsMenu() {
  const menu = document.createElement('div');
  menu.classList.add('settings-closed', 'menu');
  menu.id = 'settings';

  const nav = document.createElement('div');
  nav.id = 'settings-nav';

  const ouput = document.createElement('div');
  output.id = 'settings-output';

  getNavItems(nav, output);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'x';
  removeBtn.id = 'close-settings-btn';
  removeBtn.classList.add('settings-remove-btn');
}

/*
<dialog id="settings" class="settings-closed menu">
            <div id="settings-nav">
                <div class="settings-nav-item" id="appearance-btn">Appearance</div>
                <div class="settings-nav-item" id="daily-note-settings-btn">Daily Note</div>
                <div class="settings-nav-item" id="keybinds-btn">Keybinds</div>
                <div class="settings-nav-item" id="flashcard-btn">Flashcards</div>
                <div class="settings-nav-item" id="pomodoro-btn">Pomodoro Timer</div>
                <div class="settings-nav-item" id="export-settings-btn">Export</div>
                <div class="settings-nav-item" id="recently-deleted-btn">Recently Deleted</div>
            </div>
            <div id="settings-output"></div>
            <button id="close-settings-btn" class="settings-remove-btn">x</button>
        </dialog>
*/
