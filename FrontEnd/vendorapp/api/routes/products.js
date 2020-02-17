
const express = require('express');
const router = express.Router();

const mysql = require("mysql");




router.get('/', function (req, res) {
    res.locals.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'userid'
    });
    res.locals.connection.query("insert into useridlist values()", function (error, results, fields) {
        if (error) {
            res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
            //If there is no error, all is good and response is 200OK.
        }
    });


});

router.post('/',function(req,res,body)
{
  console.log('body:'+ JSON.stringify(req.body))
});


//get is used to handle the incomming url requests

module.exports=router;//the router with routes is exported and can be used in other files
