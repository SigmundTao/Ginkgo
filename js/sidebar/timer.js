import { sidebarContents } from "./sidebar.js";
import { appendChildren } from "../utils/helpers.js";

const timerBtn = document.getElementById('timer-btn');

let pomodoro = 25
let shortBreak = 5
let longBreak = 15

function renderTimer(){
    sidebarContents.innerHTML = ``

    const container = document.createElement('div')

    const timerDisplay = document.createElement('div')

    const timerSettingsEl = document.createElement('div')

    const pomodoroInput = document.createElement('input');
    pomodoroInput.type = 'number';

    const longBreakInput = document.createElement('input');
    longBreakInput.type = 'number';

    const shortBreakInput = document.createElement('input');
    shortBreakInput.type = 'number';

    appendChildren(timerSettingsEl, [pomodoroInput, shortBreakInput, longBreakInput])
    appendChildren(container, [timerDisplay, timerSettingsEl])

    sidebarContents.appendChild(container)
}

export function initTimerBtn(){
    timerBtn.addEventListener('click', renderTimer)
}