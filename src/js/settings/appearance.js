import { USER, updateUserData } from '../user.js'
import { createFontSelect } from './appearance/fonts.js';

const defaultURL = './src/assets/kangae-logo.svg';

export function createAppearanceMenu(){
  const containerEl = document.createElement('div')
  containerEl.classList.add('appearance-settings-el');

  const fontTitle = document.createElement('h3');
  fontTitle.textContent = 'Font:';

  const fontSelect = createFontSelect()

  const dashboardLogoTitle = document.createElement('h3');
  dashboardLogoTitle.textContent = 'Dashboard Image';

  const dashboardLogoDescription = document.createElement('p');
  dashboardLogoDescription.textContent = 'Paste in a url and hit enter, or type "default" for our default image:';

  const logoInput = document.createElement('input');
  let savedValue = USER.settings.appearance.dashboardLogo;
  if(savedValue === defaultURL) savedValue = 'default';
  logoInput.value = savedValue;

  logoInput.addEventListener('keydown', (e) => {
    if(!e.key === 'Enter') return;
    
    if(logoInput.value === 'defaultURL') {
      USER.settings.appearance.dashboardLogo = defaultURL;
    } else {
      USER.settings.appearance.dashboardLogo = logoInput.value
    }
    updateUserData()
  })

  containerEl.append(fontTitle, fontSelect, dashboardLogoTitle, dashboardLogoDescription, logoInput)
  return containerEl;
}
