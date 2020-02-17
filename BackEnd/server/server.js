var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer')
var nano = require('nano')('http://admin:admin@0.0.0.0:5984')

// var upload = multer();
const csv = require('csv-parser');
const fs = require('fs');
const {
    createContext,
    Signer
} = require('sawtooth-sdk/signing')
const secp256k1 = require('sawtooth-sdk/signing/secp256k1')

const {
    makeKeyPair,
    getPublicKey,
    getState,
    submitUpdate,
    getStateByEntityName,
    getBatchStatuses,
    getIDDetails
} = require('./src/state')


app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/**************************************** Operations **********************************************/
readFile = async(fileName, bodyData, res) => {
    console.log('hit');
    const results = [];
    const allResponseData = [];
    await fs.createReadStream('uploads/' + fileName)
        .pipe(csv({ separator: ';' }))
        .on('data', async(data) => {
            results.push(data)
            var payload = {};
            try {

                if (bodyData.action == 'registerCustomerOrg') {
                    data["address"] = "";
                    var address = {}
                    address['addressline1'] = data['addressline1'];
                    address['addressline2'] = data['addressline2'];
                    address['addressline3'] = data['addressline3'];
                    address['city'] = data['city'];
                    address['state'] = data['state'];
                    address['pincode'] = data['pincode'];
                    delete data['addressline1'];
                    delete data['addressline2'];
                    delete data['addressline3'];
                    delete data['city'];
                    delete data['state'];
                    delete data['pincode'];
                    data["address"] = JSON.stringify(address);
                    // data['email'] = data['email'];
                    // data['contactNumber'] = data['contactNumber'];   
                    // data['GSTNumber'] = data['GSTNumber'];
                    //  data['publicKey'] = data['publicKey'];  
                    data['vendor'] = {}
                    data['vendor']['name'] = data['vendorname'];
                    delete data['vendorname'];
                }
                if (bodyData.action == "createOrder") {
                    data['vendor'] = {}
                    data['vendor']['name'] = data['vendor__name'];
                    delete data['vendor__name'];
                    data['customer'] = {}
                    data['customer']['name'] = data['customer__employeeName'];
                    data['customer']['addressBilling'] = data['customer__addressShipping'];
                    data['customer']['Shipping'] = data['customer__addressBilling'];
                    data['customer']['GSTNumber'] = data['customer__GSTNumber'];
                    delete data['customer__employeeName'];
                    delete data['customer__addressShipping'];
                    delete data['customer__addressBilling'];
                    delete data['customer__GSTNumber'];
                }
                 if (bodyData.action == "createGoods") {
                    data['vendor'] = {}
                    data['vendor']['name'] = data['vendorname'];
                    data['vendor']['employeename'] = data['vendorempname'];
                    delete data['vendorapp'];
                    delete data['vendorname'];
                    data['goods'] = {}
                    data['goods']['type'] = data['type'];
                    data['goods']['name'] = data['goodsname'];
                    data['goods']['unit'] = data['unit'];
                    data['customer']['GSTNumber'] = data['GSTNumber'];
                    delete['data']['employeeName'];
                    delete['data']['addressShipping'];
                    delete['data']['addressBilling'];
                    delete['data']['GSTNumber'];
                }

                payload = {
                    action: bodyData.action,
                    payloaddata: data
                }
            } catch (error) {
                payload = {}
                allResponseData.push({
                    "request": data,
                    "response": {
                        "TransactionID": responseData.id,
                        "invalid_transactions": [error.message],
                        "status": 'INVALID'
                    }
                })

                if (allResponseData.length == results.length) {
                    console.log("done")
                    res.send({ 'files': fileName, 'action': bodyData.action, 'response': allResponseData })
                }
            }
            console.log("payload", payload);
            if (payload.hasOwnProperty('payloaddata')) {
                await submitUpdate(payload,
                    bodyData.private, {
                        send(responseData) {
                            console.log(
                                "response:server.js:565", {
                                    "request": data,
                                    "response": {
                                        "TransactionID": responseData.id,
                                        "UserID": responseData.userid,
                                        "status": JSON.parse(responseData['response']['body']).data[0].status
                                    }
                                }
                            );
                            if (JSON.parse(responseData['response']['body']).data[0].status == 'COMMITTED') {
                                allResponseData.push({
                                    "request": data,
                                    "response": {
                                        "TransactionID": responseData.id,
                                        "UserID": responseData.userid,
                                        "invalid_transactions": JSON.parse(responseData['response']['body']).data[0],

                                        "status": JSON.parse(responseData['response']['body']).data[0].status
                                    }
                                })
                            } else {
                                allResponseData.push({
                                    "request": data,
                                    "response": {
                                        "TransactionID": responseData.id,
                                        "invalid_transactions": JSON.parse(responseData['response']['body']).data[0].invalid_transactions,
                                        "status": JSON.parse(responseData['response']['body']).data[0].status
                                    }
                                })
                            }

                            if (allResponseData.length == results.length) {
                                console.log("done")
                                res.send({ 'files': fileName, 'action': bodyData.action, 'response': allResponseData })
                            }

                        }
                    }
                );
            }
        })
        .on('end', () => {
            console.log("done")

        });
}

