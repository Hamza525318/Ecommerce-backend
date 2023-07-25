const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config({path:"backend/config/config.env"});

//handling uncaughtException Error
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server");
    process.exit(1);
    
})



//connection call to database
connectDB();


//listen for connections
const server = app.listen(process.env.PORT,()=>{
    console.log(`server running at port ${process.env.PORT}`);
})

//unhandled promise rejections:

process.on("unhandledRejection",(err)=>{
     
    console.log(err.message);
    console.log("shutting down server due to promise rejections");

    server.close(()=>{
        process.exit(1);
    })
})

//process.exit(0): This code (0) indicates a successful or normal termination of the Node.js process. When you call process.exit(0), it means that the program has completed its execution successfully, without encountering any errors or exceptional conditions. It is commonly used to indicate a clean and expected termination.

//process.exit(1): This code (1) indicates an error or abnormal termination of the Node.js process. When you call process.exit(1), it means that the program encountered an error or an exceptional condition that led to an unexpected termination. It is commonly used to indicate that the program exited due to some error or failure.