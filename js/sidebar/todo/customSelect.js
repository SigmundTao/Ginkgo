import { renderToDos, setCurrentList, currentList } from '../todo.js';

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
  element.textContent = `用${currentList}`
}

export function createSelect(lists) {
  const selectEl = document.createElement('div');
  selectEl.classList.add('custom-select');

  const displayingList = document.createElement('div');
  displayingList.classList.add('displaying-list-option');
  displayingList.classList.add('custom-dropdown-option');
  displayingList.textContent = `用${currentList}`
  selectEl.addEventListener('click', () => {
    const dropdown = getDropdownEl()
    if(dropdown) dropdown.remove();
    selectEl.appendChild(createDropdown(selectEl, lists));
  })

  selectEl.appendChild(displayingList);

  return selectEl;
}

function createDropdown(selectEl, lists) {
  const dropdown = document.createElement('div');
  dropdown.classList.add('custom-dropdown');

  lists.forEach(list => {
    const listName = list.name;
    if(listName === currentList) return;
    else {
      const option = createOption(listName);
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        setCurrentList(listName);
        updateSelectedListText();
        renderToDos(getContainerEl());
        dropdown.remove();
      })

      dropdown.appendChild(option);
    }
  })

  return dropdown;
}

function createOption(listName) {
  const option = document.createElement('div');
  option.classList.add('custom-dropdown-option');
  option.textContent = listName;

  return option
}
