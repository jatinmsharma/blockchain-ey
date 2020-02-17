Asset:

Vendor => org
    ratecard Add

Customer => org

Goods Master
    goods details
        goodsID
        name
        unit
        
Vendor Master
    vender details
        venderID
        vendoraddress
        email
        name
        --> Employee
                name
                email
                contactnumber

Rate Master
    -->venderID
    -->goodsID
    rate
    currency

Transaction
    order
        -->goodsID
        qunatity
        rate
        line_amount(qunatity*rate)
        -->Customer
            #customerID
            #customerName
            #customerAddressShipping
            #customerAddressBilling
            #customerGST
        -->Vender
            #VendorID
            #VendorName
            #VendorAddress
            #VendorGST
        #orderNumber
        #PO_Number
        #PO_Date
        #orderDate
        #orderAmount
        #SalesServiceTaxAmount
        #Discount
        orderStatus
            o inprogress
            o packaging
            o shipped
            o inTransit
            o delivered
                * Comment
        orderPayment
            invoiceNumber
            invoiceDate
            invoiceAmount
            status
                o invoiceProcessing 
                o invoiceOnHold
                o invoiceReleaseForPayment
                o paymentProcessing
                o paymentDisbursed 
                    *Comment

    creatingorder : customer
    acceptOrder : Vendor<Employee>
    orderStatus : Vendor<Employee>
    odrerPayment : customer
        


Network
    2 org
    1 Channel
    1 Asset
    1 Tx

