import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator, MatTableDataSource } from '@angular/material';
export interface RawMaterial {
  publicKey: String;
  name: String;
  email: string;
  contact: string;
  address: string;
  gstNo: string;
}

@Component({
  selector: 'app-vendor-organization',
  templateUrl: './vendor-organization.component.html',
  styleUrls: ['./vendor-organization.component.css']
})
export class VendorOrganizationComponent implements OnInit {
  package_list = [];
  displayedColumns: string[] = [
    'name',
    'email',
    'address',
    'contact',
    'gstNo',
    //  'publicKey'
  ];
  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator

  username = ""
  constructor(private data: UserService, private httpClient: HttpClient, private blockchainService: BlockchainService, ) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()
  }
  getUserDetails() {
    let that = this;
    this.blockchainService.getEntity('customerOrg').subscribe(val => {
      if (val) {
        console.log(val);
        for (var i = 0; i < val['entity'].length; i++) {
          console.log(val['entity'][i]);
          if (val['entity'][i].hasOwnProperty('customer')) {
            try {

              val['entity'][i]['customer'].address = this.createPopOver(JSON.parse((val['entity'][i]['customer'].address).replace(/'/g, "\"")))

              console.log(val['entity'][i]);

              that.package_list.push(val['entity'][i]['customer'])
            } catch (err) {
              console.log(err);
            }
          }
        }
        this.dataSource = new MatTableDataSource<RawMaterial>(that.package_list);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  createPopOver(data: {}) {
    try {

      // let jsonData = JSON.parse(data.replace(/'/g, "\""))
      let jsonData = data
      var col = []
      var fullAddress = ""
      for (var key in jsonData) {
        if (col.indexOf(key) === -1) {
          col.push(key);
          fullAddress += jsonData[key] + ", "
        }
      }
      fullAddress = fullAddress.substr(0, fullAddress.length - 2)
      var newData = {
        city: data['City'],
        address: fullAddress
      }
      return newData
    }
    catch (err) {
      console.log(err);
      newData = {
        city: 'city',
        address: JSON.stringify(data)
      }
      return newData
    }
  }

  ngOnInit() {
  }

}
