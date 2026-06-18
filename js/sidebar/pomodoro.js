import { USER, updateUserData } from '../user.js'

export let countDown = null; 
let timerSound = new Audio('../../assets/timer.mp3')

const TIMER_TYPES = {
  pomodoro: 'pomodoro',
  shortbreak: 'shortbreak',
  longbreak: 'longbreak'
}

function createState(){
  return {
    view: 'timer', // 'timer' || 'settings'
    settings: USER.settings.pomodoroTimer,
  }
}

function ensurePomodoroState(){
  if(!USER.pomodoroState){
    USER.pomodoroState = {
      secondsLeft: USER.settings.pomodoroTimer.pomodoro * 60,
      isGoing: false,
      currentType: TIMER_TYPES.pomodoro,
      pomodoroCounter: 0,
    }
  }
  return USER.pomodoroState;
}

export function createPomodoroModule(isOnSidebar = false){
  const state = createState();
  const root = document.createElement('div');
  root.classList.add('timer-module')
  root.id = 'timer-root';
  render(root, isOnSidebar, state)
  return root;
}

function render(root, isOnSidebar, state){
  root.innerHTML = ``;
  if(!isOnSidebar) renderSettingsList(root, state);
  else createPomodoroTimer(root, state);
}

function renderSettingsList(root, state){
  const title = document.createElement('h3');
  title.textContent = 'Pomodoro Timer:';
  root.appendChild(title);
  root.appendChild(createSettingElement('Pomodoro:', 'pomodoro', state));
  root.appendChild(createSettingElement('Short Break:', 'shortBreak', state));
  root.appendChild(createSettingElement('Long Break:', 'longBreak', state));
  root.appendChild(createSettingElement('Pomodoros before long break:', 'pomodorosBeforeLongBreak', state));
}

function createSettingElement(label, stateKey, state){
  const setting = document.createElement('div');
  const title = document.createElement('p');
  title.textContent = label;
  setting.appendChild(title);
  const input = document.createElement('input');
  input.value = state.settings[stateKey];
  setting.appendChild(input);
  input.addEventListener('change', () => {
    state.settings[stateKey] = input.value;
    updateUserData()
  })
  return setting;
}

function createPomodoroTimer(root, state){
  ensurePomodoroState();
  const pomodoroState = USER.pomodoroState;

  const timerLabel = document.createElement('p');
  timerLabel.classList.add('timer-label');
  timerLabel.style.fontWeight = 'bold';
  updateTimerLabel(timerLabel)
  root.appendChild(timerLabel);

  const timerEl = document.createElement('div');
  timerEl.classList.add('timer')
  timerEl.textContent = formatTime(pomodoroState.secondsLeft);
  root.appendChild(timerEl)

  root.addEventListener('click', () => {
    if(!pomodoroState.isGoing) startTimer(timerEl, state, timerLabel);
    else stopTimer();
  })
}

function setTimer(timeInMinutes){
  USER.pomodoroState.secondsLeft = timeInMinutes * 60;
}

function setTimerType(type){
  USER.pomodoroState.currentType = type;
}

function decrementTimer(){
  USER.pomodoroState.secondsLeft--;
}

function startTimer(displayEl, state, label){
  updateTimerLabel(label)
  USER.pomodoroState.isGoing = true;
  countDown = setInterval(() => {
    decrementTimer()
    updateUI(displayEl, USER.pomodoroState.secondsLeft)
    if(USER.pomodoroState.secondsLeft <= 0){
      stopTimer()
      timerSound.play()
      window.alert(`${USER.pomodoroState.currentType} has ended`)
      handleTimerEnd(displayEl, state, label)
    }
  }, 1000);
}

function stopTimer(){
  clearInterval(countDown);
  USER.pomodoroState.isGoing = false;
  countDown = null;
}

function handleTimerEnd(displayEl, state, label){
  const pomodoroState = USER.pomodoroState;
  if(pomodoroState.currentType === TIMER_TYPES.pomodoro){
    pomodoroState.pomodoroCounter++;
    if(pomodoroState.pomodoroCounter % state.settings.pomodorosBeforeLongBreak === 0){
      setTimerType(TIMER_TYPES.longbreak);
      setTimer(state.settings.longBreak);
    } else {
      setTimerType(TIMER_TYPES.shortbreak)
      setTimer(state.settings.shortBreak);
    }
  } else {
    setTimerType(TIMER_TYPES.pomodoro);
    setTimer(state.settings.pomodoro);
  }
  updateUserData();
  startTimer(displayEl, state, label);
}

function updateUI(timerEl, time){
  timerEl.textContent = formatTime(time);
}

function formatTime(timeInSeconds){
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function updateTimerLabel(labelEl){
  const type = USER.pomodoroState.currentType;
  if(type === TIMER_TYPES.pomodoro) labelEl.textContent = '集Focus';
  else if(type === TIMER_TYPES.shortbreak) labelEl.textContent = '息Short Break';
  else if(type === TIMER_TYPES.longbreak) labelEl.textContent = '暇Long Break';
}
