import { renderToDos, setCurrentList, currentList } from '../todo.js';
import { USER, updateUserData } from '../../user.js';

function getContainerEl() {
    return document.querySelector('.task-container');
}

function getDropdownEl() {
    return document.querySelector('.custom-dropdown');
}

function getSelectedListEl() {
    return document.querySelector('.displaying-list-option');
}

function updateSelectedListText() {
    const element = getSelectedListEl();
    element.textContent = `用${currentList}`;
}

export function createSelect(lists) {
    const selectEl = document.createElement('div');
    selectEl.classList.add('custom-select');

    const displayingList = document.createElement('div');
    displayingList.classList.add('displaying-list-option', 'custom-dropdown-option');
    displayingList.textContent = `用${currentList}`;
    displayingList.addEventListener('click', (e) => {
        e.stopPropagation()
        const dropdown = getDropdownEl();
        if(dropdown){
            dropdown.remove();
            return;
        }

        const newDropdown = createDropdown(lists, displayingList);
        if (newDropdown) selectEl.appendChild(newDropdown);
    });

    selectEl.appendChild(displayingList);

    return selectEl;
}

function createDropdown(lists, displayingListEl) {
    if (lists.length <= 1) return;

    const dropdown = document.createElement('div');
    dropdown.classList.add('custom-dropdown');

    lists.forEach((list) => {
        const listName = list.name;
        if (listName === currentList) return;
        else {
            const option = createOption(listName, dropdown);
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                setCurrentList(listName);
                updateTodoTitle(currentList);
                updateSelectedListText();
                renderToDos(getContainerEl());
                dropdown.remove();
            });

            dropdown.appendChild(option);
        }
    });

    return dropdown;
}

export function updateTodoTitle(currentList) {
    const element = document.querySelector('.displaying-list-option');
    element.textContent = `用${currentList}`;
}

function createOption(listName, dropdown) {
    const option = document.createElement('div');
    option.classList.add('custom-dropdown-option');

    const title = document.createElement('p');
    title.classList.add('dropdown-option-title');
    title.textContent = listName;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('dropdown-delete-btn');
    deleteBtn.textContent = 'x';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        const listIndex = USER.todo.lists.findIndex((list) => list.name === listName);
        if (USER.todo.lists.length - 1 <= 0) showToast();
        else USER.todo.lists.splice(listIndex, 1);
        updateUserData();
        option.remove();
        if (USER.todo.lists.length <= 1) dropdown.remove();
    };

    option.append(title, deleteBtn);

    return option;
}
