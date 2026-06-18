export const USER = JSON.parse(localStorage.getItem('user')) || {
  files: [],
  tabs: [],
  todo: {
    lists: [
      {name: 'todo', tasks: []}
    ],
  },
  settings: {
    appearance: {
      dashboardLogo: 'assets/kangae-logo.svg'
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
    }
  }
}

export function updateUserData(){
  localStorage.setItem('user', JSON.stringify(USER))
}
