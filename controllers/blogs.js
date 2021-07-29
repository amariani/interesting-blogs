const blogsRouter = require("express").Router();
const { Blog } = require("../models/blog");

blogsRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

blogsRouter.post("/", (req, res) => {
  const { title, author, url, likes } = req.body;
  const newBlog = new Blog({
    title,
    author,
    url,
    likes: 0,
  });

  newBlog.save().then((createdBlog) => {
    res.status(201).json(createdBlog);
  });
});

module.exports = blogsRouter;
