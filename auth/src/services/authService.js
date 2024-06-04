const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");
const config = require("../config");
const User = require("../models/user");

/**
 * Class to hold the business logic for the auth service interacting with the user repository
 */
class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async findUserByUsername(username) {
    // const user = await User.findOne({ username });
    const user = await this.userRepository.getUserByUsername(username);
    return user;
  }

  async login(username, password) {
    const user = await this.userRepository.getUserByUsername(username);

    if (!user) {
      return { success: false, error:{username: "Invalid username", password: "Invalid password"}};
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { success: false, error:{password: "Invalid password"}};
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret);

    return { success: true, token, username:user.username, id: user._id};
  }

  async register(user) {
    const username = await this.userRepository.getUserByUsername(user.username);
   
    if (username) {
      throw ({ error: {username: "Username already taken"}});
      // return { success: false, error:{username: "Invalid username", password: "Invalid password"}};
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const newUser = await this.userRepository.createUser(user);
    return { success: true, username:newUser.username, id: newUser._id};
  }

  async deleteTestUsers() {
    // Delete all users with a username that starts with "test"
    await User.deleteMany({ username: /^test/ });
  }

  async getAllUsers() {
    const users = await this.userRepository.getAllUsers();
    return users;
  }
}

module.exports = AuthService;
