const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let isAlreadyExist =
    users.find((user) => user.username === username) !== undefined;
  return !isAlreadyExist;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//Task 7✅: only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

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

//Task 8✅ : Add a book review or modify your old review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  let bookISBN = await req.params.isbn;
  if (books[bookISBN]) {
    books[bookISBN].reviews = {
      ...books[bookISBN].reviews,
      username: req.session.authorization.username,
      review: req.query.review,
    };
    res.status(201).send("Review Added!");
  } else {
    res.send("No book was found with the ISBN you entered: " + bookISBN);
  }
});

//Task 9✅ : Delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  let bookISBN = await req.params.isbn;
  let thisUser = await req.session.authorization.username;
  let reviewsLength = Object.keys(books[bookISBN].reviews).length;
  for (let i = 1; i < reviewsLength; i++) {
    if (books[bookISBN].reviews[i]?.username === thisUser) {
      delete books[bookISBN].reviews[i];
    } else {
      continue;
    }
  }
  // res.status(204).send(`${thisUser}'s Review Removed`);
  res.json(`${thisUser}'s Review Removed`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
