import { Component, OnInit } from '@angular/core';
import{ ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-vendor-table',
  templateUrl: './vendor-table.component.html',
  styleUrls: ['./vendor-table.component.css']
})
export class VendorTableComponent implements OnInit {

  constructor(private route:ActivatedRoute, private router: Router ) { }

  ngOnInit() {
    this.goods();
  }
  // employee(){
  //   this.router.navigate(['employee'], {relativeTo: this.route});
  // }
  goods(){
    this.router.navigate(['goods'], {relativeTo: this.route});
  }
  customer(){
    this.router.navigate(['customer'], {relativeTo: this.route});
  }
}
