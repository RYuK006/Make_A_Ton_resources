const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Token = require('../models/Token')

router.post('/signup', (req,res) =>{
    const username = req.body.username
    if(!username) return res.status(400).json({ error: 'Username is required' });

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if(err) return res.status(500).json({ error: err });

        const user = new User({ username, password: hashedPassword })
        user.save().then(async (result) => {
            const accessToken = generateAccessToken({ userId: result._id, username: result.username })
            const refreshToken = await generateRefreshToken({ userId: result._id, username: result.username })
            res.status(201).json({ accessToken, refreshToken })
        })
        .catch(err => {
            if(err.code==11000) return res.status(400).json({ error: "Username already exists" });
            if(err.message) return res.status(400).json({ message: err.message });
            res.status(400).json(err)
        })
    })
})

router.post('/login', (req,res) => {
    User.findOne().where('username').equals(req.body.username)
    .then(user => {
        if(!user) return res.status(400).json({ error: 'Could not find user' })
        bcrypt.compare(req.body.password, user.password, async (err, result) => {
            if(err) return res.status(500).json(err);
            if(!result) return res.status(401).json({ error: 'Incorrect password' });

            const accessToken = generateAccessToken({ userId: user._id, username: user.username })
            const refreshToken = await generateRefreshToken({ userId: user._id, username: user.username })
            res.status(201).json({ accessToken, refreshToken })           
        })
    })
})

router.post('/logout', (req,res) => {
    if(!req.body.token) return res.status(400).json({ error: "Token not found" });

    Token.deleteOne().where('token').equals(req.body.token)
    .then(result => {
        if(!result.deletedCount) return res.status(403).json({ error: "Invalid token" });
        res.status(201).json({ message: 'Logged out succesfully' })
    })
})

router.post('/refresh', (req,res) => {
    if(!req.body.token) return res.status(400).json({ error: "Token not found" });

    jwt.verify(req.body.token, process.env.REFRESHKEY, (err, result) => {
        if(err) return res.status(403).json({ error: err.message });

        Token.deleteOne().where('token').equals(req.body.token)
        .then(async result => {
            if(!result.deletedCount) return res.status(403).json({ error: "Unauthorized access" });
            
            const accessToken = generateAccessToken({ userId: result._id, username: result.username })
            const refreshToken = await generateRefreshToken({ userId: result._id, username: result.username })
            res.status(201).json({ accessToken, refreshToken })
        })
    })
})

function generateAccessToken(data) {
    return jwt.sign(data, process.env.ACCESSKEY, { expiresIn: '1d' } )
}

async function generateRefreshToken(data) {
    const token = jwt.sign(data, process.env.REFRESHKEY, { expiresIn: '1d' } )
    const newToken = new Token({ token });

    return await newToken.save()
    .then(() => token)
}

module.exports = router