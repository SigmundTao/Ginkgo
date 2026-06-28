import { USER, updateUserData } from '../user.js'

export let countDown = null; 
let timerSound = new Audio('../../assets/timer.mp3')

const TIMER_TYPES = {
  pomodoro: 'pomodoro',
  shortbreak: 'shortbreak',
  longbreak: 'longbreak'
}

function createState(){
  return USER.settings.pomodoroTimer

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

export function createPomodoroModule(){
  const state = createState();
  const root = document.createElement('div');
  root.classList.add('timer-module')
  root.id = 'timer-root';
  render(root, state)
  return root;
}

function render(root, state){
  root.innerHTML = ``;
  createPomodoroTimer(root, state);
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

  const startStopBtn = document.createElement('button');
  startStopBtn.textContent = 'Start';
  root.appendChild(startStopBtn);

  startStopBtn.addEventListener('click', () => {
    if(!pomodoroState.isGoing) {
      startTimer(timerEl, state, timerLabel);
      startStopBtn.textContent = 'Stop';
    } else {
      stopTimer();
      startStopBtn.textContent = 'Start';
    }
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
    if(pomodoroState.pomodoroCounter % state.pomodorosBeforeLongBreak === 0){
      setTimerType(TIMER_TYPES.longbreak);
      setTimer(state.longBreak);
    } else {
      setTimerType(TIMER_TYPES.shortbreak)
      setTimer(state.shortBreak);
    }
  } else {
    setTimerType(TIMER_TYPES.pomodoro);
    setTimer(state.pomodoro);
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
