'use strict'

const { createHash } = require('crypto')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const protobuf = require('sawtooth-sdk/protobuf')
const Asset = require('./AssetState');
var assetIntance = new Asset();
console.log(assetIntance);

// // Encoding helpers and constants
const getAddress = (key, length = 64) => {
  return createHash('sha512').update(key).digest('hex').slice(0, length)
}

const PREFIX = getAddress(assetIntance.FAMILY_NAME, 6)
// const PREFIX = 'assetc'
console.log(PREFIX);
const getAssetAddress = name => PREFIX + '00' + getAddress(name, 62)
const getTransferAddress = asset => PREFIX + '01' + getAddress(asset, 62)

class AssetHandler extends TransactionHandler {
  constructor() {
    super(assetIntance.FAMILY_NAME, [assetIntance.FAMILY_VERSION], [assetIntance.PREFIX])
    // console.log(TransactionHandler)
  }

  apply(txn, context) {
    console.log(txn, context);

    // Parse the transaction header and payload
    const header = txn.header//protobuf.TransactionHeader.decode(txn.header)  
    const signer = header.signerPublicKey
    const { action, asset, owner } = JSON.parse(txn.payload)
    const state = context;

    // Call the appropriate function based on the payload's action
    console.log(`Handling transaction:  ${action} > ${asset}`,
      owner ? `> ${owner.slice(0, 8)}... ` : '',
      `:: ${signer.slice(0, 8)}...`)

    if (action === 'create') return assetIntance.createAsset(asset, signer, state)
    if (action === 'transfer') return assetIntance.transferAsset(asset, owner, signer, state)
    if (action === 'accept') return assetIntance.acceptTransfer(asset, signer, state)
    if (action === 'reject') return assetIntance.rejectTransfer(asset, signer, state)

    return Promise.resolve().then(() => {
      throw new InvalidTransaction(
        'Action must be "create", "transfer", "accept", or "reject"'
      )
    })
  }
}

module.exports = {
  AssetHandler
}
