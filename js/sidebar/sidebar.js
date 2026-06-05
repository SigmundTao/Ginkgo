import { createTimer } from "./timer.js";
import { createToDoList, todoData } from "./todo.js";

const rightSidebar = document.getElementById('right-sidebar');
const sidebarBtn = document.getElementById('right-sidebar-btn');
const addModuleBtn = document.getElementById('add-module-btn');

class Module {
    /// Expecting {id, title, imageURL, element}
    constructor(moduleObj){
        this.id = moduleObj.id;
        this.title = moduleObj.title;
        this.image = moduleObj.img;
        this.element = moduleObj.element; 
    }

    createModule(){
        const module = document.createElement('div');
        module.classList.add('module');
        
        module.appendChild(this.element);
        sidebarContents.appendChild(module);
    }

    createMenuItem(){
        const menuItem = document.createElement('div');
        menuItem.classList.add('module-menu-item');

        menuItem.innerHTML = `
            <div backgroundImage="url${this.image}" class="module-img">
            <p>${this.title}</p>
        `
        menuItem.addEventListener('click', this.createModule);

        return menuItem;
    }
}

const modules = [
    new Module({id:'todo-module', title: 'todo', image: '../../assets/todo.svg', element:createToDoList()}),
    new Module({id:'timer-module', title: 'timer', image: '../../assets/timer.svg', element:createTimer()}), 
]
export const sidebarContents = document.getElementById('sidebar-contents');

export function initRightSidebar(){
    sidebarBtn.addEventListener('click', openAndCloseSidebar)
}

function openAndCloseSidebar(){
    rightSidebar.classList.toggle('closed-sidebar')
    console.log(rightSidebar.classList)
}

function createModuleMenu(){
    const moduleMenuEl = document.createElement('div');
    moduleMenuEl.classList.add('module-menu');

    modules.forEach(module => {
        moduleMenuEl.appendChild(module.createMenuItem())
    })

    sidebarContents.appendChild(moduleMenuEl)
}

addModuleBtn.addEventListener('click', createModuleMenu)
