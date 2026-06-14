const axios = require('axios');
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

// Registration route
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists!" });
    }
  
    users.push({ "username": username, "password": password });
    return res.status(201).json({ message: "Customer successfully registered. Now you can login" });
});

// BASE DATA PROVIDERS (Internal endpoints that return the data cleanly)
public_users.get('/books', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/books/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    if(books[ISBN]) {
        return res.status(200).send(books[ISBN]);
    }
    return res.status(404).json({message: "ISBN not found"});
});
  
public_users.get('/books/author/:author', function (req, res) {
    let ans = []
    for(const [key, values] of Object.entries(books)){
        if(values.author === req.params.author){
            ans.push(books[key]);
        }
    }
    if(ans.length == 0){
        return res.status(404).json({message: "Author not found"});
    }
    return res.status(200).send(ans);
});

public_users.get('/books/title/:title', function (req, res) {
    let ans = []
    for(const [key, values] of Object.entries(books)){
        if(values.title === req.params.title){
            ans.push(books[key]);
        }
    }
    if(ans.length == 0){
        return res.status(404).json({message: "Title not found"});
    }
    return res.status(200).send(ans);
});

public_users.get('/review/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    if(books[ISBN]) {
        return res.status(200).send(books[ISBN].reviews);
    }
    return res.status(404).json({message: "ISBN not found"});
});

// ==========================================
// Task 10: Get the list of books available in the shop using Async-Await with Axios
// ==========================================
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/customer/books');
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});
  
// ==========================================
// Task 11: Get book details based on ISBN using Async-Await with Axios
// ==========================================
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`http://localhost:5000/customer/books/isbn/${isbn}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book not found", error: error.message });
    }
});
  
// ==========================================
// Task 12: Get book details based on Author using Async-Await with Axios
// ==========================================
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const response = await axios.get(`http://localhost:5000/customer/books/author/${author}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});
  
// ==========================================
// Task 13: Get all books based on Title using Async-Await with Axios
// ==========================================
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const response = await axios.get(`http://localhost:5000/customer/books/title/${title}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});
  
module.exports.general = public_users;
