import { USER, updateUserData } from '../user.js';

export function createDailyNoteSettings() {
    const container = document.createElement('div');

    const folderTitle = document.createElement('h3');
    folderTitle.textContent = 'Daily Note folder';

    const folderSelect = createFolderSelect();

    const presetTitle = document.createElement('h3');
    presetTitle.textContent = 'Daily note preset';

    const presetInput = document.createElement('textarea');
    presetInput.value = USER.settings.dailyNote.preset;
    presetInput.classList.add('daily-preset-input');

    presetInput.addEventListener('change', () => {
        USER.settings.dailyNote.preset = presetInput.value;
        updateUserData();
    });

    container.append(folderTitle, folderSelect, presetTitle, presetInput);

    return container;
}

function createFolderSelect() {
    const select = document.createElement('select');
    select.classList.add('settings-select');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'None';
    select.appendChild(defaultOption);

    const folders = USER.files.filter((file) => file.type === 'folder');
    if (folders.length) {
        folders.forEach((folder) => {
            select.appendChild(createOptionForFolder(folder));
        });
    }

    select.addEventListener('change', () => {
        if (select.textContent === defaultOption.textContent) USER.settings.dailyNote.folder = null;
        else {
            const index = select.selectedIndex;
            const optionElements = select.options;

            USER.settings.dailyNote.folder = Number(optionElements[index].id);
        }
        updateUserData();
    });

    return select;
}

function createOptionForFolder(folder) {
    const option = document.createElement('option');
    option.id = folder.id;
    option.textContent = folder.title;
    if(USER.settings.dailyNote.folder === folder.id) option.selected = true;
    console.log('option:', option, ' selected:', option.selected);

    return option;
}
