import { USER } from './user.js';
import { showToast, TOAST_TYPES } from './toast.js';

function createTextFile(file, parentFolder) {
    const note = file;
    parentFolder.file(`${note.title}.txt`, note.body);
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
            createTextFile(item, folder);
        }
    });
}

async function exportFiles(filesArr) {
    const zip = new JSZip();

    if (!filesArr.length) {
        showToast('No notes to export', TOAST_TYPES.ALERT);
        return;
    }

    filesArr.forEach((note) => {
        if (note.type === 'folder') createFolder(note, zip, filesArr);
        else createTextFile(note, zip);
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
    downloadBtn.textContent = 'Download';
    containerEl.appendChild(downloadBtn);
    downloadBtn.addEventListener('click', () => exportFiles(USER.files));

    return containerEl;
}
