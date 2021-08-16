const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true,
  },
  author: String,
  url: {
    type: String,
    minlength: 6,
    required: true,
  },
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

// MongoDB Response Transformer
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = { Blog };
