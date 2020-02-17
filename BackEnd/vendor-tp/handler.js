'use strict'

const { createHash } = require('crypto')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const protobuf = require('sawtooth-sdk/protobuf')
const VendorCustomer = require('./vendorcustomer');
var VendorCustomerInstance = new VendorCustomer();
// console.log(VendorCustomerInstance);

// // Encoding helpers and constants
// const getAddress = (key, length = 64) => {
//   return createHash('sha512').update(key).digest('hex').slice(0, length)
// }
// const getAssetAddress = name => PREFIX + '00' + getAddress(name, 62)
// const getTransferAddress = asset => PREFIX + '01' + getAddress(asset, 62)

class VendorCustomerHandler extends TransactionHandler {
  constructor() {
    super(VendorCustomerInstance.FAMILY_NAME, [VendorCustomerInstance.FAMILY_VERSION], [VendorCustomerInstance.PREFIX])
    // console.log(TransactionHandler)
  }

  apply(txn, context) {
    // console.log(txn, context);

    // Parse the transaction header and payload
    const header = txn.header//protobuf.TransactionHeader.decode(txn.header)  
    const signer = header.signerPublicKey
    const { action, payloaddata, owner } = JSON.parse(txn.payload)
    const state = context;
    console.log("handler:32", payloaddata)
    // Call the appropriate function based on the payload's action
    console.log(`Handling transaction:  ${action} > ${payloaddata}`,
      owner ? `> ${owner.slice(0, 8)}... ` : '',
      `:: ${signer.slice(0, 8)}...`)

    if (action === 'createVendor') return VendorCustomerInstance.createVendor(payloaddata, signer, state)
    if (action === 'registerEmployee') return VendorCustomerInstance.registerEmployee(payloaddata, signer, state)
    if (action === 'registerCustomerOrg') return VendorCustomerInstance.registerCustomerOrg(payloaddata, signer, state)
    if (action === 'registerCustomerOrgEmployee') return VendorCustomerInstance.registerCustomerOrgEmployee(payloaddata, signer, state)
    if (action === 'createGoods') return VendorCustomerInstance.createGoods(payloaddata, signer, state)
    // if (action === 'createRate') return VendorCustomerInstance.createRate(payloaddata, signer, state)
    if (action === 'createOrder') return VendorCustomerInstance.createOrder(payloaddata, signer, state)
    if (action === 'transferOwnership') return VendorCustomerInstance.transferOwnership(payloaddata, signer, state)
    if (action === 'acceptOrder') return VendorCustomerInstance.acceptOrder(payloaddata, signer, state)
    if (action === 'orderStatus') return VendorCustomerInstance.orderStatus(payloaddata, signer, state)
    if (action === 'orderPayment') return VendorCustomerInstance.orderPayment(payloaddata, signer, state)
    if (action === 'orderPaymentStatus') return VendorCustomerInstance.orderPaymentStatus(payloaddata, signer, state)

    return Promise.resolve().then(() => {
      throw new InvalidTransaction(
        'Action must be "createVendor", "registerCustomerOrg", "registerCustomerOrgEmployee", "registerEmployee", "createGoods","createOrder", "transferOwnership", "acceptOrder", "orderStatus", "orderPayment" or "orderPaymentStatus"'
      )
    })
  }
}

module.exports = {
  VendorCustomerHandler
}
