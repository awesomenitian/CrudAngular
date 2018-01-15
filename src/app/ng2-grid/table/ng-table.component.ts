import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ng-table',
  template: `
    <table class="table dataTable" ngClass="{{config.className || ''}}"
           role="grid" style="width: 100%;">
      <thead>
        <tr role="row">
          <th *ngFor="let column of columns" [ngTableSorting]="config" [column]="column" 
              (sortChanged)="onChangeTable($event)" ngClass="{{column.className || ''}}">
            {{column.title}}
            <i *ngIf="config && column.sort" class="pull-right fa"
              [ngClass]="{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}"></i>
          </th>
          <th>
          Actions
          </th>
        </tr>
      </thead>
      <tbody>
      <tr *ngIf="showFilterRow">
        <td *ngFor="let column of columns">
          <input *ngIf="column.filtering" placeholder="{{column.filtering.placeholder}}"
                 [ngTableFiltering]="column.filtering"
                 class="form-control filterDataInput"
                 style="width: auto;"
                 (tableChanged)="onChangeTable(config)"/>
        </td>
      </tr>
        <tr *ngFor="let row of rows">
          <td (dblclick)="cellClick(row, column.name)" *ngFor="let column of columns" [innerHtml]="sanitize(getData(row, column.name))"></td>
          <td>
            <a href="#" class="tablelinkbtn m-r-10" data-toggle="modal" data-target="#AddInfoModal" (click)="editClick(row, 'Action')">
                <i class="fa fa-edit"></i>
            </a>
            <a href="#" class="redlinkbtn" data-toggle="modal" data-target="#DeleteInfoModal" (click)="deleteClick(row, 'Action')">
              <i class="fa fa-trash-o"></i>
            </a>
          </td>
        </tr>
        <tr *ngIf="!rows || rows.length==0">
          <td colspan="7" class="text-center bold">{{EmptyGridMessage}}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class NgTableComponent {

  EmptyGridMessage: string = "No Records Available.";
  isAdmin: boolean;
  statusId: boolean;

  ngOnInit(){ }

  // Table values
  @Input() public rows:Array<any> = [];

  @Input()
  public set config(conf:any) {
    if (!conf.className) {
      conf.className = 'table-striped table-bordered';
    }
    if (conf.className instanceof Array) {
      conf.className = conf.className.join(' ');
    }
    this._config = conf;
  }

  // Outputs (Events)
  @Output() public tableChanged:EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked:EventEmitter<any> = new EventEmitter();
  @Output() public editClicked:EventEmitter<any> = new EventEmitter();
  @Output() public deleteClicked:EventEmitter<any> = new EventEmitter();

  public showFilterRow:Boolean = false;

  @Input()
  public set columns(values:Array<any>) {
    values.forEach((value:any) => {
      if (value.filtering) {
        this.showFilterRow = true;
      }
      if (value.className && value.className instanceof Array) {
        value.className = value.className.join(' ');
      }
      let column = this._columns.find((col:any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });
  }

  private _columns:Array<any> = [];
  private _config:any = {};

  public constructor(private sanitizer:DomSanitizer) {
  }

  public sanitize(html:string):SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public get columns():Array<any> {
    return this._columns;
  }

  public get config():any {
    return this._config;
  }

  public get configColumns():any {
    let sortColumns:Array<any> = [];

    this.columns.forEach((column:any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return {columns: sortColumns};
  }

  public onChangeTable(column:any):void {
    this._columns.forEach((col:any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });
    this.tableChanged.emit({sorting: this.configColumns});
  }

  public getData(row:any, propertyName:string):string {
    return propertyName.split('.').reduce((prev:any, curr:string) => prev[curr], row);
  }

  public cellClick(row:any, column:any):void {
    this.cellClicked.emit({row, column});
  }

  public editClick(row:any, column:any):void {
    this.editClicked.emit({row, column});
  }
  public deleteClick(row:any, column:any):void {
    this.deleteClicked.emit({row, column});
  }
}
