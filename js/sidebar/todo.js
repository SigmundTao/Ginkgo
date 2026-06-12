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
    const card = document.createElement('div');

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
  toDoList.classList.add('todo-module');

  const listsContainer = document.createElement('div');
  listsContainer.classList.add('list-container');

  const addListBtn = document.createElement('button');
  addListBtn.classList.add('add-list-btn');
  addListBtn.textContent = '+';
  
  const taskContainer = document.createElement('div');
  taskContainer.classList.add('task-container');

  const { wrapper, renderOptions } = createCustomSelect(listsContainer, taskContainer);

  const createTaskBtn = document.createElement('button');
  createTaskBtn.textContent = '+';

  addListBtn.addEventListener('click', () => {
    createListNameInput(listsContainer, taskContainer, renderOptions);
  });

  listsContainer.appendChild(wrapper);
  listsContainer.appendChild(addListBtn)
  toDoList.appendChild(listsContainer)
  toDoList.appendChild(taskContainer)
  toDoList.appendChild(createTaskBtn)

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

function createCustomSelect(listsContainer, taskContainer) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('custom-select');

  const selected = document.createElement('div');
  selected.classList.add('custom-select-selected');
  selected.textContent = `用${currentList}`;

  const dropdown = document.createElement('div');
  dropdown.classList.add('custom-select-dropdown');
  dropdown.style.display = 'none';

  const renderOptions = () => {
    dropdown.innerHTML = '';
    todoData.lists.forEach(list => {
      const item = document.createElement('div');
      item.classList.add('custom-select-item');
      item.textContent = list.name;

      item.addEventListener('click', () => {
        currentList = list.name;
        selected.textContent = `用${list.name}`;
        dropdown.style.display = 'none';
        renderToDos(taskContainer);
      });

      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        createDeleteBtn(e.clientX, e.clientY, list.name, renderOptions, taskContainer, selected);
      });

      dropdown.appendChild(item);
    });
  };

  selected.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });

  window.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  renderOptions();
  wrapper.appendChild(selected);
  wrapper.appendChild(dropdown);
  return { wrapper, renderOptions };
}

function createDeleteBtn(posX, posY, listName) {
  document.querySelector('.list-delete-btn')?.remove();

  const deleteBtn = document.createElement('div');
  deleteBtn.classList.add('list-delete-btn');
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.left = posX + 'px';
  deleteBtn.style.top = posY + 'px';
  deleteBtn.style.position = 'fixed';

  document.body.appendChild(deleteBtn);

  deleteBtn.addEventListener('click', () => {
    deleteList(listName);
    currentList = todoData.lists[0].name;
    renderSelectOptions(document.querySelector('.list-select'), todoData.lists[0].name);
    renderToDos(document.querySelector('.task-container'));
    deleteBtn.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target !== deleteBtn) {
      deleteBtn.remove();
    }
  }, { once: true });
}

function deleteList(listName){
  if(todoData.lists.length <= 1) return;
  todoData.lists.splice(findListIndex(listName), 1)
  updateTodoData()
}

function findListIndex(listName) {
  return todoData.lists.findIndex(target => target.name === listName)
}

function createListNameInput(inputContainer, containerEl, renderOptions) {
  const input = document.createElement('input');

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      todoData.lists.push({ name: input.value.trim(), tasks: [] });
      input.remove();
      updateTodoData();
      currentList = input.value.trim();
      renderOptions();
      renderToDos(containerEl);
    }
  });

  inputContainer.appendChild(input);
  input.focus();
}
