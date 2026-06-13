const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

const doesExist = (username) => {
  return users.some(user => user.username === username);
};

// Register a new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Unable to register user."
    });
  }

  if (doesExist(username)) {
    return res.status(404).json({
      message: "User already exists!"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registred. Now you can login"
  });
});

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn].reviews);

});

// --------------------------------------------------
// Task 10 - Get all books using Promises
// --------------------------------------------------

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

public_users.get('/', function (req, res) {

  getBookList()
    .then((bookList) => {
      return res.status(200).json(bookList);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err
      });
    });

});

// --------------------------------------------------
// Task 11 - Get books by ISBN using Promises
// --------------------------------------------------

function getBookByISBN(isbn) {

  return new Promise((resolve, reject) => {

    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }

  });
}

public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  getBookByISBN(isbn)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(404).json({
        message: err
      });
    });

});

// --------------------------------------------------
// Task 12 - Get books by Author using Promises
// --------------------------------------------------

function getBooksByAuthor(author) {

  return new Promise((resolve, reject) => {

    const result = [];

    for (let isbn in books) {
      if (books[isbn].author === author) {
        result.push(books[isbn]);
      }
    }

    resolve(result);

  });
}

public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;

  getBooksByAuthor(author)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err
      });
    });

});

// --------------------------------------------------
// Task 13 - Get books by Title using Promises
// --------------------------------------------------

function getBooksByTitle(title) {

  return new Promise((resolve, reject) => {

    const result = [];

    for (let isbn in books) {
      if (books[isbn].title === title) {
        result.push(books[isbn]);
      }
    }

    resolve(result);

  });
}

public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  getBooksByTitle(title)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err
      });
    });

});

module.exports.general = public_users;
