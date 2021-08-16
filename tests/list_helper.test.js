const listHelper = require("../utils/list_helper");

test("dummy returns 1", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(blogs.length);
});

describe("Total Likes", () => {
  test("of empty list is zero", () => {
    const blogs = [
      {
        title: "Interacción Digital",
        author: "Ariel Mariani",
        url: "http://www.interacciondigital.net/",
        likes: 0,
        id: "6102cd95c76a8a2190884855",
      },
      {
        title: "Learning Dev Topics",
        author: "Rocío Salgado",
        url: "http://www.learningwithropi.net/",
        likes: 0,
        id: "610c0be6bbcc7a137a58bbbf",
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const blogs = [
      {
        title: "Interacción Digital",
        author: "Ariel Mariani",
        url: "http://www.interacciondigital.net/",
        likes: 4,
        id: "6102cd95c76a8a2190884855",
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(4);
  });

  test("of a bigger list is calculated right", () => {
    const blogs = [
      {
        title: "Interacción Digital",
        author: "Ariel Mariani",
        url: "http://www.interacciondigital.net/",
        likes: 4,
        id: "6102cd95c76a8a2190884855",
      },
      {
        title: "Learning Dev Topics",
        author: "Rocío Salgado",
        url: "http://www.learningwithropi.net/",
        likes: 5,
        id: "610c0be6bbcc7a137a58bbbf",
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(9);
  });
});

describe("Favorite Blog", () => {
  test("of empty list is zero", () => {
    const blogs = [
      {
        title: "Interacción Digital",
        author: "Ariel Mariani",
        url: "http://www.interacciondigital.net/",
        likes: 10,
        id: "6102cd95c76a8a2190884855",
      },
      {
        title: "Learning Dev Topics",
        author: "Rocío Salgado",
        url: "http://www.learningwithropi.net/",
        likes: 9,
        id: "610c0be6bbcc7a137a58bbbf",
      },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: "Interacción Digital",
      author: "Ariel Mariani",
      likes: 10,
    });
  });
});

describe("Blog Info Extractor", () => {
  test("of empty object", () => {
    const blog = {};

    const result = listHelper.blogExtractor(blog);
    expect(result).toEqual({
      author: "not provided",
      title: "not provided",
      likes: 0,
    });
  });

  test("returns 'not provided' if a property is not present", () => {
    const blog = {
      author: "Ariel Mariani",
      url: "http://www.interacciondigital.net/",
      likes: 10,
      id: "6102cd95c76a8a2190884855",
    };

    const result = listHelper.blogExtractor(blog);
    expect(result).toEqual({
      title: "not provided",
      author: "Ariel Mariani",
      likes: 10,
    });
  });
});

describe("Most Blogs", () => {
  test("returns author with most blogs", () => {
    const blogs = [
      {
        title: "Interacción Digital",
        author: "Ariel Mariani",
        url: "http://www.interacciondigital.net/",
        likes: 10,
        id: "6102cd95c76a8a2190884855",
      },
      {
        title: "Teaching Tech",
        author: "Ariel Mariani",
        url: "http://www.teachtech.net/",
        likes: 3,
        id: "2cd9521988848c7a5506a610",
      },
      {
        title: "TEST",
        author: "Frikiman",
        url: "http://wwqqwqwdigital.net/",
        likes: 0,
        id: "6102cdcsscs884855",
      },
      {
        title: "Learning Dev Topics",
        author: "Rocío Salgado",
        url: "http://www.learningwithropi.net/",
        likes: 9,
        id: "610c0be6bbcc7a137a58bbbf",
      },
    ];

    const result = listHelper.mostBlogs(blogs);

    expect(result).toEqual({
      author: "Ariel Mariani",
      blogs: 2,
    });
  });

  test("returns empty object if no blogs", () => {
    const result = listHelper.mostBlogs([]);

    expect(result).toEqual({});
  });
});
