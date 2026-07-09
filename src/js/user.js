export const USER = JSON.parse(localStorage.getItem('user')) || {
  files: [],
  recentlyDeleted: [],
  tabs: [],
  todo: {
    lists: [
      {name: 'todo', tasks: []}
    ],
  },
  settings: {
    appearance: {
      dashboardLogo: './src/assets/kangae-logo.svg'
    },
    dailyNote: {
      preset: '',
      folder: null,
    },
    pomodoroTimer: {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      pomodorosBeforeLongBreak: 4,
    },
    flashcards: {
      packs: []
    }
  },
  lastLogIn: '',
}

export function updateUserData(){
  localStorage.setItem('user', JSON.stringify(USER))
}

export function updateLastLogIn() {
  const today = new Date();
  if(USER.lastLogIn !== today) USER.lastLogIn = today;
}
