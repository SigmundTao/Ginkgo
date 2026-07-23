import { updateAppearance } from '../appearance.js';

class BackgroundOption {
  constructor(obj) {
    this.title = obj.title;
    this.img = obj.img;
  }

  createElement() {
    const option = document.createElement('div');
    option.classList.add('background-option');

    const imageEl = document.createElement('div');
    imageEl.classList.add('background-option-image');

    imageEl.style.backgroundImage = `url(${this.img})`;

    const title = document.createElement('p');
    title.classList.add('title')
    title.textContent = this.title;

    option.append(imageEl, title);
    return option;
  }
}

const backgroundOptions = {
  'Anime Girl': 'https://wallpapercave.com/wp/wp15660269.jpg',
  'Solo Leveling': 'https://wallpapercave.com/wp/wp10784706.jpg',
  'Painter': 'https://wallpapercave.com/wp/wp16042487.png',
}

export function createBackgroundSelect() {
  const settingsContainer = document.createElement('div');
  settingsContainer.classList.add('background-options-container');

  const title = document.createElement('h3');
  title.textContent = 'Editor Background:';

  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('options-container');

  settingsContainer.append(title, optionsContainer);


}
