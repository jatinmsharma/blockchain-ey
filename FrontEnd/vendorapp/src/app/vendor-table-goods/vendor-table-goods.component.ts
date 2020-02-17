import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators, FormControl, NgSelectOption } from '@angular/forms';

export interface RawMaterial {
  id: String;
  name: String;
  unit: String;
  creator: string;
  vname: string;
}
@Component({
  selector: 'app-customer-table-goods',
  templateUrl: './vendor-table-goods.component.html',
  styleUrls: ['./vendor-table-goods.component.css']
})
export class VendorTableGoodsComponent implements OnInit {
  id: any;
  name: any;
  unit: any;
  package_list = [];


  displayedColumns: string[] = [
    // 'id',
    'name',
    // 'unit',
    'creator',
    // 'vname',
  ];

  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator

  username = ""
  //
  // registerUser = this.fb.group({
  //   vname: ['', [Validators.required, Validators.maxLength(16)]],
  //   ename: ['', [Validators.required, Validators.maxLength(16)]],
  //   ship: ['', Validators.required],
  //   billaddr: ['', Validators.required],
  //   gstno: ['', Validators.required],
  //   pono: ['', Validators.required],
  //   ordramt: ['', Validators.required],
  // });

  constructor(private data: UserService, private httpClient: HttpClient, private blockchainService: BlockchainService) {
    this.username = localStorage.getItem('userID');
    this.getUserDetails()
  }

  getUserDetails() {
    let that = this;
    this.blockchainService.getEntity('goods').subscribe(val => {
      if (val) {
        console.log(val['entity'][0]);
        for (var i = 0; i < val['entity'].length; i++) {
          // console.log(val['entity'][i]);
          {
            console.log(val['entity'][i]);
            if (val['entity'][i]['vendor']['name'] == localStorage.getItem('name')) {

              var payload = {
                'id': val['entity'][i]['goods']['ID'],
                'name': val['entity'][i]['goods']['name'],
                'unit': val['entity'][i]['goods']['unit'],
                'creator': val['entity'][i]['vendor']['creator'],
                'vname': val['entity'][i]['vendor']['name'],

              }
              that.package_list.push(payload)
              //that.package_list.push(val['entity'][i]['vendor'].creator)
              //creator to be added
            }
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
