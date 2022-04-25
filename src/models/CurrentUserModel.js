class CurrentUserModel {
  username = null;
  role = null;
  id = null;

  constructor(user) {
    const { id, username, role } = user;
    this.username = username;
    this.role = role;
    this.id = id;
  }
}

export default CurrentUserModel;
