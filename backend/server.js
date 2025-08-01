require('dotenv').config()
const app = require("./src/app")
const connectToDb = require("./src/db/db")

connectToDb()

app.get("/",(req,res)=>{
    res.send("route / ")
})
app.listen(3000,
    console.log("server running on port 3000")
)