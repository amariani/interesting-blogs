const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { SECRET } = require("../utils/config");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  const passwordIsCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsCorrect) {
    return res.status(401).json({
      error: "Invalid username or password.",
    });
  }

  const userForToken = {
    username,
    id: user.id,
  };

  const token = await jwt.sign(userForToken, SECRET);

  res.status(200).json({
    token,
    username,
    name: user.name,
  });
});

module.exports = loginRouter;
