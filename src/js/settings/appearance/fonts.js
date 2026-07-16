import { USER, updateUserData } from '../../user.js';
const fonts = ['Noto Serif JP',
  'Yuji Syuku',
  'Shippori Mincho',
  'Zen Old Mincho',
  'Kosugi Maru',
];

export function createFontSelect() {
    const select = document.createElement('select');

    fonts.forEach((font) => {
        select.appendChild(createOption(font));
    });

    select.addEventListener('change', () => {
        document.body.classList = '';
        USER.settings.appearance.font = select.value.split(' ').join('-');
        updateUserData();
        document.body.classList = USER.settings.appearance.font;
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
