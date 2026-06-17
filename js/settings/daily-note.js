import { USER, updateUserData } from '../user.js'

export function createDailyNoteSettings(){
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = 'Daily note preset';

  const input = document.createElement('textarea');
  input.value = USER.settings.dailyNote.preset

  input.addEventListener('change', () => {
    USER.settings.dailyNote.preset = input.value;
    updateUserData()
  })

  container.appendChild(title);
  container.appendChild(input);

  return container;
}
