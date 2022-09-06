const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const connectDB = require('./config/db')

const app = express()

connectDB()

app.get('/api/goals', (req, res) => {
    res.status(200).json({ message: 'Get goals' })
})
app.listen(port, () => console.log(`Server started on port ${port}`))