import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { Ng2TableModule } from './ng2-grid/ng-table-module';
import { PaginationModule, AlertModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmpService } from './EmpCurd/EmpService';

import { AppComponent } from './app.component';
import { EmpComponent } from './EmpCurd/emp.component';
import { from } from 'rxjs/observable/from';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@NgModule({
  declarations: [
    AppComponent, EmpComponent
  ],
  imports: [
    BrowserModule, HttpModule, Ng2TableModule, AlertModule, PaginationModule.forRoot(), 
    FormsModule, ReactiveFormsModule
  ],
  providers: [EmpService],
  bootstrap: [AppComponent]
})
export class AppModule { }

