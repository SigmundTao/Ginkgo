import { toggleFileHolder } from "./filetree.js"

const openFilesBtn = document.getElementById('open-files-btn')

export function initNavBar(){
    openFilesBtn.addEventListener('click', toggleFileHolder)
}