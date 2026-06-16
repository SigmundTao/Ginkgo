export const USER = JSON.parse(localStorage.getItem('user')) || {
  files: [],
  tabs: [],
  todo: {
    lists: [
      {name: 'todo', tasks: []}
    ],
  },
}

export function updateUserData(){
  localStorage.setItem('user', JSON.stringify(USER))
}
