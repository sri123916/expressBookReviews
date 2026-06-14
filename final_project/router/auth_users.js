const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// 1. Declare the users database array once
let users = [{"username":"dennis","password":"abc"}];

// 2. Define verification helper functions
const isValid = (username) => {
    const userMatches = users.filter((user) => user.username === username);
    return userMatches.length > 0;
}

const authenticatedUser = (username, password) => {
    const matchingUsers = users.filter((user) => user.username === username && user.password === password);
    return matchingUsers.length > 0;
}

// 3. User login route
regd_users.post("/login", (req, res) => {
    console.log("login: ", req.body);
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// 4. Add a book review route
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        
        return res.status(200).json({
            message: `Review successfully posted/updated by ${username}`,
            updated_book: book
        });
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});


// 5. Delete a book review route
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if (books[isbn]) {
        let book = books[isbn];
        
        // 1. Delete the specific user's review
        delete book.reviews[username];
        
        // 2. Return success status alongside the updated book entry
        return res.status(200).json({
            message: `Review by user '${username}' for ISBN ${isbn} has been successfully deleted.`,
            updated_book: book
        });
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
  });  

// 6. Export everything cleanly
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
