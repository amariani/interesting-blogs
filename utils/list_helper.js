const _ = require("lodash");

const dummy = (blogs) => {
  return blogs.length;
};

const totalLikes = (blogs) => {
  const likesReducer = (sum, item) => {
    return sum + item.likes;
  };
  return blogs.reduce(likesReducer, 0);
};

const blogExtractor = ({ title, author, likes }) => {
  return {
    title: title || "not provided",
    author: author || "not provided",
    likes: likes || 0,
  };
};

const favoriteBlog = (blogs) => {
  const maxLikesReducer = (prev, current) => {
    return prev.likes > current.likes ? prev : current;
  };
  return blogExtractor(blogs.reduce(maxLikesReducer));
};

const mostBlogs = (blogs) => {
  if (!blogs.length) return {};
  const authorsCount = _.map(_.countBy(blogs, "author"), (val, key) => ({
    author: key,
    blogs: val,
  }));

  return authorsCount.reduce((prev, curr) => {
    return prev.blogs > curr.blogs ? prev : curr;
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  blogExtractor,
  mostBlogs,
};
