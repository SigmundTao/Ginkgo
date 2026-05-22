const rightSidebar = document.getElementById('right-sidebar')
const sidebarBtn = document.getElementById('right-sidebar-btn')
const toDoBtn = document.getElementById('to-do-btn');
const scrapPaperBtn = document.getElementById('scrap-paper-btn');

export function initRightSidebar(){
    sidebarBtn.addEventListener('click', openAndCloseSidebar)
}

function openAndCloseSidebar(){
    rightSidebar.classList.toggle('closed-sidebar')
    console.log(rightSidebar.classList)
}