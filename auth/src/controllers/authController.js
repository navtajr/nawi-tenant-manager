const AuthService = require("../services/authService");
const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Class to encapsulate the logic for the auth routes
 */

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    const { username, password } = req.body;

    const result = await this.authService.login(username, password);

    if (result.success) {
      res.json({ token: result.token, username:result.username, id: result.id});
    } else {
      res.status(500).json({ error: result.error });
    }
  }

  async register(req, res) {
    const user = req.body;
  
    try {
      // const existingUser = await this.authService.findUserByUsername(user.username);
  
      // if (existingUser) {
      //   console.log("Username already taken")
      //   throw new Error("Username already taken");
      // }
      
      const result = await this.authService.register(user);
      res.json({success: result.success , message: `${result.username} has created`, id: result.id});
    } catch (err) {
      // res.status(500).json({ message: err.message });
      res.status(500).json(err);
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id;

    try {
      const user = await this.authService.getUserById(userId);
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getUsers(req, res) {

    try {
      console.log("authService", this.authService);
      const users = await this.authService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async verify(req, res) {
    console.log("CORS", req.headers)
    if (req.headers['sec-fetch-mode'] === 'cors') {
      res.status(200).json({ message: req.headers });
    } else {
      const token = req.headers['authorization'];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
    
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        res.set('X-Auth-User', decoded.id);
        res.status(200).json({ message: 'Token is valid' });
      } catch (e) {
        res.status(400).json({ message: "Token is not valid" });
      }
    }
    
  }
}

module.exports = AuthController;
