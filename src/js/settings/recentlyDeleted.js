import { USER, updateUserData } from '../user.js';
import { idNum, incrementIdNum } from '../state.js';
import { renderFiletree } from '../filetree.js';
import { render as updateSettingEl } from './settings.js';

class DeletedFile {
  constructor(file) {
    this.file = file
  }

  createElement() {
    const card = document.createElement('div');
    card.classList.add('deleted-file-card');

    const title = document.createElement('p');
    title.textContent = this.file.title;

    const recoverBtn = document.createElement('button');
    recoverBtn.textContent = 'recover';
    recoverBtn.onclick = () => {
      USER.files.push(this.file);
      USER.recentlyDeleted.splice(getIndexById(this.file.id), 1);
      updateUserData()
      updateSettingEl(createNoteRecoverySettings(USER.recentlyDeleted))
      renderFiletree()
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';

    card.append(title, recoverBtn, deleteBtn);
    return card;
  }
}

function getIndexById(id) {
  return USER.recentlyDeleted.findIndex(file => file.id === id);
}

function convertFilesIntoDeletedFileClassObjects(filesArr) {
  const newFiles = []

  if(filesArr.length){
    filesArr.forEach(file => {
        newFiles.push(new DeletedFile(file));
    })
  }

  return newFiles;
}


export function createNoteRecoverySettings(files) {
  const containerEl = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = 'Recently Deleted:';

  const fileContainer = document.createElement('div');
  fileContainer.classList.add('delted-files-container');
  if(!files.length) fileContainer.textContent = 'No recently deleted files.'

  const deletedFiles = convertFilesIntoDeletedFileClassObjects(files);
  if(deletedFiles.length){
    deletedFiles.forEach(file => {
      fileContainer.appendChild(file.createElement())
    })
  }

  containerEl.append(title, fileContainer);
  return containerEl;
}
