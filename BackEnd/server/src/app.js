// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz. 
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/app.js
 */

'use strict'

const $ = require('jquery')
const {
  getKeys,
  makeKeyPair,
  saveKeys,
  getState,
  submitUpdate
} = require('./state')
const {
  addOption,
  addRow,
  addAction
} = require('./components')

const concatNewOwners = (existing, ownerContainers) => {
  return existing.concat(ownerContainers
    .filter(({ owner }) => !existing.includes(owner))
    .map(({ owner }) => owner))
}

// Application Object
const app = { user: null, keys: [], vendor: [], goods: [], rateCard: [], order: [] }

app.refresh = function () {
  getState(({ vendor, goods, rateCard, order }) => {
    this.vendor = vendor
    this.goods = goods
    this.rateCard = rateCard
    this.order = order

    // Clear existing data views
    $('#assetList').empty()
    $('#transferList').empty()
    $('[name="assetSelect"]').children().slice(1).remove()
    $('[name="transferSelect"]').children().slice(1).remove()

    // Populate asset views
    vendor.forEach(asset => {
      addRow('#assetList', JSON.stringify(asset), asset.owner)
      if (this.user && asset.owner === this.user.public) {
        addOption('[name="assetSelect"]', asset.name)
      }
    })

    // Populate transfer list for selected user
    goods.filter(transfer => transfer.owner === this.user.public)
      .forEach(transfer => addAction('#transferList', transfer.asset, 'Accept'))

    // Populate transfer select with both local and blockchain keys
    let publicKeys = this.keys.map(pair => pair.public)
    publicKeys = concatNewOwners(publicKeys, assets)
    publicKeys = concatNewOwners(publicKeys, transfers)
    publicKeys.forEach(key => addOption('[name="transferSelect"]', key))
  })
}

app.update = function (action, payloaddata, owner) {
  if (this.user) {
    console.log("app:68",vendor)
    submitUpdate(
      { action, payloaddata, owner },
      this.user.private,
      success => success ? this.refresh() : null
    )
  }
}

// Select User
$('[name="keySelect"]').on('change', function () {
  if (this.value === 'new') {
    app.user = makeKeyPair()
    app.keys.push(app.user)
    saveKeys(app.keys)
    addOption(this, app.user.public, true)
    addOption('[name="transferSelect"]', app.user.public)
  } else if (this.value === 'none') {
    app.user = null
  } else {
    app.user = app.keys.find(key => key.public === this.value)
    app.refresh()
  }
})

// Create Asset
$('#createSubmit').on('click', function () {
  const asset = {
    "name": $('#createName').val(),
    "address": "jaipur",
    "email":"kkm7668@gmail.com"
  }
  if (asset) app.update('createVendor', asset)
})

// Transfer Asset
$('#transferSubmit').on('click', function () {
  const asset = $('[name="assetSelect"]').val()
  const owner = $('[name="transferSelect"]').val()
  if (asset && owner) app.update('transfer', asset, owner)
})

// Accept Asset
$('#transferList').on('click', '.accept', function () {
  const asset = $(this).prev().text()
  if (asset) app.update('accept', asset)
})

$('#transferList').on('click', '.reject', function () {
  const asset = $(this).prev().prev().text()
  if (asset) app.update('reject', asset)
})

// Initialize
app.keys = getKeys()
app.keys.forEach(pair => addOption('[name="keySelect"]', pair.public))
app.refresh()
