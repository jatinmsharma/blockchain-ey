import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerComponent implements OnInit {

  message = "Loading..."
  username = "";
  name = "";


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: UserService,
    private http: HttpClient,
    private httpClient: HttpClient,
    private Auth: AuthService,
    private blockchainService: BlockchainService,

  ) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails();
    this.vendorinfo();
  }
  setlogout() {
    this.Auth.setLogout();
    this.router.navigate(['/home']);
  }

  ngOnInit() {
 
   
    console.log("hello");
  }
  vendortable() {

    this.router.navigate(['table'], { relativeTo: this.route });


  }
  vendorinfo() {
    this.router.navigate(['info'], { relativeTo: this.route });
  }

  // vendorcustomer() {
  //   this.router.navigate(['customer'], { relativeTo: this.route });
  // }
  employee() {
    this.router.navigate(['employee'], { relativeTo: this.route });
  }
  getUserDetails() {
    let that = this;
    this.blockchainService.getIDDetails(localStorage.getItem('userID')).subscribe(val => {

      if (val) {
        console.log(val);
        that.name = (val[this.username][0]['customer'].name)

      }
    })
  }

}
