const { createHash } = require('crypto')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class Asset {
    constructor(FAMILY_NAME = 'asset-chain', FAMILY_VERSION = '0.0') {
        this.FAMILY_NAME = FAMILY_NAME
        this.FAMILY_VERSION = FAMILY_VERSION
        this.PREFIX = [afeabc]//this.getAddress(this.FAMILY_NAME, 6)
    }
    // console.log(TransactionHandler);
    // Encoding helpers and constants
    getAddress(key, length = 64) {
        return createHash('sha512').update(key).digest('hex').slice(0, length)
    }
    // const PREFIX = 'assetc'
    // console.log(PREFIX);
    getAssetAddress(name) { return (this.PREFIX + '00' + this.getAddress(name, 62)) }
    getTransferAddress(asset) { return (this.PREFIX + '01' + this.getAddress(asset, 62)) }

    encode(obj) {
        return (Buffer.from(JSON.stringify(obj, Object.keys(obj).sort())))
    }
    decode(buf) {
        return (JSON.parse(buf.toString()))
    }
//     Vendor {
//     vendorID,
//         vendorAddress,
//         email,
//         name
// }
// Add a new asset to state
createAsset(asset, owner, state) {
    console.log("31", asset, owner, state)
    const address = this.getAssetAddress(asset)
    console.log("33", address)
    return state.getState([address])
        .then(entries => {
            const entry = entries[address]
            if (entry && entry.length > 0) {
                throw new InvalidTransaction('Asset name in use')
            }

            return state.setState({
                [address]: this.encode({ "name": asset, owner })
            })
        })
}

// Add a new transfer to state
transferAsset(asset, owner, signer, state) {
    const address = this.getTransferAddress(asset)
    const assetAddress = this.getAssetAddress(asset)

    return state.getState([assetAddress])
        .then(entries => {
            const entry = entries[assetAddress]
            if (!entry || entry.length === 0) {
                throw new InvalidTransaction('Asset does not exist')
            }

            if (signer !== this.decode(entry).owner) {
                throw new InvalidTransaction('Only an Asset\'s owner may transfer it')
            }

            return state.setState({
                [address]: this.encode({ asset, owner })
            })
        })
}

// Accept a transfer, clearing it and changing asset ownership
acceptTransfer(asset, signer, state) {
    const address = this.getTransferAddress(asset)

    return state.getState([address])
        .then(entries => {
            const entry = entries[address]
            if (!entry || entry.length === 0) {
                throw new InvalidTransaction('Asset is not being transfered')
            }

            if (signer !== this.decode(entry).owner) {
                throw new InvalidTransaction(
                    'Transfers can only be accepted by the new owner'
                )
            }

            return state.setState({
                [address]: Buffer(0),
                [this.getAssetAddress(asset)]: this.encode({ name: asset, owner: signer })
            })
        })
}

// Reject a transfer, clearing it
rejectTransfer(asset, signer, state) {
    const address = this.getTransferAddress(asset)

    return state.getState([address])
        .then(entries => {
            const entry = entries[address]
            if (!entry || entry.length === 0) {
                throw new InvalidTransaction('Asset is not being transfered')
            }

            if (signer !== this.decode(entry).owner) {
                throw new InvalidTransaction(
                    'Transfers can only be rejected by the potential new owner')
            }

            return state.setState({
                [address]: Buffer(0)
            })
        })
}
}
module.exports = Asset;