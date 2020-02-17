import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { AuthService } from '../auth.service';

// import {
//     makeKeyPair,
//     getState,
//     submitUpdate,
//     getStateByEntityName,
//     getIDDetails} from '../shared/state.js';
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  message = "Loading...";
  name = "";
  username = "";


  constructor(
    private data: UserService,
    private http: HttpClient,
    private route: ActivatedRoute, private router: Router,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService,
    private Auth: AuthService,
  )
   {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()
  }
  setlogout() {
    this.Auth.setLogout();
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.vendorinfo();
  }

  vendortable() {
    this.router.navigate(['table'], { relativeTo: this.route });
  }

  vendorinfo() {
    this.router.navigate(['info'], { relativeTo: this.route });
  }

  vendororder() {
    this.router.navigate(['orders'], { relativeTo: this.route });
  }

  employee() {
    this.router.navigate(['employee'], { relativeTo: this.route });
  }

  getUserDetails() {
    let that = this;
    this.blockchainService.getIDDetails(localStorage.getItem('userID')).subscribe(val => {
      if (val) {
        console.log(val);
        that.name = (val[this.username][0]['vendor'].name)
        console.log(that.name);
      }
    })


  }
}
