import { updateTodoData } from "../storage.js";
import { sidebarContents } from "./sidebar.js";

const toDoBtn = document.getElementById('to-do-btn');
export const todoData = JSON.parse(localStorage.getItem('todoData')) || [];

function renderToDos(container){
    container.innerHTML = ``

    if(todoData.length < 1){
        container.textContent = 'Press + to create a task';
    } else {
        todoData.forEach(item => {
           container.appendChild(createTaskCard(item)); 
        });
    }
}

function createTaskCard(taskDataObj){
    const card = document.createElement('li');
    card.classList.add('task-card');
    card.id = taskDataObj.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const title = document.createElement('p');
    title.textContent = taskDataObj.task;

    if(taskDataObj.completed){
        checkbox.checked = true
    }

    const removeTaskBtn = document.createElement('button');
    removeTaskBtn.textContent = 'x';

    removeTaskBtn.addEventListener('click', () => {
        todoData.splice(findTaskIndex(title.textContent), 1);

        updateTodoData()
        renderToDos(document.querySelector('.task-container'))
    })
    card.appendChild(checkbox);
    card.appendChild(title);
    card.appendChild(removeTaskBtn);

    return card;
}

function findTaskIndex(taskTitle){
    return todoData.findIndex(obj => obj.task === taskTitle)
}

function createTask(container){
    const card = document.createElement('li');

    const taskInput = document.createElement('input');

    taskInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            todoData.push({task: taskInput.value, completed: false});
            updateTodoData()
            renderToDos(container)
        }
    })

    card.appendChild(taskInput)
    container.appendChild(card)

    taskInput.focus()
}

function createToDoList(){
    const toDoList = document.createElement('div');
    toDoList.classList.add('to-do-list');

    const todoTitle = document.createElement('h3');
    todoTitle.textContent = 'To Do:';

    const taskContainer = document.createElement('li');
    taskContainer.classList.add('task-container');

    const createTaskBtn = document.createElement('button');
    createTaskBtn.textContent = '+';

    toDoList.appendChild(todoTitle)
    toDoList.appendChild(taskContainer)
    toDoList.appendChild(createTaskBtn)

    createTaskBtn.addEventListener('click', () => {createTask(taskContainer)})

    renderToDos(taskContainer)
    
    return toDoList;
}

toDoBtn.addEventListener('click', () => {
    sidebarContents.innerHTML = ``
    console.log('clicking')
    sidebarContents.appendChild(createToDoList())
})