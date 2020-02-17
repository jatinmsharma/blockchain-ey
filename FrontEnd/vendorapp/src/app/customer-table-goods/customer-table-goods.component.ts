import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BlockchainService } from '../blockchain.service'
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export interface RawMaterial {
  id: String;
  name: String;
  unit: String;
  creator: string;
  vname: string;
}
@Component({
  selector: 'app-customer-table-goods',
  templateUrl: './customer-table-goods.component.html',
  styleUrls: ['./customer-table-goods.component.css']
})
export class CustomerTableGoodsComponent implements OnInit {
  id: any;
  name: any;
  unit: any;
  package_list = [];
  selectedOrder: any;
  selection = new SelectionModel<RawMaterial>(true, []);

  displayedColumns: string[] = [
    // 'id',
    'name',
    // 'unit',
    'creator',
    'vname',
  ];

  dataSource: MatTableDataSource<RawMaterial>;
  @ViewChild(MatPaginator) paginator: MatPaginator

  username = ""

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
        this.dataSource = new MatTableDataSource<RawMaterial>(that.package_list);
        this.dataSource.paginator = this.paginator;
        const initialSelection = [];
        const allowMultiSelect = true;
        this.selection = new SelectionModel<RawMaterial>(allowMultiSelect, initialSelection);

      }
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
    console.log(numSelected);
    console.log(this.selection);
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    console.log(this.dataSource.data.forEach(row => this.selection.select(row)));
  }
  checkboxLabel(row?: RawMaterial): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
  }
  placeOrder() {
    console.log(this.selection);
    var x = []
    // window["ss"]=this.selection;
    x.push(this.selection['selected']);
    this.selectedOrder = JSON.stringify(x)
    // console.log(this.selectedOrder)

    //     for(var i=0;i<event.goodsService.length;i++){
    // x.push({'name':event.goodsService[0].name,'discount':event.goodsService[0].discount})
    //     }

    //     console.log(this.goodsServicesDiscount);
  }

  ngOnInit() {
  }

}
