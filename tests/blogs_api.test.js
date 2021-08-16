const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { Blog } = require("../models/blog");
const { initialBlogs, blogsInDb } = require("./test_helpers");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogsModels = initialBlogs.map((ibo) => new Blog(ibo));
  const creationPromises = blogsModels.map((bMod) => bMod.save());

  await Promise.all(creationPromises);
});

describe("blogs api test", () => {
  test("blogs are returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
  });

  test("should have initial blogs", async () => {
    const blogs = await api.get("/api/blogs");
    expect(blogs.body).toHaveLength(4);
  });

  test("a blog should have an ID property", async () => {
    const blogs = await api.get("/api/blogs");

    blogs.body.forEach((blogContent) => {
      expect(blogContent.id).toBeDefined();
    });
  });

  describe("Blog Creation", () => {
    test("should create a blog in DB", async () => {
      const blogObject = {
        title: "RoDev",
        author: "Rocío Salgado",
        url: "http://www.rodev.com.ar/",
      };

      await api
        .post("/api/blogs")
        .send(blogObject)
        .expect(201)
        .expect("Content-Type", "application/json; charset=utf-8");

      const blogsAtEnd = await blogsInDb();

      const blogsTitles = blogsAtEnd.map((blog) => blog.title);

      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
      expect(blogsTitles).toContain("RoDev");
    });

    test("should return likes value as zero", async () => {
      const blogObject = {
        title: "Without Like",
        author: "John Doe",
        url: "http://www.nolikes.com/",
      };

      const createdBlog = await api.post("/api/blogs").send(blogObject);

      expect(createdBlog.body.likes).toBe(0);
    });

    test("should fail if no title or url are provided", async () => {
      const blogObject = {
        author: "John Doe",
      };
      await api.post("/api/blogs").send(blogObject).expect(400);
      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(initialBlogs.length)
    });
  });
});

describe("Blog Deletion", () => {
  test("should remove a blog", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToRemove = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToRemove.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb();

    const titles = blogsAtEnd.map(bae => bae.title)

    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);
    expect(titles).not.toContain(blogToRemove.title)
  });
});

describe("Blog Update", () => {
  test("should update the likes of a blog", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 4 })

    const blogsAtEnd = await blogsInDb();
    const updatedBlog = blogsAtEnd.find(bae => bae.id === blogToUpdate.id)

    expect(updatedBlog.likes).toBe(4);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
