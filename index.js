const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGODB_URI, PORT } = require("./utils/config");
const { Blog } = require("./models/blog");
const app = express();

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB`);
  });

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
    console.log(`Got response:`, blogs);
  });
});

app.post("/api/blogs", (req, res) => {
  const { title, author, url } = req.body;
  const newBlog = new Blog({
    title,
    author,
    url,
  });

  newBlog.save().then((createdBlog) => {
    console.log(`Blog created successfully`, createdBlog);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
