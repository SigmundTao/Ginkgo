import { USER, updateUserData } from '../../user.js';
import { updateAppearance } from '../appearance.js';

const fonts = ['Noto Serif JP',
  'Yuji Syuku',
  'Shippori Mincho',
  'Zen Old Mincho',
  'Kosugi Maru',
];

export function createFontSelect() {
    const select = document.createElement('select');
    select.classList.add('settings-select');

    fonts.forEach((font) => {
        select.appendChild(createOption(font));
    });

    select.addEventListener('change', () => {
        USER.settings.appearance.font = select.value.split(' ').join('-');
        updateUserData();
        updateAppearance()
    });

    return select;
}

function createOption(fontName) {
    const option = document.createElement('option');
    option.textContent = fontName;
    option.value = fontName;
    if (fontName.split(' ').join('-') === USER.settings.appearance.font) option.selected = true;

    return option;
}
