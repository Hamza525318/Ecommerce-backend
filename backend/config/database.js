const mongoose = require("mongoose");

const connectDatabase = ()=>{

 mongoose.connect(process.env.DATABASE_URI)
.then((data)=>{
   console.log(`host name is ${data.connection.host}`)
})


}

module.exports = connectDatabase;