send = (responseData, allResponseData, data) => {
    console.log(
        "response:server.js:565", {
            // "request": data,
            "response": {
                "TransactionID": responseData.id,
                "UserID": responseData.userid,
                "status": JSON.parse(responseData['response']['body']).data[0].status
            }
        }
    );
    if (JSON.parse(responseData['response']['body']).data[0].status == 'COMMITTED') {
        allResponseData.push({
            // "request": data,
            "response": {
                "TransactionID": responseData.id,
                "UserID": responseData.userid,
                "invalid_transactions": JSON.parse(responseData['response']['body']).data[0],

                "status": JSON.parse(responseData['response']['body']).data[0].status
            }
        })
    } else {
        allResponseData.push({
            // "request": data,
            "response": {
                "TransactionID": responseData.id,
                "invalid_transactions": JSON.parse(responseData['response']['body']).data[0].invalid_transactions,
                "status": JSON.parse(responseData['response']['body']).data[0].status
            }
        })
    }

    if (allResponseData.length == results.length) {
        console.log("done")
        res.send({ 'files': fileName, 'action': bodyData.action, 'response': allResponseData })
    }

}
readOrderFile = async(fileName, bodyData, res) => {
    const results = [];
    let singleData = {};
    let allResponseData = [];
    // let flag =0;
    await fs.createReadStream('uploads/' + fileName)
        .pipe(csv({ separator: ';' }))
        .on('data', async(data) => {
            results.push(data)
                // if (bodyData.action == 'createOrder') {
            try {
                if (data['orderNumber'] != '') {
                    if (singleData.hasOwnProperty('orderNumber')) {
                        var payload = {
                            action: 'createOrder',
                            payloaddata: singleData
                        }
                        console.log("HIT: ", data.hasOwnProperty('orderNumber'), singleData)
                    }
                    data['vendor'] = {}
                    data['vendor']['name'] = data['vendor__name'];
                    delete data['vendor__name'];
                    data['customer'] = {}
                    data['customer']['employeeName'] = data['customer__employeeName'];
                    data['customer']['addressShipping'] = data['customer__addressShipping'];
                    data['customer']['addressBilling'] = data['customer__addressBilling'];
                    data['customer']['GSTNumber'] = data['customer__GSTNumber'];
                    delete data['customer__employeeName'];
                    delete data['customer__addressShipping'];
                    delete data['customer__addressBilling'];
                    delete data['customer__GSTNumber'];
                    data['goodsService'] = [];
                    data['goodsService'].push({
                        "name": data['goodsService__name'],
                        "quantity": data['goodsService__quantity'],
                        "rate": data['goodsService__rate']
                    })
                    singleData = data;
                    if (results.length != 1) {
                        await submitUpdate(payload,
                            bodyData.private, {
                                send(responseData) {
                                    console.log("On Blockchain:", data['orderNumber'], JSON.parse(responseData['response']['body']).data[0].status);
                                    // console.log(
                                    //     "response:server.js:565", {
                                    //         // "request": data,
                                    //         "response": {
                                    //             "TransactionID": responseData.id,
                                    //             "UserID": responseData.userid,
                                    //             "status": JSON.parse(responseData['response']['body']).data[0].status
                                    //         }
                                    //     }
                                    // );
                                    if (JSON.parse(responseData['response']['body']).data[0].status == 'COMMITTED') {
                                        allResponseData.push({
                                            // "request": data,
                                            "response": {
                                                "TransactionID": responseData.id,
                                                "UserID": responseData.userid,
                                                "invalid_transactions": JSON.parse(responseData['response']['body']).data[0],
                                                "status": JSON.parse(responseData['response']['body']).data[0].status
                                            }
                                        })
                                    } else {
                                        allResponseData.push({
                                            // "request": data,
                                            "response": {
                                                "TransactionID": responseData.id,
                                                "invalid_transactions": JSON.parse(responseData['response']['body']).data[0].invalid_transactions,
                                                "status": JSON.parse(responseData['response']['body']).data[0].status
                                            }
                                        })
                                    }

                                    // if (allResponseData.length == results.length) {
                                    //     // console.log("done")
                                    //     res.send({ 'files': fileName, 'action': bodyData.action, 'response': allResponseData })
                                    // }

                                }
                            });
                    }

                } else {
                    singleData['goodsService'].push({
                        "name": data['goodsService__name'],
                        "quantity": data['goodsService__quantity'],
                        "rate": data['goodsService__rate']
                    })
                }
            } catch (error) {
                console.log(error.message);
                allResponseData.push({
                    "request": data,
                    "response": {
                        "TransactionID": NaN,
                        "invalid_transactions": [error.message],
                        "status": 'INVALID'
                    }
                })
            }
            // }
        })
        .on('end', async() => {
            console.log("done")
                // if (bodyData.action == 'createOrder') {
            try {
                if (singleData.hasOwnProperty('orderNumber')) {
                    var payload = {
                        action: 'createOrder',
                        payloaddata: singleData
                    }
                    console.log("HITOnEnd: ", singleData)
                    await submitUpdate(payload,
                        bodyData.private, {
                            send(responseData) {
                                console.log(
                                    "response:server.js:565", {
                                        // "request": data,
                                        "response": {
                                            "TransactionID": responseData.id,
                                            "UserID": responseData.userid,
                                            "status": JSON.parse(responseData['response']['body']).data[0].status
                                        }
                                    }
                                );
                                if (JSON.parse(responseData['response']['body']).data[0].status == 'COMMITTED') {
                                    allResponseData.push({
                                        // "request": data,
                                        "response": {
                                            "TransactionID": responseData.id,
                                            "UserID": responseData.userid,
                                            "invalid_transactions": JSON.parse(responseData['response']['body']).data[0],

                                            "status": JSON.parse(responseData['response']['body']).data[0].status
                                        }
                                    })
                                } else {
                                    allResponseData.push({
                                        // "request": data,
                                        "response": {
                                            "TransactionID": responseData.id,
                                            "invalid_transactions": JSON.parse(responseData['response']['body']).data[0].invalid_transactions,
                                            "status": JSON.parse(responseData['response']['body']).data[0].status
                                        }
                                    })
                                }

                                // if (allResponseData.length == results.length) {
                                console.log("done")
                                res.send({ 'files': fileName, 'action': bodyData.action, 'response': allResponseData })
                                    // }

                            }
                        });
                }
            } catch (error) {
                allResponseData.push({
                    "request": data,
                    "response": {
                        "TransactionID": responseData.id,
                        "invalid_transactions": [error.message],
                        "status": 'INVALID'
                    }
                })

                // if (allResponseData.length == results.length) {
                console.log("doneWithError")
                res.send({ 'files': fileName, 'action': bodyData.action, 'response': allResponseData })
                    // }
            }
            // }

        });
}

