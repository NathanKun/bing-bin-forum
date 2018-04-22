import { Injectable, isDevMode } from '@angular/core';

/*
  Generated class for the LogProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LogProvider {

  constructor() {
    console.log(isDevMode() ? "Dev mode, logger enabled" : "Prod mode, logger disabled")
  }

  log(text: any) {
    if (isDevMode()) {
      console.log(text);
    }
  }

}
