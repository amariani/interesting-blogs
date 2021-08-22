const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { User } = require("../models/user");
const { usersInDb, testUser } = require("./test_helpers");
const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});
});

describe("Users API test", () => {
  test("users are returned as JSON", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should create user", async () => {
    const usersAtStart = await usersInDb();

    await api
      .post("/api/users")
      .send({
        username: testUser.USERNAME,
        password: testUser.PASSWORD,
        name: testUser.NAME,
      })
      .expect(201);

    const usersAtEnd = await usersInDb();

    expect(usersAtStart).toHaveLength(0);
    expect(usersAtEnd).toHaveLength(1);
  });

  test("a user should have an ID property", async () => {
    const users = await api.get("/api/users");
    expect(users.body).toHaveLength(1);

    users.body.forEach((userContent) => {
      expect(userContent.id).toBeDefined();
    });
  });

  test("should fail if username is not provided", async () => {
    const usersAtStart = await usersInDb();

    await api
      .post("/api/users")
      .send({
        password: testUser.PASSWORD,
        name: testUser.NAME,
      })
      .expect(400);

    const usersAtEnd = await usersInDb();

    expect(usersAtStart.length).toEqual(usersAtEnd.length);
  });

  test("should fail if username/password length are not valid", async () => {
    const usersAtStart = await usersInDb();

    await api
      .post("/api/users")
      .send({
        username: "a",
        password: "b",
        name: testUser.NAME,
      })
      .expect(401);

    const usersAtEnd = await usersInDb();

    expect(usersAtStart.length).toEqual(usersAtEnd.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
