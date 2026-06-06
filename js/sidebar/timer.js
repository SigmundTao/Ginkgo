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
  const time = document.createElement('div');
  time.textContent = formatTime(state.settings.pomodoro * 60);
  root.appendChild(time)
}

function formatTime(timeInSeconds){
  const minutes = timeInSeconds / 60;
  const seconds = timeInSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
