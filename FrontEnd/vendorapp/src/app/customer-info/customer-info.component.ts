import { Component, OnInit } from '@angular/core';
import { CustomerInfoServiceService } from "./customer-info-service.service";
import { Config } from './info';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { FormBuilder, Validators, FormControl, NgSelectOption } from '@angular/forms'
import { stringify } from '@angular/core/src/render3/util';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {
  id: any;
  email: any;
  address: any;
  name: any;
  contactNumber: any;
  GSTNumber: any;
  publicKey: any;
  bulkUploadAction: null;
  bulkupload:boolean=false;
  bulkupload1:boolean=false;
  uploadFile: any;
  bulkFile = '';
  privateKey: any;
  publicKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  privateKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  registerEmployee = this.fb.group({
    name: ['', [Validators.required]],
    publicKey: ['', Validators.required],
    email: ['',  Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])],
    role: ['1'],
    contactNumber: ['']
  });
  Roles = [
    { role: "Employee", value: 1 },
    { role: "Admin", value: 2 }
  ]
  username = ""
  constructor(
    private data: UserService,
    private http: HttpClient,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService,
    private fb: FormBuilder
  ) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails();
  }

  getUserDetails() {
    let that = this;
    this.blockchainService.getIDDetails(localStorage.getItem('userID')).subscribe(val => {

      if (val) {
        console.log(val);
        that.name = (val[this.username][0]['customer'].name)
        that.id = (val[this.username][0]['customer'].ID)
        that.address = JSON.parse((val[this.username][0]['customer'].address).replace(/'/g, "\""))
        that.email = (val[this.username][0]['customer'].email)
        that.GSTNumber = (val[this.username][0]['customer'].GSTNumber)
        that.contactNumber = (val[this.username][0]['customer'].contactNumber)
        that.publicKey = (val[this.username][0]['customer'].publicKey)
        that.privateKey = localStorage.getItem('private');
        console.log(that.name, that.id, that.address, that.email);
        this.showAddress()
      }
    })
  }


  showAddress() {
    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    var y = ""
var flag =true;
    var duplicates = "";
    for (var key in this.address) {
 if(flag){
        flag = false;
        duplicates = this.address[key];
        continue;
      }

        if(duplicates == this.address[key]){
          continue;
        }
        duplicates=this.address[key];
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

  registerCustomerOrgEmployee() {
    console.log(this.registerEmployee.value)
    let that = this;
    var payload = this.registerEmployee.value;
    payload['orgName'] = this.name;
    console.log(payload)
    this.blockchainService.registerCustomerOrgEmployee(payload).subscribe(val => {
      if (val) {
        console.log(val);
        if (JSON.parse(val['response']['body']).data[0].status == 'COMMITTED') {
          window.alert("Employee Registration Successfull \n UserID:" + val['userid'])
          var couchpayload = {};
          couchpayload['data'] = {};
          couchpayload['data'] = payload;
          couchpayload['id'] = val['userid'];
          couchpayload['data']['userType'] = 4;
          couchpayload['data']['customerID'] = localStorage.getItem('userID');
          couchpayload['data']['customerName'] = localStorage.getItem('name');
          couchpayload['data']['GSTNumber'] = localStorage.getItem('GSTNumber');
          // couchpayload['data']['publicKey'] = payload['employeeAddress'];
          couchpayload['data']['owner'] = payload['publicKey'];
          // delete couchpayload['data']['employeeAddress']
          that.blockchainService.registerEmployeeDB(couchpayload).subscribe(val => {
            if (val) {
              console.log(val)
              // this.userid = val['userid']
              // this.Auth.setuserid(this.userid);
            }
          }, (err) => {
            console.log(err)
          })
        } else {
          window.alert("Employee Registration Error: \n " + JSON.parse(val['response']['body']).data[0].status)
        }
      }
    })
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
    var data=JSON.stringify({
      "PublicKey": this.publicKey,
      "PrivateKey": this.privateKey
    })
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', this.name+".priv");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  changeListener(files: FileList) {
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




  ngOnInit() {
  }


}
