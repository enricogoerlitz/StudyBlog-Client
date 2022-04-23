// eslint-disable-next-line no-unused-vars
class ApplicationUserModel {
  id = 0;
  username = "";
  role = "norole";

  constructor(user) {
    const { id, username, role } = user;
    this.id = id;
    this.username = username;
    this.role = role;
  }
}
