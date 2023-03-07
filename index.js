const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000
const app = express()
const EmployeeRoute = require('./routes/employee')
const UserRoute = require('./routes/auth')

require('dotenv').config() 

mongoose.connect('mongodb://localhost:27017/testdb')
const db = mongoose.connection

db.on('err', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connected Established')
}) 

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

app.use('/api', UserRoute)
app.use('/api/employee', EmployeeRoute)