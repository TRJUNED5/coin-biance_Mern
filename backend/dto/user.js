class UserDTO {
  constructor(user) {
    //user type object and i and it gonna show the data in json that i want to see in login and so on
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
  }
}

module.exports = UserDTO;
