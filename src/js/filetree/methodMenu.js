import { getFileIndex } from '../storage.js';
import { updateUserData} from '../user.js';
import { renderFiletree, deleteFile } from '../filetree.js';
import { USER } from '../user.js';
import { setOpenMenu } from '../menus.js';

class MethodTarget {
    constructor(obj){
        this.file = obj.file;
        this.method = obj.method;
        this.targetFileID = obj.targetFileID;
    }

    createElement() {
        const el = document.createElement('div');

        el.id = this.file.id;
        el.textContent = this.file.title;

        if(this.method === 'merge') {
            el.addEventListener('click', () => {
                merge(this.targetFileID, this.file.id)
                closeMethodMenu()
            })
        } else {
            el.addEventListener('click', () => {
                moveTo(this.targetFileID, this.file.id)
                closeMethodMenu()
            })
        }

        return el;
    }
}

export function createMethodMenu(method, fileID) {
    const menu = document.createElement('div');
    menu.classList.add('method-menu');

    const searchBar = document.createElement('input');

    const output = document.createElement('div');
    output.classList.add('action-menu-output');

    const filteredFiles = filter(method, null);
    render(method, output, filteredFiles, fileID);

    searchBar.addEventListener('input', () => {
        const newFiles = filter(method, searchBar.value.trim())
        render(method, output, newFiles, fileID);
    })

    menu.append(searchBar, output);
    document.body.appendChild(menu);
    setOpenMenu('method menu');
    searchBar.focus();
}

export function closeMethodMenu() {
    document.querySelector('.method-menu')?.remove()
}

function render(method, output, files, fileID) {
    output.innerHTML = '';

    files.forEach(item => {
        const target = new MethodTarget({
                file: item,
                targetFileID: fileID,
                method,
            }) 

        output.appendChild(target.createElement())

    })
}

function filter(method, string) {
    let returning = 'nada';
    if(method === 'merge') returning = USER.files.filter(file => file.type === 'note');
    else if(method === 'move') returning = USER.files.filter(file => file.type === 'folder');
    if(!string) return returning;
    return returning;
}

function getContent(method) {
    const files = USER.files;
    if(method === 'move') return files.filter(file => file.type === 'folder');
    else if(method === 'merge') return files.filter(file => file.type === 'note');
}

function moveTo(fileID, targetID) {
    const file = USER.files[getFileIndex(fileID)];

    file.parentId = targetID;
    updateUserData()
    renderFiletree()
}

function merge(fileID, targetID) {
    const oldFile = USER.files[getFileIndex(fileID)]
    const targetFile = USER.files[getFileIndex(targetID)];

    targetFile.body += `
        ---
        ${oldFile.body}
    `

    deleteFile(fileID);
    updateUserData();
    renderFiletree();
}


