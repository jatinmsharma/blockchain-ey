//it will be used for handling the requests

const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

//const morgan = require('morgan');//morgon will call next in the
const app = express();


// mongoose.connect('mongodb + srv://umakumari:'
// + process.env.MONGO_ATLS_PW +
// '@node-rest-shop-w1anj.mongodb.net/test?retryWrites=true',{
//        useNewUrlParser:true
//     });

const productRoutes = require('./routes/products');
// app.use(morgan('dev'));//it is going to mention all the things whwnever we fetch any request
//at the postman
app.use(bodyParser.urlencoded({extended:false}))//here in bodyparser we are all
//allowing the url encoded patterns and also its size shouls be samll
//that is the reason why we set the extended to the false
app.use(bodyParser.json())//it is used to allow the json formats
app.use('/products',productRoutes);




app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status=404;
    next(error);
});//it is used to provide the proper error msg format

app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            message:error.message
        }
    })
})
//headers are added to provide the accesibility and also authentication in the api and in order to remove the CORS errors
 app.use((req,res,next)=>{
     res.header("Access-Control-Allow-Origin","*");
     res.header(
         "Access-Control-Allow-Headers",
         "Origin , X-Requested-With,Content-Type, Accept,Authorization"

     );
     if(req.method==='OPTIONS'){
        res.header('Access-Control-Aloow-Methods','PUT,POST,PATCH,DELETE,GET');
         return res.status(200).json({});
    }
     next();
 })

 //nrew code is added here
const mysql = require("mysql");
//Database connection
app.use(function (req, res, next) {
    res.locals.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'userid'
    });
    res.locals.connect();
    next();
});

// app.use('/api/routes/products', products);


module.exports = app;
