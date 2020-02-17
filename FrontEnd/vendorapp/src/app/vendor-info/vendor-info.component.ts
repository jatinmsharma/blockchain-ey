import { Component, OnInit } from '@angular/core';
import { VendorInfoServiceService } from "./vendor-info-service.service";
import { Config } from './info';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { FormBuilder, Validators, FormControl, NgSelectOption, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
// import * as $ from jquery';


@Component({
  selector: 'app-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: ['./vendor-info.component.css']
})
export class VendorInfoComponent implements OnInit {
  id: any;
  email: any;
  address: {};
  userid: any;
  name: any;
  publicKey: any;
  privateKey: any;
  publicKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  privateKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  vmtagKey = [];
  rgtagValue = [];
  tagarr = [];
  bulkFile = '';
  rgTagCount = 0;
  uploadFile: any;
  bulkUploadAction: null;
  bulkupload:boolean=false;
  bulkupload1:boolean=false;
  addCustomer = this.fb.group({
    name: ['', [Validators.required]],
    // orgName: ['', [Validators.required, Validators.maxLength(16)]],
    publicKey: ['', Validators.required],
    // role: ['1', Validators.required],
    email: ['', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])],
    address: [''],
    city:['',Validators.required],
    state:['',Validators.required],
    pincode:['',Validators.required],
    GSTNumber: ['', Validators.required],
    contactNumber: ['']
  });

  Roles = [
    { role: "Employee", value: 1 },
    { role: "Admin", value: 2 }
  ]
  registerUser = this.fb.group({
    name: ['', [Validators.required]],
    employeeAddress: ['', Validators.required],
    role: ['1', Validators.required],
    email: ['', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])],
    contactNumber: [''],

  });


  username = ""
  constructor(
    private data: UserService,
    private http: HttpClient,
    private Auth: AuthService,
    private router: Router,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService,
    private fb: FormBuilder) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()

    
  }

  ngOnInit() {
  }

  setlogout() {
    this.Auth.setLogout();
    this.router.navigate(['/home']);
  }
  getUserDetails() {
    let that = this;
    this.blockchainService.getIDDetails(localStorage.getItem('userID')).subscribe(val => {
      if (val) {
        console.log(val);
        that.name = (val[this.username][0]['vendor'].name)
        that.id = (val[this.username][0]['vendor'].ID)
        that.address = JSON.parse((val[this.username][0]['vendor'].address).replace(/'/g, "\""))
        that.email = (val[this.username][0]['vendor'].email)
        that.publicKey = (val[this.username][0]['owner']);
        that.privateKey = localStorage.getItem('private');
        console.log(that.name, that.id, that.address, that.email);
        window['aa'] = that.address;
        this.showAddress()
      }
    })
  }

  showAddress() {
    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    var y = ""
    for (var key in this.address) {
      var x = "<div class='field-header'>";
      if (col.indexOf(key) === -1) {
        col.push(key);
        // x += "<span class='h5 mr-3' >" + key.toUpperCase() + "</span>";
        // x += "</div>";
        x += "<div class='field-info' style='padding-left:10px;'>" + this.address[key] + "</div>"
      }
      x += "</div>";
      y+=x;
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("fullAddress");
    divContainer.innerHTML = y;
    // divContainer.append(y);
  }

  addTags(event) {
    console.log(event, event.value);
      
    window['ra'] = event;
    this.bulkFile = event.value;

    if ((<HTMLInputElement>document.getElementById('employeeRadio')).checked)
      this.bulkFile = "registerEmployee"

    if ((<HTMLInputElement>document.getElementById('customerRadio')).checked)
      this.bulkFile = "registerCustomerOrg"

    // console.log('radio check done', $("input[name='rgresult']:checked").val());
    // if ($("input[name='rgresult']:checked").val() == 'yes')
    //   // this.tagStatus = true;
    // else {
      // this.tagStatus = false;
    //   // this.tagarr = [];
    //   // this.rgTagCount = 0;
    //   // this.rgtagValue = [];
    //   // this.rgtagKey = [];
    // }

  }
  getValueRg(event) {
    console.log(event)
    this.rgtagValue.push(event.target.value);
    console.log(this.rgtagValue);
  }
  dltTags(i: any) {
    if(this.rgTagCount>0){

    console.log(i);
    this.rgTagCount--;
    console.log(this.rgTagCount);
    let tag_array = this.tagarr;
    console.log(tag_array);
    tag_array.splice(i, 1);
    this.rgtagValue.splice(i + 1, 1);
    console.log(this.rgtagValue);
  }else{
    this.rgtagValue.splice(0, 1);
  }

  }

  addTag() {
    class pp {
      tagkey: string;
      tagvalue: string;
    }

    if (this.rgTagCount < 3) {
      this.rgTagCount++;
      console.log(this.rgTagCount);
      let object = new pp();

      this.tagarr.push(object);
      // console.log();
      // this.tagStatusValue++;
      console.log(this.tagarr);
    }

  }
  showKey(PubPvt: number) {
    if (PubPvt == 1) {
      if (this.publicKeyHide == '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••') {
        this.publicKeyHide = this.publicKey
      } else {
        this.publicKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
      }
    } else if (PubPvt == 2) {
      if (this.privateKeyHide == '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••') {
        this.privateKeyHide = this.privateKey
      } else {
        this.privateKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
      }
    }
  }

  download() {
    var data = JSON.stringify({
      "PublicKey": this.publicKey,
      "PrivateKey": this.privateKey
    })
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', this.name + ".priv");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  registeremployee() {
    console.log(this.registerUser.value)
    let that = this;
    var payload = this.registerUser.value;
    console.log('first', payload)
    this.registerUser =null;
    payload['vendorName'] = this.name;

    this.blockchainService.registerEmployee(payload).subscribe(val => {
      if (val) {
        console.log(val);
        if (JSON.parse(val['response']['body']).data[0].status == 'COMMITTED') {
          window.alert("User Register Successfull \n UserID:" + val['userid'])
          var couchpayload = {};
          couchpayload['data'] = {};
          couchpayload['data'] = payload;
          couchpayload['id'] = val['userid'];
          couchpayload['data']['userType'] = 2;
          couchpayload['data']['publicKey'] = payload['employeeAddress'];
          couchpayload['data']['owner'] = payload['employeeAddress'];
          delete couchpayload['data']['employeeAddress']
          that.blockchainService.registerEmployeeDB(couchpayload).subscribe(val => {
            if (val) {
              console.log(val)
              this.userid = val['userid']
              this.Auth.setuserid(this.userid);
            }
          }, (err) => {
            console.log(err)
          })
        } else {
          window.alert("User Registration Failed \n Status:" + JSON.parse(val['response']['body']).data[0].status)
        }
      }
    })

  }

  updateFileData(files: FileList) {
    let that = this;
    console.log(files);
    if (files && files.length > 0) {
      let file: File = files.item(0);
      this.uploadFile = file;
      this.bulkupload=true;
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      // if (file.type == "text/csv") {
      //   let reader: FileReader = new FileReader();
      //   reader.readAsText(file);
      //   reader.onload = (e) => {
      //     let csv: string = reader.result as string;
      //     console.log(csv);
      //   }
      // }
    }
  }

  bulkRegister() {
    console.log(this.bulkFile);
    let that = this;
    var blockchainPayload = {}
    blockchainPayload['action'] = this.bulkFile;
    console.log("Action name ",blockchainPayload['action']);
    if (this.uploadFile) {
      console.log("Entering here");
      blockchainPayload['file'] = this.uploadFile;
      console.log("Now here",this.uploadFile);
      this.blockchainService.bulkUpload(blockchainPayload).subscribe((val) => {
        if (val) {
          console.log(val)
          var allResponseData = {}
          allResponseData['COMMITTED'] = [];
          allResponseData['INVALID'] = [];
          var Registered = {};
          Registered['newEmployee'] = []
          Registered['AlreadyOnNetwork'] = []
          val['response'].forEach(async element => {
            console.log(element)
            if (element['response'].status == 'COMMITTED') {
              var couchpayload = {};
              couchpayload['data'] = {};
              couchpayload['data'] = element['request'];
              couchpayload['id'] = element['response']['UserID'];
              couchpayload['data']['userType'] = 4;
              couchpayload['data']['publicKey'] = element['request']['publicKey'];
              couchpayload['data']['owner'] = element['request']['publicKey'];
              delete couchpayload['data']['employeeAddress']
              console.log(couchpayload)
              allResponseData['COMMITTED'].push({
                data: element['request'],
                UserID: element['response']['UserID']
              })
              await that.blockchainService.registerEmployeeDB(couchpayload).subscribe(val => {
                if (val['ok']) {
                  console.log(val)
                  Registered['newEmployee'].push(val)
                  // this.userid = val['userid']
                  // this.Auth.setuserid(this.userid);
                }
              }, (err) => {
                // console.log(err)
                Registered['AlreadyOnNetwork'].push(couchpayload['id'])
              })
            }
            else {
              allResponseData['INVALID'].push({
                data: element['request'],
                UserID: element['response']['invalid_transactions']
              })
            }
          })

          console.log(allResponseData)
          console.log(Registered)

        }
      },
        (err) => {
          console.log(err.message)
        })

    }
  }


  addcustomer() {
    console.log(this.addCustomer.value)
    let that = this;
    var payload = this.addCustomer.value;
    payload.address={};
    for(var i=0;i<this.rgtagValue.length;i++){
      payload.address['address'+i+1] = this.rgtagValue[i];
    }
    payload.address['City'] = payload['city'];
    payload.address['State'] = payload['state'];
    payload.address['pincode']=payload['pincode']
    delete payload['city'];
    delete payload['state'];
    delete payload['pincode'];
    payload['vendor'] = {};
    payload['vendor']['name'] = this.name;
    payload.address = JSON.stringify(payload.address);
    console.log('second', payload)
    this.blockchainService.registerCustomerOrg(payload).subscribe(val => {
      if (val) {
        console.log(val);
        if (JSON.parse(val['response']['body']).data[0].status == 'COMMITTED') {  
          window.alert("User Register Successfull \n UserID:" + val['userid'])
          var couchpayload = {};
          couchpayload['data'] = {};
          couchpayload['data'] = payload;
          couchpayload['id'] = val['userid'];
          couchpayload['data']['userType'] = 3;
          couchpayload['data']['vendorName'] = payload['vendor']['name'];
          couchpayload['data']['publicKey'] = payload['publicKey'];
          couchpayload['data']['owner'] = payload['publicKey'];
          couchpayload['data'].address = JSON.parse(payload.address);
          delete couchpayload['data']['vendor']
          that.blockchainService.registerCustomerDB(couchpayload).subscribe(val => {
            if (val) {
              console.log(val)
              this.userid = val['userid']
              this.Auth.setuserid(this.userid);
            }
          }, (err) => {
            console.log(err)
          })
        } else {
          window.alert("User Register Successfull \n UserID:" + JSON.parse(val['response']['body']).data[0].status)
          this.addCustomer.reset();
        }

        window['val'] = val;
      }
    })

  }
  
  clearModel(event){
    this.addCustomer.reset();
    this.registerUser.reset();
    for(var i=0;i<this.rgtagValue.length;i++)
    {
      this.dltTags(i);
    }
    (<HTMLInputElement>document.getElementById("firstAddressLine")).value="";  
  }

  // changeListenercust(files: FileList) {
  //   let that = this;
  //   console.log(files);
  //   var blockchainPayload = {}
  //   blockchainPayload['action'] = 'registerCustomerOrg';
  //   if (files && files.length > 0) {
  //     let file: File = files.item(0);
  //     blockchainPayload['file'] = file
  //     console.log(file.name);
  //     console.log(file.size);
  //     console.log(file.type);
  //     if (file.type == "text/csv") {
  //       let reader: FileReader = new FileReader();
  //       reader.readAsText(file);
  //       reader.onload = (e) => {
  //         let csv: string = reader.result as string;
  //         console.log(csv);
  //       }
  //     }
  //     this.blockchainService.bulkUpload(blockchainPayload).subscribe((val) => {
  //       if (val) {
  //         console.log(val)
  //         var allResponseData = {}
  //         allResponseData['COMMITTED'] = [];
  //         allResponseData['INVALID'] = [];
  //         var Registered = {};
  //         Registered['newCustomer'] = []
  //         Registered['AlreadyOnNetwork'] = []
  //         val['response'].forEach(async element => {
  //           console.log(element);
  //           if (element['response'].status == 'COMMITTED') {
  //             var couchpayload = {};
  //             couchpayload['data'] = {};
  //             couchpayload['data'] = element['request'];
  //             couchpayload['id'] = element['response']['UserID'];
  //             couchpayload['data']['userType'] = 3;
  //             couchpayload['data']['publicKey'] = element['request']['publicKey'];
  //             couchpayload['data']['owner'] = element['request']['publicKey'];
  //             delete couchpayload['data']['publicKey']
  //             console.log(couchpayload)
  //             allResponseData['COMMITTED'].push({
  //               data: element['request'],
  //               UserID: element['response']['UserID']
  //             })
  //             await that.blockchainService.registerCustomerDB(couchpayload).subscribe(val => {
  //               if (val['ok']) {
  //                 console.log(val)
  //                 Registered['newCustomer'].push(val)
  //                 // this.userid = val['userid']
  //                 // this.Auth.setuserid(this.userid);
  //               }
  //             }, (err) => {
  //               // console.log(err)
  //               Registered['AlreadyOnNetwork'].push(couchpayload['id'])
  //             })
  //           }
  //           else {
  //             allResponseData['INVALID'].push({
  //               data: element['request'],
  //               UserID: element['response']['invalid_transactions']
  //             })
  //           }
  //         })

  //         console.log(allResponseData)
  //         console.log(Registered)

  //       }
  //     },
  //       (err) => {
  //         console.log(err.message)
  //       })

  //   }
  // }


}
