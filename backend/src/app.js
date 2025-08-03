const express = require('express')
const noteRoutes = require('./routes/note.routes')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(cors({
    origin:'https://fullstack-note-app-seven.vercel.app/',
    credentials:true
}))
app.use("/",noteRoutes)


module.exports = app