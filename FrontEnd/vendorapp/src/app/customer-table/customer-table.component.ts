import { Component, OnInit } from '@angular/core';
import{ ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit {

  constructor(private route:ActivatedRoute, private router: Router ) { }

  ngOnInit() {
    this.orders();
  }

  // employee(){
  //   this.router.navigate(['employee'], {relativeTo: this.route});
  // }
  goods(){
    this.router.navigate(['goods'], {relativeTo: this.route});
  }
  orders(){
    this.router.navigate(['orders'], {relativeTo: this.route});
  }
}
