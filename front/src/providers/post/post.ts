import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the PostProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostProvider {

  private base: string = 'https://forum.bingbin.io/';

  constructor(public http: HttpClient) {
    console.log('Hello PostProvider Provider');
  }

}
