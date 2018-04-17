import { LogProvider } from '../../providers/log/log';
import { Injectable } from '@angular/core';

/*
  Generated class for the BasepageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BasepageProvider {

  constructor(public l: LogProvider) {
  }


  public doSubscribe(res, doValid: Function, doError: Function, doRequestError: Function): void {
    this.l.log(res);
    if (res.valid) {
      doValid();
    } else if (res.hasOwnProperty('error')) {
      doError();
    } else {
      doRequestError();
    }
  }
}
