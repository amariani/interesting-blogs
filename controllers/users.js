const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const { User, requiredPassLength } = require("../models/user");
const { SALT_ROUNDS } = require("../utils/config");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}, { name: 1, username: 1 }).populate(
    "blogs",
    {
      title: 1,
      url: 1,
      author: 1,
    }
  );
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, password, name } = req.body;

  if (password.length < requiredPassLength) {
    return res.status(401).json({
      error: `Password must contain at least ${requiredPassLength} characters.`,
    });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = new User({
    username,
    passwordHash: hashedPassword,
    name,
  });
  const createdUser = await newUser.save();

  res.status(201).json(createdUser);
});

module.exports = usersRouter;
