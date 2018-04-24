import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'
/*
  Generated class for the BingBinHttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BingBinHttpProvider {

  private options;

  public baseUrl: string = 'https://api.bingbin.io/api/';
  //public baseUrl: string = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  public setToken(token: string) {
    this.options = {
      headers: new HttpHeaders({ 'Authorization': 'BingBinToken ' + token })
    };
  }

  public httpGetBasic(url: string) {
    return this.http.get(url);
  }

  public httpGet(url: string) {
    return this.http.get(
      url,
      this.options
    )
      .catch(
        (error: any) => { return this.errorHandler(error) }
      );
  }

  public httpPost(url: string, params: {}) {
    return this.http.post(
      url,
      params,
      this.options
    )
      .catch(
        (error: any) => { return this.errorHandler(error) }
      );
  }

  public httpPatch(url: string, params: {}) {
    return this.http.patch(
      url,
      params,
      this.options
    )
      .catch(
        (error: any) => { return this.errorHandler(error) }
      );
  }

  public httpDelete(url: string) {
    return this.http.delete(
      url,
      this.options
    )
      .catch(
        (error: any) => { return this.errorHandler(error) }
      );
  }

  private errorHandler(error: any): Observable<any> {
    if (error.error.hasOwnProperty('error')) {
      return Observable.of(error.error);
    } else {
      console.log(error);
      return Observable.of({ "valid": false, "error": "erreur de connexion" });
    }
  }
}
