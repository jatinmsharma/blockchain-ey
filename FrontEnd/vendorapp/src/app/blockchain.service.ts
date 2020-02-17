import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { async } from '@angular/core/testing';
import * as config from '../../config.json'
@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  url = config.serverip;//"http://52.187.53.56:3000"
  constructor(
    private httpClient: HttpClient
  ) {

  }

  generateKey() {
    return this.httpClient.get(this.url + '/generateKey')
  }

  generatePublicKey(PvtKey) {
    return this.httpClient.get(this.url + '/recoverPublickey/' + PvtKey)
  }
  getBatchStatus(id) {
    return this.httpClient.get(this.url + '/api/batch_statuses?id=' + id + '&wait')
  }
  getIDDetails = (userID) => {
    return this.httpClient.get(this.url + '/id/' + userID)
  }
  getEntity = (entity) => {
    return this.httpClient.get(this.url + '/entity/' + entity)
  }
  genratePubPriv = async () => {
    return await this.httpClient.get(this.url + '/generateKey').toPromise()
  }

  getUserName = async (query) => {
    query = {
      "db": "users",
      "query": {
        "selector": {
          "owner": query.pubKey
        },
        "fields": [
          "name"
        ]
      }
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.httpClient.post(this.url + "/find", query, httpOptions).toPromise()
  }


  getallNamePub = async (query) => {
    let couchQuery = {
      "db": "users",
      "query": {
        "selector":query,
        "fields": [
          "name",
          "owner"
        ]
      }
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.httpClient.post(this.url + "/find", couchQuery, httpOptions).toPromise()
  }


  getUserNameByID = async (query) => {
    query = {
      "db": "users",
      "query": {
        "selector": {
          "_id": query.ID
        },
        "fields": [
          "name"
        ]
      }
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.httpClient.post(this.url + "/find", query, httpOptions).toPromise()
  }




  createVendor = (payload) => {
    var blockchainPayload = {
      "action": 'createVendor',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }

  registerEmployee = (payload) => {
    var blockchainPayload = {
      "action": 'registerEmployee',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }
    console.log(blockchainPayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }

  registerEmployeeDB = (payload) => {
    var couchpayload = {
      "db": 'users',
      "id": payload['id'],
      "data": payload['data']
    }
    console.log(payload, couchpayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url + "/insert", couchpayload, httpOptions)
  }



  registerCustomerDB = (payload) => {
    var couchpayload = {
      "db": 'users',
      "id": payload['id'],
      "data": payload['data']
    }
    console.log(payload, couchpayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url + "/insert", couchpayload, httpOptions)
  }
  registerGoodsnServiceDB(payload: {}) {
    var couchpayload = {
      "db": 'goodsnservices',
      "id": payload['id'],
      "data": payload['data']
    }
    console.log(payload, couchpayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url + "/insert", couchpayload, httpOptions)
  }

  registerOrders(payload: {}) {
    var couchpayload = {
      "db": 'orders',
      "id": payload['id'],
      "data": payload['data']
    }
    console.log(payload, couchpayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url + "/insert", couchpayload, httpOptions)
  }

  async getOrderRev(payload: string) {
    var query = {
      "db": "orders",
      "query": {
        "selector": {
          "_id": payload
        },
        "fields": [
          "_rev"
        ]
      }
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.httpClient.post(this.url + "/find", query, httpOptions).toPromise()
  }

  updateOrders(payload: {}) {
    let that = this;
    return this.getIDDetails(payload['id']).subscribe(async (val) => {
      if (val) {
        var orderRev = await that.getOrderRev(payload['id'])
        console.log(orderRev,payload)
        if (orderRev['docs'][0].hasOwnProperty('_rev')) {
          payload['data']['_rev'] = orderRev['docs'][0]['_rev'];
          var couchpayload = {
            "db": 'orders',
            "id": payload['id'],
            "data": payload['data']
          }
          console.log(payload, couchpayload)

          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          };
          return await this.httpClient.post(this.url + "/insert", couchpayload, httpOptions)
        }
      }
    })

  }


  getUserDataDB = (payload) => {
    var couchpayload = {
      "db": 'users',
      "query": {
        "selector": {
          "owner": payload.publicKey
        }
      }
    }
    console.log(payload, couchpayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url + "/find", couchpayload, httpOptions)
  }

  registerCustomerOrg = (payload) => {
    var blockchainPayload = {
      "action": 'registerCustomerOrg',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }
    console.log(blockchainPayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }

  registerCustomerOrgEmployee = (payload) => {
    var blockchainPayload = {
      "action": 'registerCustomerOrgEmployee',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }
    console.log(blockchainPayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }

  createGoods = (payload) => {
    var blockchainPayload = {
      "action": 'createGoods',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }
    console.log(blockchainPayload)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }



  // getrevgoods = async (query) => {
  //    query = {
  //      "db": "orders", //db: order
  //      "query": {
  //        "selector": {
  //          "owner": query.id
  //        },
  //        "fields": [
  //          "_rev" //get : '_rev'
  //        ]
  //      }
  //    }
  //    const httpOptions = {
  //      headers: new HttpHeaders({
  //        'Content-Type': 'application/json'
  //      })
  //    };
  //    return await this.httpClient.post(this.url + "/find", query, httpOptions).toPromise()
  //  }


  createOrder = (payload) => {
    // this.getrevgoods(payload)
    var blockchainPayload = {
      "action": 'createOrder',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }
    console.log(blockchainPayload)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }



  orderStatus = (payload) => {
    var blockchainPayload = {
      "action": 'orderStatus',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }
    console.log(blockchainPayload)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }

  acceptOrder = (payload) => {
    var blockchainPayload = {
      "action": 'acceptOrder',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }

  orderPayment = (payload) => {
    var blockchainPayload = {
      "action": 'orderPayment',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }
  orderPaymentStatus = (payload) => {
    var blockchainPayload = {
      "action": 'orderPaymentStatus',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(this.url, blockchainPayload, httpOptions)
  }

  transferOwnership = (payload) => {
    var blockchainPayload = {
      "action": 'transferOwnership',
      "public": localStorage.getItem('public'),
      "private": localStorage.getItem('private'),
      "payloaddata": payload
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.post(this.url, blockchainPayload, httpOptions)

  }

  bulkUpload = (payload) => {
    console.log(payload)
    let formData: FormData = new FormData();
    console.log(payload.action);
    console.log(localStorage.getItem('private'));
    console.log(payload.file);
    formData.append('action', payload.action);
    formData.append('private', localStorage.getItem('private'));
    formData.append('avatar', payload.file);
    console.log(formData)
    window['formData'] = formData
    // var blockchainPayload = {
    //   "action": 'transferOwnership',
    //   "public": localStorage.getItem('public'),
    //   "private": localStorage.getItem('private'),
    //   "payloaddata": payload
    // }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };

    return this.httpClient.post(this.url + '/csv/', formData)
  }
}
