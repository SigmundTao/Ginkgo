import { USER, updateUserData } from '../user.js';
import { createSelect, updateTodoTitle } from './todo/customSelect.js';

export function initTodoLists() {
    setCurrentList(USER.todo.lists[0].name);
}
const toDoBtn = document.getElementById('to-do-btn');
export let currentList = 'todo';

export function setCurrentList(listName) {
    currentList = listName;
}

export function renderToDos(container) {
    container.innerHTML = ``;

    if (!USER.todo.lists[findListIndex(currentList)].tasks.length) {
        container.textContent = 'Press + to create a task';
    } else {
        USER.todo.lists[findListIndex(currentList)].tasks.forEach((task) => {
            container.appendChild(createTaskCard(task));
        });
    }
}

function createDefaultInput() {
    const input = document.createElement('input');
    input.classList.add('persistent-todo-input');
    return input;
}

function createTaskCard(taskDataObj) {
    const task =
        USER.todo.lists[findListIndex(currentList)].tasks[findTaskIndex(taskDataObj.taskName)];
    const card = document.createElement('li');
    card.classList.add('task-card');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (taskDataObj.completed) checkbox.checked = true;
    checkbox.addEventListener('change', () => {
        task.completed = !task.completed;
        updateUserData();
    });

    const title = document.createElement('p');
    title.textContent = taskDataObj.taskName;

    if (taskDataObj.completed) {
        checkbox.checked = true;
    }

    const removeTaskBtn = document.createElement('button');
    removeTaskBtn.textContent = 'x';

    removeTaskBtn.addEventListener('click', () => removeTask(title.textContent));

    card.appendChild(checkbox);
    card.appendChild(title);
    card.appendChild(removeTaskBtn);

    return card;
}

function removeTask(taskName) {
    USER.todo.lists[findListIndex(currentList)].tasks.splice(findTaskIndex(taskName), 1);
    updateUserData();
    renderToDos(document.querySelector('.task-container'));
}

function findTaskIndex(taskTitle) {
    return USER.todo.lists[findListIndex(currentList)].tasks.findIndex(
        (task) => task.taskName === taskTitle
    );
}

function createTask(container, taskValue) {
    USER.todo.lists[findListIndex(currentList)].tasks.push({
        taskName: taskValue,
        completed: false,
    });
    updateUserData();
    renderToDos(container);
}

export function createToDoList() {
    const toDoList = document.createElement('div');
    toDoList.classList.add('todo-module', 'module');

    const listsContainer = document.createElement('div');
    listsContainer.classList.add('list-container');

    const addListBtn = document.createElement('button');
    addListBtn.classList.add('add-list-btn');
    addListBtn.textContent = '+';
    addListBtn.addEventListener('click', () => {
        if (document.querySelector('.list-input')) {
            document.querySelector('.list-input').focus();
            return;
        }
        const input = createListInput();
        listsContainer.appendChild(input);
        input.focus();
    });

    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');

    const persistentInput = createDefaultInput();
    persistentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && persistentInput.value.length) {
            createTask(taskContainer, persistentInput.value.trim());
            persistentInput.value = '';
            persistentInput.focus();
        }
    });

    listsContainer.appendChild(createSelect(USER.todo.lists));
    listsContainer.appendChild(addListBtn);
    toDoList.appendChild(listsContainer);
    toDoList.appendChild(taskContainer);
    toDoList.appendChild(persistentInput);

    renderToDos(taskContainer);
    return toDoList;
}

function createListInput() {
    const input = document.createElement('input');
    input.classList.add('list-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const listName = input.value.trim();
            USER.todo.lists.push({ name: listName, tasks: [] });
            updateUserData();
            setCurrentList(listName);
            updateTodoTitle(currentList);
            input.remove();
        }
    });

    return input;
}

function renderSelectOptions(selectEl, selectValue) {
    selectEl.innerHTML = ``;

    USER.todo.lists.forEach((list) => {
        selectEl.appendChild(createSelectOption(list.name));
    });

    selectEl.value = selectValue;
}

function deleteList(listName) {
    if (USER.todo.lists.length <= 1) return;
    USER.todo.lists.splice(findListIndex(listName), 1);
    updateUserData();
}

function findListIndex(listName) {
    return USER.todo.lists.findIndex((target) => target.name === listName);
}

function createListNameInput(inputContainer, containerEl, renderOptions) {
    const input = document.createElement('input');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            USER.todo.lists.push({ name: input.value.trim(), tasks: [] });
            input.remove();
            updateUserData();
            currentList = input.value.trim();
            updateSelectedListEl();
            renderOptions();
            renderToDos(containerEl);
        }
    });

    inputContainer.appendChild(input);
    input.focus();
}
