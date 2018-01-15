import { Router } from "@angular/router";
import { Headers, RequestOptions, Response } from "@angular/http";
import { environment } from 'environments/environment';

export class DataApiWrapper {

  options: RequestOptions;
  headers = new Headers();
  router: Router;

  constructor(_options: RequestOptions) {
    this.options = _options;

    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    this.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    this.headers.append('Access-Control-Allow-Credentials', 'true');

    // The following headers are required for IE support
    this.headers.append('Pragma', 'no-cache');
    this.headers.append('Cache-Control', 'no-cache');
    this.headers.append('If-Modified-Since', new Date().toUTCString());
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  
    this.options = new RequestOptions({ headers: this.headers });
  }


  handleError(error: any): Promise<any> {

    if (error['status'] === 400) {
      return Promise.reject(error['_body']);
    } else if (error['status'] === 404) {
      return Promise.reject(error['_body']);
    }
    else {
      this.router.navigate([`/pages/${error['status']}`]);
      return null;
    }
  }

  handleResponse(res: Response): Promise<any> {

    return res.json();
  }
}


