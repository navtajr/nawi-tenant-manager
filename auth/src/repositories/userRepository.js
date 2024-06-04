const User = require("../models/user");

/**
 * Class to encapsulate the logic for the user repository
 */
class UserRepository {
  async createUser(user) {
    return await User.create(user);
  }

  async getUserByUsername(username) {
    return await User.findOne({ username });
  }

  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  }
}

module.exports = UserRepository;
