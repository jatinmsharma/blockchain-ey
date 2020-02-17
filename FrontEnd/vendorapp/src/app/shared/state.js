// SPDX-License-Identifier: Apache-2.0

/*
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/state.js
 */

// 'use strict'

const $ = require('jquery')
// const request = require('request')
var atob = require('atob');
const { createHash } = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')
const {
  createContext,
  Signer
} = require('sawtooth-sdk/signing')
const secp256k1 = require('sawtooth-sdk/signing/secp256k1')

// Config variables
const KEY_NAME = 'vendor-customer-chain.keys'
const API_URL = 'http://localhost:8000/api'
const FAMILY = 'vendor-customer-chain'
const VERSION = '0.0'
const PREFIX = 'cb61fe'

// Fetch key-pairs from localStorage
const getKeys = () => {
  const storedKeys = localStorage.getItem(KEY_NAME)
  if (!storedKeys) return []

  return storedKeys.split(';').map((pair) => {
    const separated = pair.split(',')
    return {
      public: separated[0],
      private: separated[1]
    }
  })
}

// Create new key-pair
const makeKeyPair = () => {
  const context = createContext('secp256k1')
  const privateKey = context.newRandomPrivateKey()
  return {
    public: context.getPublicKey(privateKey).asHex(),
    private: privateKey.asHex()
  }
}

// Save key-pairs to localStorage
const saveKeys = keys => {
  const paired = keys.map(pair => [pair.public, pair.private].join(','))
  localStorage.setItem(KEY_NAME, paired.join(';'))
}

// Fetch current Sawtooth Tuna Chain state from validator
const getState = (cb) => {
  request.get(`${API_URL}/state?address=${PREFIX}`, function (error, response, body) {
    if (!error) {
      var datum = JSON.parse(JSON.constructor(body));
      console.log(datum);
      var processed = {
        "vendor": [],
        "employee": [],
        "customerOrg": [],
        "customerEmployee": [],
        "goods": [],
        // "rateCard": [],
        "order": []
      }
      if (datum.data !== '') {
        for (var i = 0; i < datum.data.length; i++) {
          var decodeData = JSON.parse(atob(datum.data[i].data))
          if (datum.data[i].address[7] === '0') processed.vendor.push(decodeData)
          if (datum.data[i].address[7] === '1') processed.goods.push(decodeData)
          // if (datum.data[i].address[7] === '2') processed.rateCard.push(decodeData)
          if (datum.data[i].address[7] === '3') processed.order.push(decodeData)
          if (datum.data[i].address[7] === '4') processed.employee.push(decodeData)
          if (datum.data[i].address[7] === '5') processed.customerOrg.push(decodeData)
          if (datum.data[i].address[7] === '6') processed.customerEmployee.push(decodeData)

        }
      }
      console.log("processed", processed)
      cb.send(processed);
    } else {
      console.log('error', error, response && response.statusCode);
      cb.send({ error, response })
    }
  })
}
const getStateByEntityName = (entity, cb) => {
  if (entity == 'vendor') entity = '0';
  if (entity == 'goods') entity = '1';
  if (entity == 'rateCard') entity = '2';
  if (entity == 'order') entity = '3';
  if (entity == 'employee') entity = '4';

  request.get(`${API_URL}/state?address=${PREFIX}`, function (error, response, body) {
    if (!error) {
      var datum = JSON.parse(JSON.constructor(body));
      console.log("state: 102", datum);
      var processed = {
        entity: []
      }
      if (datum.data !== '') {
        for (var i = 0; i < datum.data.length; i++) {
          var decodeData = JSON.parse(atob(datum.data[i].data))
          if (datum.data[i].address[7] === entity) processed.entity.push(decodeData)

        }
      }
      console.log("processed", processed)
      cb.send(processed);
    } else {
      console.log('error', error, response && response.statusCode);
      cb.send({ error, response })
    }
  })
}

const getIDDetails = (address, cb) => {
  request.get(`${API_URL}/state?address=${address}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("102", body)
      console.log("102", response.statusCode, response.statusMessage)

      var datum = JSON.parse(JSON.constructor(body));
      console.log(datum);
      var processed = {
      }
      processed[address] = [];
      if (datum.data !== '') {
        for (var i = 0; i < datum.data.length; i++) {
          var decodeData = JSON.parse(atob(datum.data[i].data))
          processed[address].push(decodeData)

        }
      }
      console.log("processed", processed)
      cb.send(processed);
    } else {
      console.log('error', error, response, response.statusMessage);
      cb.send({ error, response, "message": response.statusMessage })
    }
  })
}
// Submit signed Transaction to validator
const submitUpdate = (payload, privateKeyHex, cb) => {
  // Create signer
  console.log("data", payload, "\n TF::", !payload["owner"])
  const context = createContext('secp256k1')
  const privateKey = secp256k1.Secp256k1PrivateKey.fromHex(privateKeyHex)
  const signer = new Signer(context, privateKey)
  if (!payload["owner"]) {
    payload["owner"] = signer.getPublicKey().asHex().toString();
    console.log("data", payload)

  }
  // Create the TransactionHeader
  const payloadBytes = Buffer.from(JSON.stringify(payload))
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: FAMILY,
    familyVersion: VERSION,
    inputs: [PREFIX],
    outputs: [PREFIX],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
  }).finish()

  // Create the Transaction
  const transactionHeaderSignature = signer.sign(transactionHeaderBytes)

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: transactionHeaderSignature,
    payload: payloadBytes
  })

  // Create the BatchHeader
  const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: [transaction.headerSignature]
  }).finish()

  // Create the Batch
  const batchHeaderSignature = signer.sign(batchHeaderBytes)

  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchHeaderSignature,
    transactions: [transaction]
  })

  // Encode the Batch in a BatchList
  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish()

  var req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    processData: false,
    body: batchListBytes
  };

  request.post(`${API_URL}/batches`, req,
    function (error, response, body) {
      if (!error) {
        var id = body.link().split('?')[1].split('\"')[0];
        request.get(`${API_URL}/batch_statuses?${id}&wait`, function (error, response, body) {
          if (!error) {
            cb.send(id);
          }
        })
      } else {
        console.log('error', error, response && response.statusCode);
        cb.send({ error, response })
      }
    }
  )
}

module.exports = {
  getKeys,
  makeKeyPair,
  saveKeys,
  getState,
  submitUpdate,
  getStateByEntityName,
  getIDDetails
}
