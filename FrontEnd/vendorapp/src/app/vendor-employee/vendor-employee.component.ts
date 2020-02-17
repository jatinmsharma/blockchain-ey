import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-vendor-employee',
  templateUrl: './vendor-employee.component.html',
  styleUrls: ['./vendor-employee.component.css']
})
export class VendorEmployeeComponent implements OnInit {

  message = "Loading...";

  username = "";
  name = "";


  constructor(private data: UserService,
    private http: HttpClient,
    private httpClient: HttpClient, private route: ActivatedRoute, private router: Router,
    private blockchainService: BlockchainService,
    private Auth: AuthService
  ) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()
  }



  // setlogout(){
  // this.Auth.setLogout();
  // this.router.navigate(['/home']);
  // }

  ngOnInit() {
    // this.user.getSomeData().subscribe(data => {
    //   this.message = data.message
    //   if(!data.success){
    //     localStorage.removeItem('loggedIn')
    //   }
    // })
    this.employee();
  }
  setlogout() {
    this.Auth.setLogout();
    this.router.navigate(['/home']);
  }
  vendortable() {

    this.router.navigate(['goods'], { relativeTo: this.route });


  }
  vendorinfo() {
    this.router.navigate(['orders'], { relativeTo: this.route });
  }

  // vendorcustomer() {
  //   this.router.navigate(['customer'], { relativeTo: this.route });
  // }
  employee() {
    this.router.navigate(['info'], { relativeTo: this.route });
  }
  getUserDetails() {
    let that = this;
    this.blockchainService.getIDDetails(localStorage.getItem('userID')).subscribe(val => {
      if (val) {
        console.log(val);

        that.name = (val[this.username][0]['employee'].name)

      }
    })
  }
}
