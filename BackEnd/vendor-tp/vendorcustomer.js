const { createHash } = require('crypto')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class VendorCustomer {
    constructor(FAMILY_NAME = 'vendor-customer-chain', FAMILY_VERSION = '0.0') {
        this.FAMILY_NAME = FAMILY_NAME
        this.FAMILY_VERSION = FAMILY_VERSION
        this.PREFIX = createHash('sha512').update('vendor-customer-chain').digest('hex').slice(0, 6) //this.getAddress(this.FAMILY_NAME, 6)
    }

    getAddress(key, length = 64) {
        return createHash('sha512').update(key).digest('hex').slice(0, length)
    }

    getVendorID(vendorName) { return (this.PREFIX + '00' + this.getAddress(vendorName, 62)) }
    getGoodsID(goodsName, vendorName) { return (this.PREFIX + '01' + this.getAddress(goodsName + vendorName, 62)) }
    getRateID(rate, vendorName) { return (this.PREFIX + '02' + this.getAddress(rate + vendorName, 62)) }
    getOrderID(orderNumber) { return (this.PREFIX + '03' + this.getAddress(orderNumber, 62)) }
    getEmployeeID(employeePublicKey) { return (this.PREFIX + '04' + this.getAddress(employeePublicKey, 62)) }
    getCustomerOrgID(customerOrgName) { return (this.PREFIX + '05' + this.getAddress(customerOrgName, 62)) }
    getCustomerEmployeeID(employeePublicKey) { return (this.PREFIX + '06' + this.getAddress(employeePublicKey, 62)) }

    encode(obj) {
        return (Buffer.from(JSON.stringify(obj)))
    }
    decode(buf) {
        return (JSON.parse(buf.toString()))
    }

    createVendor(vendor, signer, state) {
        try {
            console.log("vendorcustomer:28", vendor);
            const VendorID = this.getVendorID(vendor.name)
            return state.getState([VendorID])
                .then(entries => {
                    const entry = entries[VendorID]
                    if (entry && entry.length > 0) {
                        throw new InvalidTransaction('Vendor name in use')
                    } else {

                        return state.setState({
                            [VendorID]: this.encode({
                                "vendor": {
                                    "ID": VendorID,
                                    "name": vendor.name,
                                    "address": vendor.address,
                                    "email": vendor.email
                                },
                                "owner": signer
                            })
                        })
                    }
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }

    registerEmployee(employee, signer, state) {
        try {
            const VendorID = this.getVendorID(employee.vendorName)
            const EID = this.getEmployeeID(employee.employeeAddress)
            console.log(employee);
            console.log("57", EID);

            return state.getState([VendorID])
                .then(entries => {
                    const entry = entries[VendorID]
                    if (!entry || entry.length === 0) {
                        throw new InvalidTransaction('Vendor does not exist')
                    }

                    if (signer !== this.decode(entry).owner) {
                        throw new InvalidTransaction('Only an Vendor\'s owner may register employee')
                    }
                    return state.getState([EID])
                        .then(entriesEmployee => {
                            const eEmployee = entriesEmployee[EID]
                            if (eEmployee.length > 0) {
                                throw new InvalidTransaction('Employee already register :' + eEmployee.toString())
                            }
                            return state.setState({
                                [EID]: this.encode({
                                    "employee": {
                                        "ID": EID,
                                        "name": employee.name,
                                        "email": employee.email,
                                        "contactNumber": employee.contactNumber,
                                        "publicKey": employee.employeeAddress,
                                        "role": employee.role //Admin:2,Normal:1
                                    },
                                    "vendor": { "name": employee.vendorName },
                                    "owner": employee.employeeAddress
                                })
                            })

                        }).catch(err => {
                            throw new InvalidTransaction(err.message)
                        })
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)
        }
    }

    registerCustomerOrg(customer, signer, state) {
        try {
            console.log("vendorcustomer:28", customer);
            const VendorID = this.getVendorID(customer.vendor.name)
            const CustomerOrgID = this.getCustomerOrgID(customer.name)

            return state.getState([VendorID])
                .then(entries => {
                    const entry = entries[VendorID]
                    if (!entry && entry.length === 0) {
                        throw new InvalidTransaction('Vendor name in use')
                    }
                    if (signer !== this.decode(entry).owner) {
                        throw new InvalidTransaction('Only an Vendor\'s owner may register employee')
                    }
                    return state.getState([CustomerOrgID])
                        .then(entries => {
                            const eCustomer = entries[CustomerOrgID]
                            if (eCustomer.length > 0) {
                                throw new InvalidTransaction('Customer Org register :' + eCustomer.toString())
                            }
                            return state.setState({
                                [CustomerOrgID]: this.encode({
                                    "customer": {
                                        "ID": CustomerOrgID,
                                        "name": customer.name,
                                        "address": customer.address,
                                        "email": customer.email,
                                        "contactNumber": customer.contactNumber,
                                        "GSTNumber": customer.GSTNumber,
                                        "publicKey": customer.publicKey
                                    },
                                    "owner": customer.publicKey
                                })
                            })
                        }).catch(err => {
                            throw new InvalidTransaction(err.message)
                        })
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)
        }

    }
    registerCustomerOrgEmployee(employee, signer, state) {
        try {
            const CustomerOrgID = this.getCustomerOrgID(employee.orgName)
            const CEID = this.getCustomerEmployeeID(employee.publicKey)

            return state.getState([CustomerOrgID])
                .then(entries => {
                    const entry = entries[CustomerOrgID]
                    if (!entry || entry.length === 0) {
                        throw new InvalidTransaction('Customer Oraganization does not registered')
                    }

                    if (signer !== this.decode(entry).customer.publicKey) {
                        throw new InvalidTransaction('Only an Organization\'s owner may register employee')
                    }
                    return state.getState([CEID])
                        .then(entriesEmployee => {
                            const eEmployee = entriesEmployee[CEID]
                            if (eEmployee.length > 0) {
                                throw new InvalidTransaction('Employee already register :' + eEmployee.toString())
                            }
                            return state.setState({
                                [CEID]: this.encode({
                                    "employee": {
                                        "ID": CEID,
                                        "name": employee.name,
                                        "email": employee.email,
                                        "contactNumber": employee.contactNumber,
                                        "PublicKey": employee.publicKey,
                                        "role": employee.role //Admin:2,Normal:1
                                    },
                                    "customer": {
                                        "ID": CustomerOrgID,
                                        "name": employee.orgName,
                                        "GSTNumber": this.decode(entry).customer.GSTNumber
                                    },
                                    "owner": employee.publicKey

                                })
                            })

                        }).catch(err => {
                            throw new InvalidTransaction(err.message)
                        })
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }

    createGoods(goodsupdate, signer, state) {
        try {
            const GoodsID = this.getGoodsID(goodsupdate.goods.name, goodsupdate.vendor.name)
                // const VendorID = this.getVendorID(goodsupdate.vendor.name)
            const EID = this.getEmployeeID(signer)
            return state.getState([EID])
                .then(entries => {
                    const e_entry = entries[EID]
                    if (!e_entry || e_entry.length === 0) {
                        throw new InvalidTransaction('Employee does not exist')
                    }
                    if (!(parseInt(this.decode(e_entry).employee.role) > 1)) {
                        throw new InvalidTransaction('Only an Vendor\'s admin access user may create goods:: ' + this.decode(e_entry).employee.role)
                    }
                    return state.getState([GoodsID])
                        .then(entries => {
                            var data = {};
                            const goodsEntry = entries[GoodsID]
                            if (goodsEntry && goodsEntry.length > 0) {
                                data = this.decode(goodsEntry);
                                data.goods.unit += goodsupdate.goods.unit;
                            } else {
                                data = {
                                    "goods": {
                                        "ID": GoodsID,
                                        "type": goodsupdate.type,
                                        "name": goodsupdate.goods.name,
                                        "unit": goodsupdate.goods.unit
                                    },
                                    "vendor": {
                                        "name": goodsupdate.vendor.name,
                                        "creator": goodsupdate.vendor.employeeName
                                    },
                                    "owner": signer
                                }
                            }
                            return state.setState({
                                [GoodsID]: this.encode(
                                    data
                                )
                            })
                        }).catch(err => {
                            throw new InvalidTransaction(err.message)
                        })
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }

    // createRate(rate, signer, state) {
    //     const RateID = this.getRateID(rate.rate, rate.vendor.name);
    //     const GoodsID = this.getGoodsID(rate.goods.name, rate.vendor.name)

    //     return state.getState([GoodsID])
    //         .then(entries => {
    //             const entry = entries[GoodsID]
    //             if (!entry || entry.length === 0) {
    //                 throw new InvalidTransaction('Goods does not exist')
    //             }
    //             // if (!(this.decode(entry).employee.role > 1)) {
    //             //     throw new InvalidTransaction('Only an Vendor\'s admin access user may create goods:: ' + this.decode(e_entry).employee.role)
    //             // }
    //             if (signer !== this.decode(entry).owner) {
    //                 throw new InvalidTransaction('Only an Goods\'s owner may create rate card')
    //             }
    //             if (rate.vendor.name !== this.decode(entry).vendor.name) {
    //                 throw new InvalidTransaction('Vendor not matched')
    //             }
    //             return state.getState([RateID])
    //                 .then(entries => {
    //                     const rateEntry = entries[RateID]
    //                     if (rateEntry && rateEntry.length > 0) {
    //                         throw new InvalidTransaction('Rate does exist')
    //                     }
    //                     return state.setState({
    //                         [RateID]: this.encode(
    //                             {
    //                                 "goods": {
    //                                     "name": rate.goods.name
    //                                 },
    //                                 "vendor": {
    //                                     "name": rate.vendor.name,
    //                                     "creator": rate.vendor.employeeName
    //                                 },
    //                                 "rate": {
    //                                     "ID": RateID,
    //                                     "rate": rate.rate,
    //                                     "currency": rate.currency
    //                                 },
    //                                 "owner": signer
    //                             }
    //                         )
    //                     })
    //                 })
    //         })

    // }

    createOrder(order, signer, state) {
        try {
            const CEID = this.getCustomerEmployeeID(signer)
            const OrderID = this.getOrderID(order.orderNumber)
            const GoodsID = [];
            order.goodsService = new Object(order.goodsService)
            console.log("vc191", order.goodsService);

            for (var i = 0; i < order.goodsService; i++) {
                GoodsID.push = order.goodsService[i].name;
            }

            console.log(GoodsID);
            return state.getState([CEID])
                .then(entriesEmployee => {
                    const eEmployee = entriesEmployee[CEID]
                    if (!eEmployee || eEmployee.length === 0) {
                        throw new InvalidTransaction('Employee NOT registered :' + eEmployee.toString())
                    }
                    if (parseInt(this.decode(eEmployee).employee.role) !== 2) {
                        throw new InvalidTransaction('Employee doesnot have permission to create order :' + eEmployee.toString())
                    }
                    return state.getState([OrderID])
                        .then(entries => {
                            const orderEntry = entries[OrderID]
                            if (orderEntry.length > 0) {
                                throw new InvalidTransaction('Order is already create')
                            }
                            return state.getState(GoodsID)
                                .then(entries => {
                                    for (var i = 0; i < GoodsID.length; i++) {
                                        const goodsEntry = entries[GoodsID[0]]
                                        if (!goodsEntry || goodsEntry.length === 0) {
                                            throw new InvalidTransaction('Goods does not exist')
                                        }
                                        if (this.decode(goodsEntry).vendor.name !== order.vendor.name) {
                                            throw new InvalidTransaction('Vendor is diffrent.')
                                        }
                                    }

                                    return state.setState({
                                        [OrderID]: this.encode({
                                            "ID": OrderID,
                                            "orderNumber": order.orderNumber,
                                            "vendor": {
                                                "name": order.vendor.name
                                            },
                                            "customer": {
                                                "ID": this.decode(eEmployee).customer.ID,
                                                "name": this.decode(eEmployee).customer.name,
                                                "addressShipping": order.customer.addressShipping,
                                                "addressBilling": order.customer.addressBilling,
                                                "employeeID": CEID
                                            },
                                            "PO_Number": order.PO_Number,
                                            "PO_Date": order.PO_Date,
                                            "orderDate": order.orderDate,
                                            "orderAmount": order.orderAmount,
                                            "orderStatus": {
                                                "comment": order.comment,
                                                "status": order.orderStatus,
                                                "employeeID": ""
                                            },
                                            "goodsService": order.goodsService,
                                            "orderHandler": signer,
                                            "owner": signer
                                        })
                                    })
                                }).catch(err => {
                                    throw new InvalidTransaction(err.message)
                                })
                        }).catch(err => {
                            throw new InvalidTransaction(err.message)
                        })
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }
    transferOwnership(order, signer, state) {
        try {
            const OrderID = this.getOrderID(order.orderNumber)
            return state.getState([OrderID])
                .then(entries => {
                    const orderEntry = entries[OrderID]
                    if (!orderEntry || orderEntry.length === 0) {
                        throw new InvalidTransaction('Order is not being placed')
                    }
                    var orderData = this.decode(orderEntry);
                    if (parseInt(orderData.orderStatus.status) == 3) {
                        throw new InvalidTransaction(
                            'Order was discarded!!'
                        )
                    }
                    if (orderData.orderHandler === signer) {
                        orderData.orderHandler = order.newOwnerPublicKey;
                        return state.setState({
                            [OrderID]: this.encode(
                                orderData)
                        })
                    } else {
                        const CustomerOrgID = this.getCustomerOrgID(orderData.customer.name)
                        return state.getState([CustomerOrgID])
                            .then(entries => {
                                const entry = entries[CustomerOrgID]
                                if (!entry || entry.length === 0) {
                                    throw new InvalidTransaction('Customer Oraganization does not registered')
                                }

                                if (signer !== this.decode(entry).customer.publicKey) {
                                    throw new InvalidTransaction('Only an Organization\'s owner or Order Handler can transfer ownership')
                                }
                                orderData.orderHandler = order.newOwnerPublicKey;
                                return state.setState({
                                    [OrderID]: this.encode(
                                        orderData)
                                })
                            }).catch(err => {
                                throw new InvalidTransaction(err.message)
                            })
                    }
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }
    acceptOrder(order, signer, state) {
        try {
            const OrderID = this.getOrderID(order.orderNumber)
            const EID = this.getEmployeeID(signer)
            return state.getState([OrderID])
                .then(entries => {
                    const orderEntry = entries[OrderID]
                    if (!orderEntry || orderEntry.length === 0) {
                        throw new InvalidTransaction('Order is not being placed')
                    }
                    return state.getState([EID])
                        .then(entries => {
                            const employeeEntry = entries[EID]
                            if (!employeeEntry || employeeEntry.length === 0) {
                                throw new InvalidTransaction('Employee does not exist')
                            }
                            if (this.decode(orderEntry).vendor.name !== this.decode(employeeEntry).vendor.name) {
                                throw new InvalidTransaction(
                                    'Order can only be accepted by the associate vendor employee'
                                )
                            }
                            if (parseInt(this.decode(orderEntry).orderStatus.status) !== 2) {
                                throw new InvalidTransaction(
                                    'Order is not awared yet!!'
                                )
                            }
                            var newOrderEntry = this.decode(orderEntry);
                            newOrderEntry.orderStatus.comment = order.comment;
                            newOrderEntry.orderStatus.status = order.orderStatus;
                            newOrderEntry.orderStatus.employeeID = signer;
                            newOrderEntry["salesServiceTaxAmount"] = order.salesServiceTaxAmount;
                            // newOrderEntry["Discount"] = order.discount;

                            for (let letter of newOrderEntry.goodsService.entries()) {
                                letter[1]["discount"] = order.discount[letter[1].name]
                            }

                            return state.setState({
                                [OrderID]: this.encode(
                                    newOrderEntry
                                )
                            })
                        }).catch(err => {
                            throw new InvalidTransaction(err.message)
                        })
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }

    orderStatus(order, signer, state) {
        try {
            const OrderID = this.getOrderID(order.orderNumber)
            return state.getState([OrderID])
                .then(entries => {
                    const orderEntry = entries[OrderID]
                    if (!orderEntry || orderEntry.length === 0) {
                        throw new InvalidTransaction('Order is not being placed')
                    }
                    if (parseInt(this.decode(orderEntry).orderStatus.status) === 3) {
                        throw new InvalidTransaction(
                            'Order was discarded!!'
                        )
                    }
                    if (parseInt(order.orderStatus.status) === 2 || parseInt(order.orderStatus.status) === 4) {
                        const EID = this.getEmployeeID(signer);
                        return state.getState([OrderID])
                            .then(entries => {
                                const employeeEntries = entries[EID]
                                if (!employeeEntries || employeeEntries.length === 0) {
                                    throw new InvalidTransaction('Employee does not exist')
                                }
                                if (this.decode(orderEntry).vendor.name !== this.decode(employeeEntries).vendor.name) {
                                    throw new InvalidTransaction(
                                        'Employee/Vendor not associate with order!!'
                                    )
                                }
                                var newOrderEntry = this.decode(orderEntry);
                                newOrderEntry.orderStatus.comment = order.comment;
                                newOrderEntry.orderStatus.status = order.orderStatus;
                                newOrderEntry.orderStatus.employeeID = signer;
                                return state.setState({
                                    [OrderID]: this.encode(
                                        newOrderEntry
                                    )
                                })

                            });
                    } else {
                        if (this.decode(orderEntry).orderHandler !== signer) {
                            throw new InvalidTransaction(
                                'Customer not associate with order!!'
                            )
                        }
                        if (parseInt(order.orderStatus.status) === 3 || parseInt(order.orderStatus.status) === 6) {
                            throw new InvalidTransaction(
                                'Order delivered can\'t be discarded!!'
                            )
                        }
                        var newOrderEntry = this.decode(orderEntry);
                        newOrderEntry.orderStatus.comment = order.comment;
                        newOrderEntry.orderStatus.status = order.orderStatus;
                        newOrderEntry.orderStatus.employeeID = "";
                        return state.setState({
                            [OrderID]: this.encode(
                                newOrderEntry
                            )
                        })

                    }
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }

    orderPayment(order, signer, state) {
        try {
            const OrderID = this.getOrderID(order.orderNumber)
            const EID = this.getEmployeeID(signer)
            return state.getState([OrderID])
                .then(entries => {
                    const orderEntry = entries[OrderID]
                    if (!orderEntry || orderEntry.length === 0) {
                        throw new InvalidTransaction('Order is not being placed')
                    }
                    if (!this.decode(orderEntry).hasOwnProperty('orderPayment')) {
                        return state.getState([EID])
                            .then(entries => {
                                const employeeEntry = entries[EID]
                                if (!employeeEntry || employeeEntry.length === 0) {
                                    throw new InvalidTransaction('Employee does not exist')
                                }
                                if (this.decode(orderEntry).vendor.name !== this.decode(employeeEntry).vendor.name) {
                                    throw new InvalidTransaction(
                                        'Order can only be accepted by the associate vendor employee'
                                    )
                                }
                                if (this.decode(orderEntry).orderStatus.orderStatus == 6) {
                                    throw new InvalidTransaction(
                                        'Order must be delivered'
                                    )
                                }
                                var newOrderEntry = this.decode(orderEntry);
                                newOrderEntry["orderPayment"] = {};
                                newOrderEntry.orderPayment["invoiceNumber"] = order.invoiceNumber;
                                newOrderEntry.orderPayment["invoiceDate"] = order.invoiceDate;
                                newOrderEntry.orderPayment["invoiceAmount"] = order.invoiceAmount;
                                newOrderEntry.orderPayment["status"] = {};
                                newOrderEntry.orderPayment.status["paymentStatus"] = order.paymentStatus;
                                newOrderEntry.orderPayment.status["comment"] = order.comment;
                                newOrderEntry.orderPayment.status["updater"] = signer;

                                return state.setState({
                                    [OrderID]: this.encode(
                                        newOrderEntry
                                    )
                                })
                            }).catch(err => {
                                throw new InvalidTransaction(err.message)
                            })
                    }


                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }

    orderPaymentStatus(order, signer, state) {
        try {
            const OrderID = this.getOrderID(order.orderNumber)
                // const EID = this.getEmployeeID(order.employeeName, signer)
            return state.getState([OrderID])
                .then(entries => {
                    const orderEntry = entries[OrderID]
                    if (!orderEntry || orderEntry.length === 0) {
                        throw new InvalidTransaction('Order is not being placed')
                    }
                    if (this.decode(orderEntry).orderHandler != signer) {
                        throw new InvalidTransaction(
                            'Customer not associate with order!!'
                        )
                    }
                    if (parseInt(this.decode(orderEntry).orderPayment.status.paymentStatus) !== 1) {
                        throw new InvalidTransaction(
                            'Invoice not generated yet!!'
                        )
                    }
                    if (parseInt(this.decode(orderEntry).orderPayment.status.paymentStatus) === 2) {
                        throw new InvalidTransaction('Payment Done')
                    }

                    var newOrderEntry = this.decode(orderEntry);
                    newOrderEntry.orderPayment.status["paymentStatus"] = order.paymentStatus;
                    newOrderEntry.orderPayment.status["comment"] = order.comment;
                    newOrderEntry.orderPayment.status["updater"] = signer;

                    return state.setState({
                            [OrderID]: this.encode(
                                newOrderEntry
                            )
                        })
                        // })
                }).catch(err => {
                    throw new InvalidTransaction(err.message)
                })
        } catch (error) {
            throw new InvalidTransaction(error.message)

        }

    }
}
module.exports = VendorCustomer;
