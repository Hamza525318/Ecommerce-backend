const express = require("express");
const app = express();
const product = require("./routes/productRoute");
const errorMiddleware = require("./middleware/error");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoutes");
const cookieParser = require("cookie-parser");

//middleware is a function that sit's in between the client's request and your application's main logic
//In summary, express.json() helps you handle JSON data by parsing it and converting it into a JavaScript object, allowing you to process and use the data in your Express.js application.

//In summary, the app.use() function in Express.js is used to register middleware at the application level, //allowing you to execute additional logic for every incoming request
//In simple terms, a middleware function in Express is a function that sits between the server and the route handler. It is used to perform operations on the request and response objects and can modify them or perform additional tasks.

app.use(express.json());
app.use(cookieParser());


//the app.use() function registers the middleware to the express application and is called 
app.use("/api/v1",product);
app.use("/api/v1",user);

//middleware for handling user routes;


//middleware for handling order routes;
app.use("/api/v1",order);


app.use(errorMiddleware);

//middleware for errorHandler





module.exports = app;