const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(process.env.MONGOOSE_URL)
    .then(()=>{
        console.log("connected to DB");
        
    })
    .catch((err) => {
      console.error("error connecting to db :", err);
    });
};


module.exports = connectToDb