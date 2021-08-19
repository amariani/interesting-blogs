const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { Blog } = require("../models/blog");
const { User } = require("../models/user");
const { SECRET } = require("../utils/config");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url } = req.body;
  const { token } = req;

  const decodedToken = jwt.decode(token, SECRET);

  if (!token || !decodedToken) {
    return res.status(401).json({
      error: "Invalid or expired token.",
    });
  }

  const user = await User.findById(decodedToken.id);

  const newBlog = new Blog({
    title,
    author,
    url,
    likes: 0,
    user: user._id,
  });

  const createdBlog = await newBlog.save();
  user.blogs = user.blogs.concat(createdBlog);
  await user.save();
  res.status(201).json(createdBlog);
});

blogsRouter.put("/:id", async (req, res) => {
  const { likes } = req.body;
  const { id } = req.params;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true }
  );

  res.json(updatedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const { token } = req;

  const decodedToken = jwt.decode(token, SECRET);

  if (!token || !decodedToken) {
    return res.status(401).json({
      error: "Invalid or expired token.",
    });
  }

  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() !== decodedToken.id) {
    return res.status(401).json({
      error: "You are not allowed to delete someone else's blog.",
    });
  }

  await Blog.findByIdAndRemove(req.params.id);
  const user = await User.findById(decodedToken.id);
  user.blogs = user.blogs.filter((b) => b.id !== req.params.id);
  await user.save();
  res.status(204).end();
});

module.exports = blogsRouter;
