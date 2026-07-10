import { USER, updateUserData } from '../user.js';

class Setting {
    constructor(obj) {
        this.setting = obj.setting;
        this.title = obj.title;
    }

    createElement() {
        const container = document.createElement('div');

        const label = document.createElement('p');
        label.textContent = `${this.title}:`;
        container.appendChild(label);

        const input = document.createElement('input');
        input.type = 'number';
        input.value = USER.settings.pomodoroTimer[this.setting];
        container.appendChild(input);
        input.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            USER.settings.pomodoroTimer[this.setting] = input.value;
            console.log(USER.settings.pomodoroTimer[this.setting]);
            updateUserData();
        });

        return container;
    }
}

const settings = [
    new Setting({ setting: 'pomodoro', title: 'Pomodoro' }),
    new Setting({ setting: 'shortBreak', title: 'Short Break' }),
    new Setting({ setting: 'longBreak', title: 'Long Break' }),
    new Setting({ setting: 'pomodorosBeforeLongBreak', title: 'Pomodoros before long break' }),
];

export function createPomodoroSettings() {
    const root = document.createElement('div');

    const title = document.createElement('h3');
    title.textContent = 'Pomodoro';
    root.appendChild(title);

    settings.forEach((setting) => {
        root.appendChild(setting.createElement());
    });

    return root;
}
