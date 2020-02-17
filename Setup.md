# Hyperledger Sawtooth Application - Supplychain Asset flow


## Components

Running alongside the core components from Hyperledger Sawtooth, Supply Chain
includes a number of elements customizing the blockchain and user interaction
with it:

- a **vendor-tp** which handles Supply Chain transaction logic
- a **vendorcustomer-shell** container with the dependencies to run any commands and scripts
- a **proxyserver** process client's request to original API's / Resources
- a **server** generation of signed transaction
- a **couchdb** which store users,orders, goods & services data
- the **VendorApp** FrontEnd application for client


## Requirements

| Tools & Services | Version       |
|:----------------:|:-------------:|
| Docker           | 17.06.0+      |
| Docker Compose   | 1.24.0+       |
| Node             | 8             |
| Angular          | 7             |

### Start Up
1. Terminal 1: `cd EY_Blockchain/BackEnd/ && docker-compose -f docker-compose.yaml up` For Blockchain Network setup
2. Terminal 2: `cd EY_Blockchain/BackEnd/server/ && npm i && node server.js` For Generating signed Transactions
3. Terminal 3: `cd EY_Blockchain/FrontEnd/vendorapp/ && npm i && npm start` For Client UI Application Server
4. Terminal 4: Setup CouchDB
   1. `curl -X PUT http://admin:admin@127.0.0.1:5984/_users`
   2. `curl -X PUT http://admin:admin@127.0.0.1:5984/_replicator`
   3. `curl -X PUT http://admin:admin@127.0.0.1:5984/_global_changes`
   4. `curl -X PUT http://admin:admin@127.0.0.1:5984/users`
   5. `curl -X PUT http://admin:admin@127.0.0.1:5984/goodsnservices`
   6. `curl -X PUT http://admin:admin@127.0.0.1:5984/orders`
### Endpoints
1. Proxy Server: http://localhost:8000/api
2. CouchDB: http://localhost:5984/_utils
3. VendorApp: http://localhost:4200

