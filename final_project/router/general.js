const express = require("express");
const books = require("./booksdb.js");
const doesExist = require("./auth_users.js").doesExist;
const users = require("./auth_users.js").users;
const public_users = express.Router();

// Simulated asynchronous function to fetch books
async function fetchBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulate a delay
  });
}

//Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res
    .status(404)
    .json({
      message: "Unable to register user, Details not provided correctly.",
    });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const books = await fetchBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const books = await fetchBooks();
    const book = books[isbn];
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all books based on author
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const books = await fetchBooks();
    const booksByAuthor = Object.values(books).filter(
      (book) => book.author.includes(author)
    );
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ error: "No books by this author found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const books = await fetchBooks();
    const booksByTitle = Object.values(books).filter((book) =>
      book.title.includes(title)
    );
    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.status(404).json({ error: "No books with this title found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
