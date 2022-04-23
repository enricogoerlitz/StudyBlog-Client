// eslint-disable-next-line no-unused-vars
class CurrentUserModel {
  username = null;
  role = null;

  constructor(user) {
    const { username, role } = user;
    this.username = user.username;
    this.role = role;
  }

  // TODO: implement logout (with removing cookie and redirecting to login)
  logout() {
    this.username = "logmeout";
  }

  // TODO: implement fetchAuthUser => return isAuth
  fetchCurrentUser() {
    this.role = "fetchUserFromDb";
  }

  // TODO: implement update => reset cookie from response to cookie-storage
  updateCurrentUser(user) {
    this.username = "update";
  }
}

export default CurrentUserModel;
