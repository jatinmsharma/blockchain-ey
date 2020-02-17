import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  name = "";
  username = ""
  constructor(
    private data: UserService,
    private http: HttpClient,
    private route: ActivatedRoute, private router: Router,
    private httpClient: HttpClient,
    private blockchainService: BlockchainService,
    private Auth: AuthService,
  ) {
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
        console.log(that.name);
      }
    })


  }
}
