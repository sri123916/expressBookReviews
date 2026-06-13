const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [{"username":"abishek","password":"sri"}];

const isValid = (username) => {
let userMatches = users.filter((user) => {
return user.username === username;
});
return userMatches.length > 0;
};

const authenticatedUser = (username, password) => {
let validUsers = users.filter((user) => {
return user.username === username && user.password === password;
});

```
return validUsers.length > 0;
```

};

// Only registered users can login
regd_users.post("/login", (req, res) => {

```
const username = req.body.username;
const password = req.body.password;

if (!username || !password) {
    return res.status(404).json({
        message: "Error logging in"
    });
}

if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign(
        {
            data: username
        },
        "access",
        {
            expiresIn: 60 * 60
        }
    );

    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).json({
        message: "Customer successfully logged in."
    });
}

return res.status(208).json({
    message: "Invalid Login. Check username and password"
});
```

});

// Add or Modify a Book Review
regd_users.put("/auth/review/:isbn", (req, res) => {

```
const isbn = req.params.isbn;
const review = req.query.review;
const username = req.session.authorization.username;

if (!books[isbn]) {
    return res.status(404).json({
        message: `ISBN ${isbn} not found`
    });
}

books[isbn].reviews[username] = review;

return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
});
```

});

// Delete a Book Review
regd_users.delete("/auth/review/:isbn", (req, res) => {

```
const isbn = req.params.isbn;
const username = req.session.authorization.username;

if (!books[isbn]) {
    return res.status(404).json({
        message: `ISBN ${isbn} not found`
    });
}

delete books[isbn].reviews[username];

return res.status(200).json({
    message: "Review deleted successfully",
    reviews: books[isbn].reviews
});
```

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
