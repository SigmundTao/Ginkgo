import { initTimerBtn } from "./timer.js";

const rightSidebar = document.getElementById('right-sidebar')
const sidebarBtn = document.getElementById('right-sidebar-btn')
export const sidebarContents = document.getElementById('sidebar-contents');

export function initRightSidebar(){
    sidebarBtn.addEventListener('click', openAndCloseSidebar)
    initTimerBtn()
}

function openAndCloseSidebar(){
    rightSidebar.classList.toggle('closed-sidebar')
    console.log(rightSidebar.classList)
}
