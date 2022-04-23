// eslint-disable-next-line no-unused-vars
class CurrentUserModel {
  username = null;
  role = null;
  id = null;

  constructor(user) {
    const { id, username, role } = user;
    this.username = user.username;
    this.role = role;
    this.id = id;
  }
}

export default CurrentUserModel;
