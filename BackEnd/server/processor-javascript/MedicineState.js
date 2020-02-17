const { createHash } = require('crypto')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class medecine {
    constructor(FAMILY_NAME = 'medecine-chain', FAMILY_VERSION = '0.0') {
        this.FAMILY_NAME = FAMILY_NAME
        this.FAMILY_VERSION = FAMILY_VERSION
        this.PREFIX = this.getAddress(this.FAMILY_NAME, 6)
    }
    getAddress(key, length = 64) {
        return createHash('sha512').update(key).digest('hex').slice(0, length)
    }
    getmedecineAddress(name) { return (this.PREFIX + '00' + this.getAddress(name, 62)) }
    getTransferAddress(medecine) { return (this.PREFIX + '01' + this.getAddress(medecine, 62)) }

    encode(obj) {
        return (Buffer.from(JSON.stringify(obj, Object.keys(obj).sort())))
    }
    decode(buf) {
        return (JSON.parse(buf.toString()))
    }
createmedecine(medecine, owner, state) {
    console.log("31", medecine, owner, state)
    const address = this.getmedecineAddress(medecine)
    console.log("33", address)
    return state.getState([address])
        .then(entries => {
            const entry = entries[address]
            if (entry && entry.length > 0) {
                throw new InvalidTransaction('medecine name in use')
            }

            return state.setState({
                [address]: this.encode({ "name": medecine, owner })
            })
        })
}

// Add a new transfer to state
transfermedecine(medecine, owner, signer, state) {
    const address = this.getTransferAddress(medecine)
    const medecineAddress = this.getmedecineAddress(medecine)

    return state.getState([medecineAddress])
        .then(entries => {
            const entry = entries[medecineAddress]
            if (!entry || entry.length === 0) {
                throw new InvalidTransaction('medecine does not exist')
            }

            if (signer !== this.decode(entry).owner) {
                throw new InvalidTransaction('Only an medecine\'s owner may transfer it')
            }

            return state.setState({
                [address]: this.encode({ medecine, owner })
            })
        })
}

// Accept a transfer, clearing it and changing medecine ownership
acceptTransfer(medecine, signer, state) {
    const address = this.getTransferAddress(medecine)

    return state.getState([address])
        .then(entries => {
            const entry = entries[address]
            if (!entry || entry.length === 0) {
                throw new InvalidTransaction('medecine is not being transfered')
            }

            if (signer !== this.decode(entry).owner) {
                throw new InvalidTransaction(
                    'Transfers can only be accepted by the new owner'
                )
            }

            return state.setState({
                [address]: Buffer(0),
                [this.getmedecineAddress(medecine)]: this.encode({ name: medecine, owner: signer })
            })
        })
}

// Reject a transfer, clearing it
rejectTransfer(medecine, signer, state) {
    const address = this.getTransferAddress(medecine)

    return state.getState([address])
        .then(entries => {
            const entry = entries[address]
            if (!entry || entry.length === 0) {
                throw new InvalidTransaction('medecine is not being transfered')
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
module.exports = medecine;