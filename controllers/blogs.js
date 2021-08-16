const blogsRouter = require("express").Router();
const { Blog } = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url } = req.body;
  const newBlog = new Blog({
    title,
    author,
    url,
    likes: 0,
  });
  const createdBlog = await newBlog.save();

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
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;
