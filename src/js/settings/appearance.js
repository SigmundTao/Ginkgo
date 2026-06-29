import { USER, updateUserData } from '../user.js'

const defaultURL = './src/assets/kangae-logo.svg';

export function createAppearanceMenu(){
  const containerEl = document.createElement('div')
  containerEl.classList.add('appearance-settings-el');

  const title = document.createElement('h3');
  title.textContent = 'Dashboard Image';

  const description = document.createElement('p');
  description.textContent = 'Paste in a url and hit enter, or type "default" for our default image:';

  const input = document.createElement('input');
  let savedValue = USER.settings.appearance.dashboardLogo;
  if(savedValue === defaultURL) savedValue = 'default';
  input.value = savedValue;

  input.addEventListener('keydown', (e) => {
    if(!e.key === 'Enter') return;
    
    if(input.value === 'defaultURL') {
      USER.settings.appearance.dashboardLogo = defaultURL;
    } else {
      USER.settings.appearance.dashboardLogo = input.value
    }
    updateUserData()
  })

  containerEl.append(title, description, input)
  return containerEl;
}
