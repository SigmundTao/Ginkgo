import { sidebarContents } from "./sidebar.js";
import { appendChildren } from "../utils/helpers.js";
import { setTimer, setTimerType, currentTimerType } from "../state.js";

const timerBtn = document.getElementById('timer-btn');

let pomodoro = 25
let shortBreak = 5
let longBreak = 15

function renderTimer(){
    sidebarContents.innerHTML = ``

    const container = document.createElement('div')

    const timerDisplay = document.createElement('div')
    updateTimerDisplay(timerDisplay)

    const timerSettingsEl = document.createElement('div')

    const pomodoroLabel = document.createElement('p');
    pomodoroLabel.textContent = 'Pomodoro:'

    const pomodoroInput = document.createElement('input');
    pomodoroInput.type = 'number';
    pomodoroInput.value = pomodoro;
    pomodoroInput.addEventListener('change', () => {
        pomodoro = pomodoroInput.value;
        updateTimerDisplay(timerDisplay)
    })

    const longBreakLabel = document.createElement('p');
    longBreakLabel.textContent = 'Long Break:'

    const longBreakInput = document.createElement('input');
    longBreakInput.type = 'number';
    longBreakInput.value = longBreak;

    const shortBreakLabel = document.createElement('p');
    shortBreakLabel.textContent = 'Short Break:';

    const shortBreakInput = document.createElement('input');
    shortBreakInput.type = 'number';
    shortBreakInput.value = shortBreak;

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';

    appendChildren(timerSettingsEl, [pomodoroLabel, pomodoroInput, shortBreakLabel, shortBreakInput, longBreakLabel, longBreakInput, startBtn])
    appendChildren(container, [timerDisplay, timerSettingsEl])

    sidebarContents.appendChild(container)
}

function updateTimerDisplay(timer){
    timer.textContent = '';

    timer.textContent = `${pomodoro}:00`
}

export function initTimerBtn(){
    timerBtn.addEventListener('click', renderTimer)
}

function renderActiveTimer(){
    const containerEl = document.createElement('div');

    const timerTypeEl = document.createElement('div');

}