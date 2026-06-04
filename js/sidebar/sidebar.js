import { initTimerBtn } from "./timer.js";

const rightSidebar = document.getElementById('right-sidebar');
const sidebarBtn = document.getElementById('right-sidebar-btn');
const addModuleBtn = document.getElementById('add-module-btn');
const modules = [
    {title: 'todo', image: '../../assets/todo.svg', id:'todo-module'},
    {title: 'timer', image: '../../assets/timer.svg', id:'todo-module'},
]
export const sidebarContents = document.getElementById('sidebar-contents');

export function initRightSidebar(){
    sidebarBtn.addEventListener('click', openAndCloseSidebar)
    initTimerBtn()
}

function openAndCloseSidebar(){
    rightSidebar.classList.toggle('closed-sidebar')
    console.log(rightSidebar.classList)
}

function createModuleMenu(){
    const moduleMenuEl = document.createElement('div');
    moduleMenuEl.classList.add('module-menu');

    modules.forEach(module => {
       moduleMenuEl.appendChild(createModuleCard(module))
    })

    sidebarContents.appendChild(moduleMenuEl)
}

function createModuleCard(moduleObj){
    const moduleCardEl = document.createElement('div');
    moduleCardEl.classList.add('module-card');

    const modulePicEl = document.createElement('div');
    modulePicEl.classList.add('module-pic')
    modulePicEl.style.backgroundImage = `url(${moduleObj.image})`;

    const moduleTitle = document.createElement('p');
    moduleTitle.classList.add('module-title');
    moduleTitle.textContent = moduleObj.title;

    moduleCardEl.appendChild(modulePicEl)
    moduleCardEl.appendChild(moduleTitle)
    
    return moduleCardEl;
}

addModuleBtn.addEventListener('click', createModuleMenu)
