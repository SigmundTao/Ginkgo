import { USER } from './user.js';
import { showToast, TOAST_TYPES } from './toast.js';

function createFile(file, parentFolder) {
    const note = file;
    parentFolder.file(`${note.title}.md`, note.body);
}

function createFolder(file, rootFolder, filesArr, parentFolder = null) {
    let parent = parentFolder;
    if (parentFolder == null) {
        parent = rootFolder;
    }

    const folder = parent.folder(`${file.title}`);

    const folderContents = filesArr.filter((note) => note.parentId === file.id);

    folderContents.forEach((item) => {
        if (item.type === 'folder') createFolder(item, rootFolder, filesArr, folder.id);
        else {
            createFile(item, folder);
        }
    });
}

export async function exportSingleFile(file) {
    const blob = new Blob([file.body], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
}

async function exportFiles(filesArr) {
    const zip = new JSZip();

    if (!filesArr.length) {
        showToast('No notes to export', TOAST_TYPES.ALERT);
        return;
    }

    filesArr.forEach((item) => {
        if (item.type === 'folder') createFolder(item, rootFolder, filesArr, folder);
        else createFile(note, zip);
    });

    const blob = await zip.generateAsync({
        type: 'blob',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'kangae.zip';
    a.click();

    URL.revokeObjectURL(url);
}

export function createExportSettings() {
    const containerEl = document.createElement('div');

    const title = document.createElement('h3');
    title.textContent = 'Export Notes:';
    containerEl.appendChild(title);

    const description = document.createElement('p');
    description.textContent =
        'Clicking this button will transfer all your notes into .txt files and will be downloaded as a zip file called "kangae".';
    containerEl.appendChild(description);

    const downloadBtn = document.createElement('button');
    downloadBtn.classList.add('settings-btn');
    downloadBtn.textContent = 'Download';
    containerEl.appendChild(downloadBtn);
    downloadBtn.addEventListener('click', () => exportFiles(USER.files));

    return containerEl;
}
