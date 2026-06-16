import { USER, updateUserData } from '../user.js'

export function createAppearanceMenu(){
  const containerEl = document.createElement('div')
  containerEl.classList.add('appearance-settings-el');

  const title = document.createElement('p');
  title.textContent = 'Dashboard Image';

  const input = document.createElement('input');
  input.value = USER.settings.appearance.dashboardLogo;

  input.addEventListener('change', () => {
    USER.settings.appearance.dashboardLogo = input.value;
    updateUserData()
  })

  containerEl.appendChild(title)
  containerEl.appendChild(input)

  return containerEl;
}
