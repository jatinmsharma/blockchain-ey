import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatSort,MatPaginator, MatTableDataSource } from '@angular/material';

export interface RawMaterial {
  ID: String;
  name: String;
  email: String;
  contactNumber: String;
  publicKey: Number;
  role: String;
}

@Component({
  selector: 'app-vendor-table-employee',
  templateUrl: './vendor-table-employee.component.html',
  styleUrls: ['./vendor-table-employee.component.css']
})
export class VendorTableEmployeeComponent implements OnInit {
  email: any;
  public: any;
  address: any;
  name: any;
  number: any;
  role: any;
  package_list = [];
  displayedColumns: string[] = [
    //  'id',
    'name',
    'email',
    'contact',
    // 'publicKey',
    'role'
  ];

  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  username = ""
  constructor(private data: UserService, private httpClient: HttpClient, private blockchainService: BlockchainService, ) {
  this.username = localStorage.getItem('userID');
    this.getUserDetails()
  }
  getUserDetails() {
    let that = this;
    this.blockchainService.getEntity('employee').subscribe(val => {
      if (val) {
        console.log(val);
        for (var i = 0; i < val['entity'].length; i++) {
          console.log(val['entity'][i]);
          if (val['entity'][i].hasOwnProperty('vendor') && val['entity'][i].hasOwnProperty('employee')) {
            console.log(val['entity'][i]);
            that.package_list.push(val['entity'][i]['employee'])
          }
        }
        this.dataSource = new MatTableDataSource<RawMaterial>(that.package_list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  ngOnInit() {
  }

}
