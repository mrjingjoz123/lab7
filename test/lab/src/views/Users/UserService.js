const userService = {
  userList: [
    { id: 1, name: 'Phitchaya', gender: 'M' },
    { id: 2, name: 'Test1', gender: 'M' }
  ],
  listId: 3,
  addUser (user) {
    user.id = this.listId++
    this.userList.push(user)
  },
  updateUser (user) {
    const index = this.userList.findIndex(item => item.id === user.id)
    this.userList.splice(index, 1, user)
  },
  deleteUser (user) {
    const index = this.userList.findIndex(item => item.id === user.id)
    this.userList.splice(index, 1)
  },
  getUsers () {
    return [...this.userList]
  }
}
export default userService
