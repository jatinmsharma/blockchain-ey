import { Component, OnInit } from '@angular/core';
import{ ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-vendor-customer',
  templateUrl: './vendor-customer.component.html',
  styleUrls: ['./vendor-customer.component.css']
})
export class VendorCustomerComponent implements OnInit {

  constructor(private route:ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.organization();
  }
  organization(){
    console.log("hello");
    this.router.navigate(['organization'], {relativeTo: this.route});
  }
}
