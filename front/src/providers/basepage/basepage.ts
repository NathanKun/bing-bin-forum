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

  public timeSince(date: Date) {

    var seconds = Math.floor(((new Date()).getTime() - date.getTime()) / 1000);

    var interval = Math.floor(seconds / 31536000);

    let plural = interval === 1 ? "" : "s";

    if (interval > 1) {
      return "Il y a " + interval + " an" + plural;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return "Il y a " + interval + " mois";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return "Il y a " + interval + " jour" + plural;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return "Il y a " + interval + " heure" + plural;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return "Il y a " + interval + " minuit" + plural;
    }
    return "Il y a " + Math.floor(seconds) + " second" + plural;
  }
}
