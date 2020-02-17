import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlockchainService } from '../blockchain.service';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Blockchain';
  // username: any;
  constructor(
    private route: ActivatedRoute,
    private Auth: AuthService,
    private router: Router,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService
  ) {
  }
  ngOnInit() {
  }
  registration() {
    this.router.navigate(['register'], { relativeTo: this.route });
  }
  loginUser(event) {
    let that = this;
    event.preventDefault()
    const target = event.target
    // const username = target.querySelector('#username').value
    const privateKey = target.querySelector('#PrivateKey').value
    this.blockchainService.generatePublicKey(privateKey).subscribe(pubpvt => {
      if (pubpvt) {
        that.blockchainService.getUserDataDB({ publicKey: pubpvt['public'] }).subscribe(userInfo => {
          if (userInfo) {
            console.log(userInfo);
            this.Auth.setLoggedIn(true,pubpvt['public'], pubpvt['private'], userInfo['docs'][0]['_id'])
            localStorage.setItem('name', userInfo['docs'][0]['name'])

            if (userInfo['docs'][0]['userType'] === 1) {
              console.log("vendor")
              this.router.navigate(['/vendor'])
            }
            else if (userInfo['docs'][0]['userType'] === 2) {
              console.log("vendorEmployee")
              localStorage.setItem('vendorName', userInfo['docs'][0]['vendorName'])
              this.router.navigate(['/vendorEmployee'])
            } else if (userInfo['docs'][0]['userType'] === 3) {
              console.log("customer")
              this.router.navigate(['/customer'])
            } else if (userInfo['docs'][0]['userType'] === 4) {
              console.log("customerEmployee")
              localStorage.setItem('customerName', userInfo['docs'][0]['customerName'])
              localStorage.setItem('customerOrgID', userInfo['docs'][0]['customerID'])
              this.router.navigate(['/customerEmployee'])
            }
          }
          else {
            console.log("Error: " + userInfo);

          }
        },
          err => {
            console.log(err)
          })
      }
      else {
        console.log("Error: " + pubpvt)
      }
    },
      err => {
        console.log(err)
      })
  }

async download() {
    var data = JSON.stringify(await this.blockchainService.genratePubPriv());
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', "new.pubpriv");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
