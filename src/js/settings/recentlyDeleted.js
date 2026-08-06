import { USER, updateUserData } from '../user.js';
import { idNum, incrementIdNum } from '../state.js';
import { renderFiletree } from '../filetree.js';
import { render as updateSettingEl } from './settings.js';

class DeletedFile {
    constructor(file) {
        this.file = file;
    }

    createElement() {
        const card = document.createElement('div');
        card.classList.add('deleted-file-card');

        const title = document.createElement('p');
        title.textContent = this.file.title;

        const btnHolder = document.createElement('div');
        btnHolder.classList.add('deleted-file-btn-holder');

        const recoverBtn = document.createElement('button');
        recoverBtn.classList.add('settings-btn');
        recoverBtn.textContent = 'recover';
        recoverBtn.onclick = () => {
            this.file.daysUntilDeletion = 5;
            USER.files.push(this.file);
            deleteFile(this.id);
            updateUserData();
            updateSettingEl(createNoteRecoverySettings(USER.recentlyDeleted));
            renderFiletree();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('settings-remove-btn');
        deleteBtn.textContent = 'x';
        deleteBtn.onclick = () => {
            deleteFile(this.file.id);
            updateUserData();
            updateSettingEl(createNoteRecoverySettings(USER.recentlyDeleted));
        };

        btnHolder.append(recoverBtn, deleteBtn);
        card.append(title, btnHolder);
        return card;
    }
}

function getIndexById(id) {
    return USER.recentlyDeleted.findIndex((file) => file.id === id);
}

function convertFilesIntoDeletedFileClassObjects(filesArr) {
    const newFiles = [];

    if (filesArr.length) {
        filesArr.forEach((file) => {
            newFiles.push(new DeletedFile(file));
        });
    }

    return newFiles;
}

export function createNoteRecoverySettings(files) {
    const containerEl = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = 'Recently Deleted:';

    const text = document.createElement('p');
    text.textContent = 'all deleted files will be permanently removed after 7 days';

    const fileContainer = document.createElement('div');
    fileContainer.classList.add('delted-files-container');
    if (!files.length) fileContainer.textContent = 'No recently deleted files.';

    const deletedFiles = convertFilesIntoDeletedFileClassObjects(files).reverse();
    if (deletedFiles.length) {
        deletedFiles.forEach((file) => {
            if (!removePermanently(file)) {
                fileContainer.appendChild(file.createElement());
            }
        });
    }

    containerEl.append(title, text, fileContainer);
    return containerEl;
}

function removePermanently(file) {
    const today = new Date();
    const endDate = addDays(file.dateOfDeletion, 7);
    let hasBeenDeleted = false;

    if (today.getTime >= endDate.getTime()) {
        deleteFile(file.id);
        updateUserData();
        hasBeenDeleted = true;
    }

    return hasBeenDeleted;
}

function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

function deleteFile(id) {
    USER.recentlyDeleted.splice(getIndexById(id), 1);
}
