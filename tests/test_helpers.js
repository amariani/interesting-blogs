const { Blog } = require("../models/blog");
const { User } = require("../models/user");

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

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const testUser = {
  USERNAME: "testuser",
  PASSWORD: "testpassword",
  NAME: "Mr. Tester",
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  testUser,
};
