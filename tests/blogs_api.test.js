const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { Blog } = require("../models/blog");
const { User } = require("../models/user");
const { initialBlogs, blogsInDb, testUser } = require("./test_helpers");
const api = supertest(app);

let token;

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogsModels = initialBlogs.map((ibo) => new Blog(ibo));
  const creationPromises = blogsModels.map((bMod) => bMod.save());

  await Promise.all(creationPromises);

  // User Login
  const { body } = await api.post("/api/login").send({
    username: testUser.USERNAME,
    password: testUser.PASSWORD,
  });
  token = body.token;
});

describe("blogs api test", () => {
  test("blogs are returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
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
    test("should create a blog assigned to test user in DB", async () => {
      const blogObject = {
        title: "RoDev",
        author: "Rocío Salgado",
        url: "http://www.rodev.com.ar/",
      };

      await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${token}` })
        .send(blogObject)
        .expect(201)
        .expect("Content-Type", /application\/json/);

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

      const createdBlog = await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${token}` })
        .send(blogObject);

      expect(createdBlog.body.likes).toBe(0);
    });

    test("should fail if no title or url are provided", async () => {
      const blogObject = {
        author: "John Doe",
      };
      await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${token}` })
        .send(blogObject)
        .expect(400);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(initialBlogs.length);
    });

    test("should fail if no token is provided", async () => {
      const blogObject = {
        title: "Without Token",
        author: "John Doe",
        url: "http://www.notoken.com/",
      };
      await api.post("/api/blogs").send(blogObject).expect(401);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(initialBlogs.length);
    });
  });
});

describe("Blog Deletion", () => {
  test("should remove a blog", async () => {
    const blogObject = {
      title: "Blog to Remove",
      author: "Someone",
      url: "http://www.blogtoremove.com/",
    };

    const createdBlog = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token}` })
      .send(blogObject);

    const blogsAtStart = await blogsInDb();

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);

    const blogsAtEnd = await blogsInDb();

    const titles = blogsAtEnd.map((bae) => bae.title);

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
    expect(titles).not.toContain(blogObject.title);
  });

  test("should not remove a blog if different user", async () => {
    const blogObject = {
      title: "Blog to Remove",
      author: "Unauthorized user",
      url: "http://www.blogtoremove.com/",
    };

    const createdBlog = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token}` })
      .send(blogObject);

    const blogsAtStart = await blogsInDb();

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set({ Authorization: `Bearer differentUserToken` })
      .expect(401);

    const blogsAtEnd = await blogsInDb();

    const titles = blogsAtEnd.map((bae) => bae.title);

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    expect(titles).toContain(blogObject.title);
  });
});

describe("Blog Update", () => {
  test("should update the likes of a blog", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api.put(`/api/blogs/${blogToUpdate.id}`).send({ likes: 4 });

    const blogsAtEnd = await blogsInDb();
    const updatedBlog = blogsAtEnd.find((bae) => bae.id === blogToUpdate.id);

    expect(updatedBlog.likes).toBe(4);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
