require('dotenv').config()
const redis = require('redis');
const db = require("./db.js")
const express = require("express");
const app = express();
app.use(express.json());
const redisClient = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
redisClient.on('error', err => {
    console.log('Error ' + err);
    process.exit(1)
});
app.post("/signup", (req, res) => {
    let user = {
        "username": req.body.username,
        "name": req.body.name,
        "password": req.body.password
    }
    db.add(user, res)
})
app.post("/login", (req, res) => {
    db.login(req.body.username, req.body.password, res)
});
app.post("/logout", (req, res) => {
    let username = req.body.username
    redisClient.del(username, (err, reply) => {
        if (err)
            throw err;
    })
    res.json({ "message": "You have been logged out successfully" })
})
// This route is protected from unauthorized access
// app.use(db.deserialize)
app.delete("/delete", db.deserialize, (req, res) => {
    // The username is brought from the token and not from the request body
    let username = req.data.user.username
    db.delete(username, res)
//    Log the user out
    redisClient.del(username, (err, reply) => {
        if (err)
            throw err;
    })
})
app.all('*', (req, res, next) => {
   res.status(405).send('Method not allowed');
});
module.exports = app.listen(3000, () => console.log("Server started"));
