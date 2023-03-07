const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register =  async (req, res, next) => {
    try {
        await bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
            if(err) res.json({ error: err })
            let user = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPass
            }
            await User.create(user)
            res.json({ message: "User added successfully" })
        })
    } catch (err) {
        console.log(err)
    }  
}

const login = async (req, res, next) => {
    let username = req.body.username
    let password = req.body.password
   try { 
    let user = await User.findOne({$or: [{email: username}, {phone: username}]})
    if(user) {
        await bcrypt.compare(password, user.password, async (err, result) => {
            if(err) res.json({ error: err})
            if(result){
                let token = await jwt.sign({name: user.name}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
                let refreshToken = await jwt.sign({name: user.name}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })
                res.json({
                    message: 'Login successful',
                    token,
                    refreshToken
                })
            } else {
                res.json({ message: "Password does not match"})
            }
        })
    } else {
        res.json({ message:"User not found"})
    }
   } catch (err) {
    res.json({error: err})
   }
}

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken
        await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if(err) res.json({error: err})
            else {
                let token = jwt.sign({ name: decode.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
                let refreshToken = req.body.refreshToken
                res.status(200).json({
                    message: "Token refreshed successfully",
                    token, 
                    refreshToken
                })
            }
        })
    } catch (err) {
        res.json({ error: err })
    }
}

module.exports = {
    register,
    login,
    refreshToken
}