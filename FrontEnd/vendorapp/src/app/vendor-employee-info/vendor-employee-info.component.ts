import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { FormBuilder, Validators, FormControl, NgSelectOption } from '@angular/forms'

@Component({
  selector: 'app-vendor-employee-info',
  templateUrl: './vendor-employee-info.component.html',
  styleUrls: ['./vendor-employee-info.component.css']
})
export class VendorEmployeeInfoComponent implements OnInit {

  ID: any;
  name: any;
  email: any;
  contactNumber: any;
  publicKey: any;
  privateKey: any;
  publicKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  privateKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  role: any;
  vname: any;

  username: any;
  Roles = { 1: "Employee", 2: "Admin" }

  constructor(private data: UserService,
    private http: HttpClient,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService,
    private fb: FormBuilder) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()
  }

  ngOnInit() {
  }

  getUserDetails() {
    let that = this;
    this.blockchainService.getIDDetails(localStorage.getItem('userID')).subscribe(val => {
      if (val) {
        console.log(localStorage);
        console.log(val);
        that.ID = (val[this.username][0]['employee'].ID)
        that.name = (val[this.username][0]['employee'].name)
        that.contactNumber = (val[this.username][0]['employee'].contactNumber)
        that.publicKey = (val[this.username][0]['employee'].publicKey)
        that.role = "Vendor-Org-" + that.Roles[(val[this.username][0]['employee'].role)]
        that.email = (val[this.username][0]['employee'].email)
        that.vname = (val[this.username][0]['vendor'].name)
        that.privateKey = localStorage.getItem('private');
        localStorage.setItem('userName', this.name);
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

}
