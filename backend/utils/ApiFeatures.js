class ApiFeatures{

    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    search(){

        const keyword = this.queryString.keyword?
        {
           name:{
                $regex : this.queryString.keyword,
                $options : "i",
            }
        }
        :{}
         
       
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
         
        // we are using this filter method to fetch products based on category,price and rating

        const queryCopy = {...this.queryString};
       

        const filterWords = ["keyword","limit","page"];
        //the below  for loop is used to remove the keys like keyword,limit etc from the query params 
        filterWords.forEach((key)=>{
            delete queryCopy[key];
        })
        
        //convert JSON object into string notation
        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);

        //converts json string into an object
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage){

        let currentpage = Number(this.queryString.page) || 1;
        const skip =  resultPerPage * (currentpage -1);

        this.query = this.query.find().limit(resultPerPage).skip(skip);
        return this;
    }
}

//query in the url means anything after ? 
//example https://www.ecommerce.com/products?keyword=shirt

module.exports = ApiFeatures;