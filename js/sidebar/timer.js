let timer = 25;
let timerIsGoing = false;
export let countDown = null;
let pomodoroCounter = 0;
let currentTimerType = 'pomodoro'; // 'pomodoro', 'shortbreak', 'longbreak';
let timerSound = new Audio('../../assets/timer.mp3')

const TIMER_TYPES = {
  pomodoro: 'pomodoro', 
  shorbreak:'shortbreak', 
  longbreak:'longbreak'
}

function createState(){
  return {
    view: 'timer', // 'timer' || 'settings'
    settings: JSON.parse(localStorage.getItem('timerSettings')) || {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      pomodorosBeforeLongBreak: 4,
    } 
  } 
}

function save(state){
  localStorage.setItem('timerSettings', JSON.stringify(state.settings))
}

export function createPomodoroModule(isOnSidebar = false){
  const state = createState();
  const root = document.createElement('div');
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
    save(state)
  })

  return setting;
}

function createPomodoroTimer(root, state){
  const timerLabel = document.createElement('p');
  timerLabel.classList.add('timer-label');
  updateTimerLabel(timerLabel)
  root.appendChild(timerLabel);

  setTimer(state.settings.pomodoro)
  const timerEl = document.createElement('div');
  timerEl.textContent = formatTime(state.settings.pomodoro * 60);
  root.appendChild(timerEl)

  root.addEventListener('click', () => {
    if(!timerIsGoing) startTimer(timerEl, state, timerLabel);
    else stopTimer();
  })
}

function setTimer(timeInMinutes){
  timer = timeInMinutes * 60;
}

function setTimerType(type){
  currentTimerType = type;
}

function decrementTimer(){
  timer--;
}

function startTimer(displayEl, state, label){
  updateTimerLabel(label)
  timerIsGoing = true;
  countDown = setInterval(() => {
    decrementTimer()
    updateUI(displayEl, timer)
    if(timer <= 0){
      stopTimer()
      handleTimerEnd(displayEl, state, label)
    } 
  }, 1000);
}

function stopTimer(){
  clearInterval(countDown);
  timerIsGoing = false;
  countDown = null;
  timerSound.play()
  window.alert(`${currentTimerType} has ended`)
}

function handleTimerEnd(displayEl, state, label){
  if(currentTimerType === TIMER_TYPES.pomodoro){
    pomodoroCounter++;
    if(pomodoroCounter % state.settings.pomodorosBeforeLongBreak === 0){
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
  if(currentTimerType === TIMER_TYPES.pomodoro) labelEl.textContent = 'Focus';
  else if(currentTimerType === TIMER_TYPES.shortbreak) labelEl.textContent = 'Short Break';
  else if(currentTimerType === TIMER_TYPES.longbreak) labelEl.textContent = 'Long Break';
}
