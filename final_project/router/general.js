const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

// Task 10 
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  });
}

public_users.get('/', function (req, res) {

  getBookList()
    .then(bookList => {
      res.status(200).json(bookList);
    })
    .catch(error => {
      res.status(500).json({
        message: error
      });
    });

});
// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn){
  return new Promise((resolve,reject)=>{

    if(books[isbn]){
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }

  });
}

public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  getFromISBN(isbn)
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({
        message: error
      });
    });

});

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author){
  return new Promise((resolve,reject)=>{
    let output = [];

    for (let isbn in books) {
      if (books[isbn].author === author) {
        output.push(books[isbn]);
      }
    }

    if(output.length > 0){
      resolve(output);
    } else {
      reject("Author not found");
    }
  });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;

  getFromAuthor(author)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(404).json({
        message: error
      });
    });

});

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.


function getFromTitle(title){
  return new Promise((resolve,reject)=>{
    let output = [];

    for (let isbn in books) {
      if (books[isbn].title === title) {
        output.push(books[isbn]);
      }
    }

    if(output.length > 0){
      resolve(output);
    } else {
      reject("Title not found");
    }
  });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  getFromTitle(title)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(404).json({
        message: error
      });
    });

});


module.exports.general = public_users;
