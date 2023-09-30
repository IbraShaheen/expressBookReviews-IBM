const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

//Task 6✅: Registering a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

//Task 1✅: Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let bookList = await books;
  res.json(bookList);
});

//Task 2✅: Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  let thisBook = await books[req.params.isbn];
  if (thisBook) {
    res.json(thisBook);
  } else {
    res.status(404).json({ message: "The book does not exist!" });
  }
});

//Task 3✅: Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = await req.params;
  let booksLength = Object.keys(books).length;
  var book;
  for (let i = 1; i < booksLength; i++) {
    if (books[i].author === author) {
      book = books[i];
    } else {
      continue;
    }
  }
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "The book does not exist!" });
  }
});

//Task 4✅: Get book details based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = await req.params;
  let booksLength = Object.keys(books).length;
  var book;
  for (let i = 1; i < booksLength; i++) {
    if (books[i].title === title) {
      book = books[i];
    } else {
      continue;
    }
  }
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "The book does not exist!" });
  }
});

//Task 5✅: Get book reviews by isbn
public_users.get("/review/:isbn", async function (req, res) {
  let thisBook = await books[req.params.isbn];
  if (thisBook) {
    if (JSON.stringify(thisBook.reviews) === JSON.stringify({})) {
      res
        .status(404)
        .json({ message: "There are no reviews for this book yet!" });
    }
    res.json(thisBook.reviews);
  } else {
    res.status(404).json({ message: "The book does not exist!" });
  }
});

module.exports.general = public_users;
