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
  }
}

export function updateUserData(){
  localStorage.setItem('user', JSON.stringify(USER))
}
