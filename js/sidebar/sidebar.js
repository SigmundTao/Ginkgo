import { initScrapPaperBtn } from "./scrappaper.js";
const rightSidebar = document.getElementById('right-sidebar')
const sidebarBtn = document.getElementById('right-sidebar-btn')
export const sidebarContents = document.getElementById('sidebar-contents');

export function initRightSidebar(){
    sidebarBtn.addEventListener('click', openAndCloseSidebar)
    initScrapPaperBtn()
}

function openAndCloseSidebar(){
    rightSidebar.classList.toggle('closed-sidebar')
    console.log(rightSidebar.classList)
}
