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
    user = {
        "username": req.body.username,
        "name": req.body.name,
        "password": req.body.password
    }
    result = db.add(user, res)
})
app.post("/login", (req, res) => {
    db.login(req.body.username, req.body.password, res)
});
app.post("/logout", (req, res) => {
    username = req.body.username
    redisClient.del(username, (err, reply) => {
        if (err)
            throw err;
    })
    res.json({ "message": "You have been logged out successfully" })
})
app.use(db.deserialize)
app.post("/delete", (req, res) => {
    db.delete(req, res)
})
app.listen(3000, () => console.log("Server started"));
