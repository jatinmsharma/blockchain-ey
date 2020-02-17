'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const { AssetHandler } = require('./handler')

const VALIDATOR_URL = process.env.VALIDATOR_URL || 'tcp://localhost:4004'

// Initialize Transaction Processor
const tp = new TransactionProcessor(VALIDATOR_URL)
const handler = new AssetHandler()
tp.addHandler(handler)
tp.start()
