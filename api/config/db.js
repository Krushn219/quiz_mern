const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection;

db.on("error",console.error.bind(console,"Something went wrong to connect DB!!"))

db.once("open",function(){
    console.log("Connected TO DB...")
})