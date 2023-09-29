const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//Helper function for register
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

//Helper function for login
const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.username;
  const review = req.body.review;
  const isbn = req.params.isbn;
  const bookToReview = books[isbn].reviews;

  if (!bookToReview.hasOwnProperty(username)) {
    bookToReview[username] = review;
    return res.json({ message: "Review added." });
  } else {
    bookToReview[username] = review;
    return res.json({ message: "Review modified." });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;
  const bookReviewToDelete = books[isbn].reviews;

  if (bookReviewToDelete.hasOwnProperty(username)) {
    delete bookReviewToDelete[username];
    return res.json({ message: "Review deleted." });
  } else {
    return res.json({ message: "You haven't reviewed this book yet." });
  }
});

module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
