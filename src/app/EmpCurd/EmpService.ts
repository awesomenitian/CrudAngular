import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { DataApiWrapper } from './dataApiWrapper';
import { environment } from 'environments/environment';
import { Employee } from './emp';


@Injectable()
export class EmpService extends DataApiWrapper{
    baseUrl: string = environment.apiUrl; 
    
    empDetails : Employee;

    constructor(private http: Http, options: RequestOptions) {
            super(options);
        }

    addEmpDetails(empDetails): Observable<number> {
        return this.http.post(this.baseUrl + "api/Emp/Create", empDetails, this.options)
            .map((res: any) => this.empDetails = res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getEmpDetails(){
        return this.http.get(this.baseUrl + "api/Emp/Count", this.options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}


