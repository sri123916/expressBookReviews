const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

// 1. Import the routers correctly
const customer_routes = require('./router/auth_users.js').authenticated;
const general_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// 2. Setup your session middleware
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// 3. Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

// 4. MOUNT THE ROUTERS TO THE CORRECT PATHS
// This line links the registration/general routes to "/customer"
app.use("/customer", general_routes); 
app.use("/customer", customer_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));