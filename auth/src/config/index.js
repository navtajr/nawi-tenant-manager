require("dotenv").config();

module.exports = {
  // mongoURI: process.env.MONGODB_AUTH_URI,
  mongoURI: process.env.ME_CONFIG_MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET || "secret",
};
