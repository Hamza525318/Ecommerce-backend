module.exports = (myFunc) => (req,res,next)=>{
    
 
    Promise.resolve(myFunc(req,res,next)).catch(next);
}

//Overall, this code snippet is a utility function that wraps middleware functions to ensure they handle promises and errors consistently. It allows you to write middleware functions that can either return a Promise or execute synchronous code, while still being able to handle errors gracefully