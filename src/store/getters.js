const getters = {
  sidebar: state => state.app.sidebar,
  deivce: state => state.app.deivce,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffphoto
}
export default getters
