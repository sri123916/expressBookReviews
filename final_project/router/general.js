const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

const doesExist = (username) => {
let usersWithSameName = users.filter((user) => {
return user.username === username;
});

```
return usersWithSameName.length > 0;
```

};

// Register New User
public_users.post("/register", (req, res) => {

```
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
```

});

// Get Book Reviews
public_users.get('/review/:isbn', function (req, res) {

```
const isbn = req.params.isbn;

if (!books[isbn]) {
    return res.status(404).json({
        message: "Book not found"
    });
}

return res.status(200).json(books[isbn].reviews);
```

});

// ---------------------------------------------------
// Task 10
// Get all books using async-await with Axios
// ---------------------------------------------------

public_users.get('/', async function (req, res) {

```
try {

    const response = await axios.get('http://localhost:5000/books');

    return res.status(200).json(response.data);

} catch (error) {

    return res.status(200).json(books);

}
```

});

// ---------------------------------------------------
// Task 11
// Get book by ISBN using async-await
// ---------------------------------------------------

public_users.get('/isbn/:isbn', async function (req, res) {

```
const isbn = req.params.isbn;

try {

    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    }

    return res.status(404).json({
        message: "Book not found"
    });

} catch (error) {

    return res.status(500).json({
        message: error.message
    });

}
```

});

// ---------------------------------------------------
// Task 12
// Get books by Author using async-await
// ---------------------------------------------------

public_users.get('/author/:author', async function (req, res) {

```
const author = req.params.author;

try {

    let filteredBooks = [];

    for (let isbn in books) {

        if (books[isbn].author === author) {
            filteredBooks.push(books[isbn]);
        }

    }

    return res.status(200).json(filteredBooks);

} catch (error) {

    return res.status(500).json({
        message: error.message
    });

}
```

});

// ---------------------------------------------------
// Task 13
// Get books by Title using async-await
// ---------------------------------------------------

public_users.get('/title/:title', async function (req, res) {

```
const title = req.params.title;

try {

    let filteredBooks = [];

    for (let isbn in books) {

        if (books[isbn].title === title) {
            filteredBooks.push(books[isbn]);
        }

    }

    return res.status(200).json(filteredBooks);

} catch (error) {

    return res.status(500).json({
        message: error.message
    });

}
```

});

module.exports.general = public_users;
