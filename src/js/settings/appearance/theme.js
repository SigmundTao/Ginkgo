import { USER, updateUserData } from '../../user.js';
import { updateAppearance } from '../appearance.js';

const themes = ['light', 'dark'];

export function createThemeSelect() {
  const select = document.createElement('select');

  themes.forEach(theme => {
    select.appendChild(createSelectOption(theme));
  })

  select.addEventListener('change', () => {
    USER.settings.appearance.theme = select.value;
    updateUserData()
    updateAppearance()
  })

  return select;
}

function createSelectOption(theme){
  const option = document.createElement('option');
  option.textContent = theme;
  option.value = theme;

  if(theme === USER.settings.appearance.theme) option.selected = true;

  return option;
}

