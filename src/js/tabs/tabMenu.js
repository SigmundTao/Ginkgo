import { createTab } from '../tabs.js';
import { createNewNote } from '../editor.js';

class MenuItem {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.type = obj.type;
        this.img = obj.img;
    }

    createElement() {
        const menuItemEl = document.createElement('div');
        menuItemEl.classList.add('tab-menu-item');

        const title = document.createElement('p');
        title.textContent = this.title;

        const img = document.createElement('div');
        img.classList.add('tab-menu-img');
        img.style.backgroundImage = `url(${this.img})`;
        img.style.backgroundSize = 'contain';
        img.style.backgroundRepeat = 'no-repeat';
        img.style.backgroundPosition = 'center';

        menuItemEl.appendChild(title);
        menuItemEl.appendChild(img);
        return menuItemEl;
    }
}

const menuItems = [
    new MenuItem({
        id: 'pomodoro',
        title: 'Pomodoro',
        type: 'pomodoro',
        img: 'src/assets/timer.svg',
    }),
    new MenuItem({
        id: 'flashcards',
        title: 'Flashcards',
        type: 'flashcards',
        img: 'src/assets/flashcards.svg',
    }),
    new MenuItem({ id: 'todo', title: 'Todo', type: 'todo', img: 'src/assets/todo.svg' }),
];

export function createTabMenu(posX, posY) {
    const menuEl = document.createElement('div');
    menuEl.classList.add('tab-menu');

    const createNewFile = document.createElement('div');
    createNewFile.classList.add('tab-menu-item');
    createNewFile.innerHTML = `
    <p>New Note</p>
    <img src="src/assets/file.svg" class="tab-menu-img">
  `;
    createNewFile.onclick = () => {
        createNewNote(false);
        menuEl.remove();
    };
    menuEl.appendChild(createNewFile);

    menuItems.forEach((item) => {
        const element = item.createElement();
        element.addEventListener('click', () => {
            createTab(null, item.type);
            menuEl.remove();
        });
        menuEl.appendChild(element);
    });

    menuEl.style.position = 'fixed';
    menuEl.style.top = `${posY + 15}px`;
    menuEl.style.left = `${posX + 5}px`;

    return menuEl;
}
