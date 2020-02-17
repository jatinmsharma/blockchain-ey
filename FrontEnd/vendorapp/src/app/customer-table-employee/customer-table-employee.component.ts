import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator, MatTableDataSource } from '@angular/material';


export interface RawMaterial {
  ID: String;
  name: String;
  email: String;
  contactNumber: String;
  publicKey: Number;
  role: String;
}
@Component({
  selector: 'app-customer-table-employee',
  templateUrl: './customer-table-employee.component.html',
  styleUrls: ['./customer-table-employee.component.css']
})
export class CustomerTableEmployeeComponent implements OnInit {
  email: any;
  public: any;
  address: any;
  name: any;
  number: any;
  role: any;
  package_list = [];
  displayedColumns: string[] = [
    // 'id',
    'name',
    'email',
    'contact',
    // 'publicKey',
    'role'
  ];
  Roles = ["Employee","Admin"]

  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator

  username = ""

  constructor(private data: UserService, private httpClient: HttpClient, private blockchainService: BlockchainService, ) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()
  }
  getUserDetails() {
    let that = this;
    this.blockchainService.getEntity('customerEmployee').subscribe(val => {
      if (val) {
        console.log(val);
        for (var i = 0; i < val['entity'].length; i++) {
          // console.log(val['entity'][i]);
          if (val['entity'][i].hasOwnProperty('customer') && val['entity'][i].hasOwnProperty('employee') && val['entity'][i]['customer'].ID == that.username) {
            console.log(val['entity'][i]);
            that.package_list.push(val['entity'][i]['employee'])
          }
        }
        this.dataSource = new MatTableDataSource<RawMaterial>(that.package_list);
        this.dataSource.paginator = this.paginator;
      } 
    })  
  }

  ngOnInit() {
  }

}
