const { Blog } = require("../models/blog");

const initialBlogs = [
  {
    title: "Interacción Digital",
    author: "Ariel Mariani",
    url: "http://www.interacciondigital.net/",
  },
  {
    title: "Diginomad",
    author: "Ariel Mariani",
    url: "http://www.digitalnomad.com/",
  },
  {
    title: "Art By Ro",
    author: "Rocío Salgado",
    url: "http://www.artbyro.com/",
  },
  {
    title: "La cocina española",
    author: "Juan Perez",
    url: "http://www.lacuchinacatalanaa.cat/",
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
