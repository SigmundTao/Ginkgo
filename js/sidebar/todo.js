import { updateTodoData } from "../storage.js";

const toDoBtn = document.getElementById('to-do-btn');
let currentList = 'todo';

export const todoData = JSON.parse(localStorage.getItem('todoData')) || {lists: [
  {name: 'todo', tasks: [/*{taskName: 'name', completed: false}*/]}
]}
 
function renderToDos(container) {
    container.innerHTML = ``

    if(!todoData.lists[findListIndex(currentList)].tasks.length){
        container.textContent = 'Press + to create a task';
    } else {
        todoData.lists[findListIndex(currentList)].tasks.forEach(task => {
           container.appendChild(createTaskCard(task)); 
        });
    }
}

function createTaskCard(taskDataObj) {
    const task = todoData.lists[findListIndex(currentList)].tasks[findTaskIndex(taskDataObj.taskName)];
    const card = document.createElement('li');
    card.classList.add('task-card');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if(taskDataObj.completed) checkbox.checked = true;
    checkbox.addEventListener('change', () => {
      task.completed = !task.completed;
      updateTodoData();
    })

    const title = document.createElement('p');
    title.textContent = taskDataObj.taskName;

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

function findTaskIndex(taskTitle) {
    return todoData.lists[findListIndex(currentList)].tasks.findIndex(task => task.taskName === taskTitle)
}

function createTask(container) {
    const card = document.createElement('li');

    const taskInput = document.createElement('input');

    taskInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            todoData.lists[findListIndex(currentList)].tasks.push({taskName: taskInput.value, completed: false});
            updateTodoData()
            renderToDos(container)
        }
    })

    card.appendChild(taskInput)
    container.appendChild(card)

    taskInput.focus()
}

export function createToDoList() {

  const toDoList = document.createElement('div');
  toDoList.classList.add('to-do-list');

  const listsContainer = document.createElement('div');
  listsContainer.classList.add('list-container');

  const listSelect = document.createElement('select');
  listsContainer.appendChild(listSelect)
  renderSelectOptions(listSelect, todoData.lists[0].name)
  
  const addListBtn = document.createElement('button');
  addListBtn.textContent = '+';
  listsContainer.appendChild(addListBtn)
  
  const todoTitle = document.createElement('h3');
  todoTitle.textContent = 'To Do:';

  const taskContainer = document.createElement('li');
  taskContainer.classList.add('task-container');

  const createTaskBtn = document.createElement('button');
  createTaskBtn.textContent = '+';

  listSelect.addEventListener('change', () => {
    currentList = listSelect.textContent;
    renderToDos(taskContainer)
  })

  addListBtn.addEventListener('click', () => {
    createListNameInput(listsContainer, taskContainer, listSelect);
  });

  toDoList.appendChild(todoTitle)
  toDoList.appendChild(listsContainer)
  toDoList.appendChild(taskContainer)
  toDoList.appendChild(createTaskBtn)

  listSelect.addEventListener('change', () => {
    currentList = listSelect.value;
    renderToDos(taskContainer)
  })

  createTaskBtn.addEventListener('click', () => {createTask(taskContainer)})
  renderToDos(taskContainer)
  console.log(currentList)
  return toDoList;
}

function renderSelectOptions(selectEl, selectValue) {
  selectEl.innerHTML = ``

  todoData.lists.forEach(list => {
      selectEl.appendChild(createSelectOption(list.name))
  })

  selectEl.value = selectValue;
}

function createSelectOption(optionName) {
  const optionEl = document.createElement('option');
  optionEl.value = optionName;
  optionEl.textContent = optionName;

  return optionEl;
}

function findListIndex(listName) {
  return todoData.lists.findIndex(target => target.name === listName)
}

function createListNameInput(inputContainer, containerEl, selectEl) {
  const input = document.createElement('input');
  
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      todoData.lists.push({name: `${input.value.trim('')}`, tasks: []});
      input.remove();
      updateTodoData()
      currentList = input.value.trim();
      renderSelectOptions(selectEl, input.value.trim(''));
      renderToDos(containerEl)
    }
  })

  inputContainer.appendChild(input);
}
