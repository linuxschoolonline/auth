require('dotenv').config()
const mongoClient = require('mongodb').MongoClient;
const uri = "mongodb://" + process.env.MONGODB_HOST + ":" + process.env.MONGODB_PORT;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const redis = require('redis');
const redisClient = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
redisClient.on('error', err => {
    console.log('Error ' + err);
    process.exit(1)
});
const jwt = require("jsonwebtoken");
const exp = Math.floor(Date.now() / 1000) + parseInt(process.env.ACCESS_TOKEN_LIFE)
exports.add = (user, res) => {
    //Check that the request contains valid data
    if (!user.username || !user.password || !user.name){
        res.status(406).json({"message": "Empty or invalid user data"})
        return
    }
    getUser(user.username, (err, result) => {
        if (err) {
            throw err
        }
        if (result) {
            res.status(406).json({ "message": "The user already exists" })
            return
        }
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                throw err
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    throw err
                }
                user.password = hash
                mongoClient.connect(uri, (err, client) => {
                    const db = client.db("UserDB");
                    db.collection('Users').insertOne(user, (err, result) => {
                        if (err) {
                            throw err;
                        }
                        res.status(201).json({ "message": "User created successfully" })
                    });
                })
            });
        });
    });
};
function getUser(username, callback) {
    mongoClient.connect(uri, (err, client) => {
        if (err) {
            throw err
        } else {
            const db = client.db("UserDB");
            db.collection('Users').findOne({ "username": username }, callback)
        }
    })
}
exports.deserialize = function deserialize(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) throw  err
            req.data = data
            next()
        })
    } catch (e) {
        res.status(400).json({"message":"invalid token"})
    }
}

exports.login = (username, password, response) => {
    getUser(username, (err, result) => {
        if (err) {
            throw err
        } else {
            if (result) {
                bcrypt.compare(password, result.password, (err, res) => {
                    if (err) {
                        throw err
                    } else {
                        if (res) {
                            jwt.sign({
                                exp: exp,
                                user: {
                                    username: username
                                }
                            }, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
                                redisClient.set(username, token, (err, reply) => {
                                    if (err)
                                        throw err;
                                });
                                redisClient.expireat(username, exp);
                                response.json({ token })
                            });
                        } else {
                            response.status(403).json({ "error": "Invalid username or password" })
                        }
                    }
                })
            } else {
                response.status(403).json({ "error": "Invalid username or password" })
            }
        }
    })
}
exports.delete = (username,response) => {
    getUser(username, (err, result) => {
        if (result) {
            mongoClient.connect(uri, (err, client) => {
                if (err) {
                    throw err
                } else {
                    const db = client.db("UserDB");
                    db.collection('Users').deleteOne({ "username": username }, (err, result) => {
                        if (err) {
                            throw err
                        } else {
                            response.json({ "message": "User deleted successfully" })
                        }
                    })
                }
            })
        } else {
            response.status(401).json({ "message": "User does not exist" })
        }
    })
}