import { createTab } from '../tabs.js';

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
    menuItemEl.addEventListener('click', () => {

    })

    const title = document.createElement('h3');
    title.textContent = this.title;

    const img = document.createElement('div');
    img.classList.add('tab-menu-img');
    img.style.backgroundImg = this.img;
    img.style.backgroundSize = 'contain';
    img.style.backgroundRepeat = 'no-repeat';
    img.style.backgroundPosition = 'center';
    
    menuItemEl.appendChild(title);
    menuItemEl.appendChild(img);
    return menuItemEl;
  }
}

const menuItems = [
  new MenuItem({id: 'pomodoro', title:'Pomodoro', type: 'pomodoro', img: '../../assets/timer.svg'}),
  new MenuItem({id: 'flashcards', title:'Flashcards', type: 'flashcards', img: '../../assets/flashcards.svg'}),
  new MenuItem({id: 'todo', title:'Todo', type: 'todo', img: '../../assets/flashcards.svg'}),
]

export function createTabMenu(){
  const menuEl = document.createElement('div');
  menuEl.classList.add('tab-menu');

  menuItems.forEach(item => {
    const element = item.createElement()
    element.addEventListener('click', () => createTab(null, item.type));

    menuEl.appendChild(element);
  })

  return menuEl;
}
