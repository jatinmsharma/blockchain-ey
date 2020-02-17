import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { FormBuilder, Validators, FormControl, NgSelectOption } from '@angular/forms'

@Component({
  selector: 'app-customer-employee-info',
  templateUrl: './customer-employee-info.component.html',
  styleUrls: ['./customer-employee-info.component.css']
})
export class CustomerEmployeeInfoComponent implements OnInit {
  id: any;
  email: any;
  address: any;
  name: any;
  contactNumber: any;
  role: any;
  publicKey: any;
  privateKey: any;
  publicKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  privateKeyHide = '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'

  GSTNumber: any;
  Roles = { 1: "Employee", 2: "Admin" }

  username = ""
  constructor(
    private data: UserService,
    private http: HttpClient,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService,
    private fb: FormBuilder) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()
  }

  getUserDetails() {
    let that = this;
    this.blockchainService.getIDDetails(localStorage.getItem('userID')).subscribe(val => {
      if (val) {
        console.log(val);
        that.name = (val[this.username][0]['employee'].name)
        that.id = (val[this.username][0]['employee'].ID)
        that.email = (val[this.username][0]['employee'].email)
        that.contactNumber = (val[this.username][0]['employee'].contactNumber)
        that.role = "Customer-Org-"+that.Roles[(val[this.username][0]['employee'].role)]
        that.publicKey = (val[this.username][0]['employee'].PublicKey)
        that.GSTNumber = (val[this.username][0]['customer'].GSTNumber)
        localStorage.setItem('GSTNumber', that.GSTNumber)
        localStorage.setItem('role', val[this.username][0]['employee'].role)
        that.privateKey = localStorage.getItem('private');
        console.log(that.name, that.id, that.publicKey, that.email);
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

  ngOnInit() {
  }

}
