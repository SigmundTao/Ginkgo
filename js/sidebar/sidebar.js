import { createPomodoroModule, countDown as timerIntervalID } from "./timer.js"
import { createToDoList, todoData } from "./todo.js"
import { openModules, removeOpenModule, addOpenModule } from "../state.js"
import { createFlashcardModule } from "./flashcards.js"

const toolbar = document.getElementById('right-sidebar');
const sidebarBtn = document.getElementById('right-sidebar-btn');
const addModuleBtn = document.getElementById('add-module-btn');
export const sidebarContents = document.getElementById('sidebar-contents');

class Module {
    /// Expecting {id, title, imageURL, element}
    constructor(moduleObj){
        this.id = moduleObj.id;
        this.title = moduleObj.title;
        this.image = moduleObj.image;
        this.element = moduleObj.element; 
    }

    createModule(){
        if(openModules.includes(this.title)) return;
        if(openModules.length >= 4) return;
        
        addOpenModule(this.title)
        const module = document.createElement('div');
        module.classList.add('module');
        module.appendChild(this.element());

        const deleteModuleBtn = document.createElement('button');
        deleteModuleBtn.classList.add('delete-module-btn');
        deleteModuleBtn.addEventListener('click', () => {
            if(this.id === 'timer-module') clearInterval(timerIntervalID);
            module.remove()
            removeOpenModule(this.title)
        })
        deleteModuleBtn.textContent = 'x';
        
        module.appendChild(deleteModuleBtn)
        sidebarContents.appendChild(module);
    }

    createMenuItem(){
        const menuItem = document.createElement('div');
        menuItem.classList.add('module-menu-item');

        menuItem.innerHTML = `
            <div class="module-img" style="background-image:url('${this.image}')">
            <p>${this.title}</p>
        `
        menuItem.addEventListener('click', this.createModule.bind(this));
        menuItem.addEventListener('click', removeModuleMenu);

        return menuItem;
    }
}

export const modules = [
    new Module({id:'todo-module', title: 'todo', image: 'assets/todo.svg', element:createToDoList}),
    new Module({id:'timer-module', title: 'timer', image: 'assets/timer.svg', element:() => createPomodoroModule(true)}), 
    new Module({id:'flashcard-module', title: 'flashcards', image: 'assets/flashcards.svg', element:() => createFlashcardModule(true)}), 
]

export function openAndCloseSidebar(){
    toolbar.classList.toggle('closed-sidebar')
}

export function createModuleMenu(){
    const moduleMenuEl = document.createElement('div');
    moduleMenuEl.classList.add('module-menu');

    modules.forEach(module => {
        moduleMenuEl.appendChild(module.createMenuItem())
    })

    sidebarContents.appendChild(moduleMenuEl)
}

export function removeModuleMenu (){
    document.querySelector('.module-menu')?.remove()
}

function initAddModuleBtn(){
  addModuleBtn.addEventListener('click', createModuleMenu)
}

export function initRightSidebar(){
    sidebarBtn.addEventListener('click', openAndCloseSidebar);
    initAddModuleBtn()
}
