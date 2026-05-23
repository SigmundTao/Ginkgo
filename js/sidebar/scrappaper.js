import { sidebarContents } from "./sidebar.js";

let i = 1;

const scrapPaperBtn = document.getElementById('scrap-paper-btn');

function renderScrapPaper(){
    sidebarContents.innerHTML = '';

    const scrapPaper = createScrapPaper()
    sidebarContents.appendChild(scrapPaper)

    scrapPaper.focus()
}

function createScrapPaper(){
    const input = document.createElement('textarea');
    input.classList.add('scrap-paper')
    
    return input;
}

export function initScrapPaperBtn(){
    scrapPaperBtn.addEventListener('click', renderScrapPaper)
}