/**************************************** API **********************************************/

var users = nano.db.use('users')

app.post('/insert', function(req, res) {
    users = nano.db.use(req.body.db)

    users.insert(req.body.data, req.body.id).then((response) => {
        console.log(response);
        res.send(response)

    }, (err) => {
        console.log(err);
        res.send(err.message);
    });
})

app.post('/find', function(req, res) {
    users = nano.db.use(req.body.db)

    users.find(req.body.query).then((response) => {
        console.log(response)
        res.send(response)
    }, (err) => {
        console.log(err);
        res.send(err.message);
    });
})

app.get('/generateKey', function(req, res) {
    res.send(makeKeyPair());
});
app.get('/batch_statuses/:id', function(req, res) {
    getBatchStatuses(req.params.id, res);
});
app.get('/recoverPublickey/:pvtKey', function(req, res) {
    res.send(getPublicKey(req.params.pvtKey));
});
app.get('/entity', function(req, res) {
    getState(res);
});
app.get('/entity/:entity', function(req, res) {
    getStateByEntityName(req.params.entity, res);
});
app.get('/id/:id', function(req, res) {
    getIDDetails(req.params.id, res);
});
app.post('/', function(req, res) {
    req.responseType = "blob";

    var action = req.body.action;
    var payloaddata = req.body.payloaddata;
    var private = req.body.private;
    submitUpdate({ action, payloaddata },
        private,
        res
    );
});
var upload = multer({ dest: 'uploads/' })

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])

app.post('/csv/', cpUpload, async function(req, res) {
    // res.send({ 'files': req.files, 'body': req.body })
    // var responseData = await 
    readFile(req.files['avatar'][0]['filename'], req.body, res)

    // console.log(req.files['avatar'][0]['filename'], req.body)
    // res.send({ 'files': req.files, 'body': req.body, 'response': responseData })
})
app.post('/csv/orders', cpUpload, async function(req, res) {
    // res.send({ 'files': req.files, 'body': req.body })
    // var responseData = await 
    readOrderFile(req.files['avatar'][0]['filename'], req.body, res)

    // console.log(req.files['avatar'][0]['filename'], req.body)
    // res.send({ 'files': req.files, 'body': req.body, 'response': responseData })
})
port = process.env.PORT || 3000;
// app.listen(port);
// console.log('todo list RESTful API server started on: ' + port);

var server = app.listen(port, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})