import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { BingBinHttpProvider } from '../bing-bin-http/bing-bin-http';

@Injectable()
export class CategoryProvider {

  private base: string = this.bbh.baseUrl + 'category/';

  private fetchUrl(id: number) {
    return this.base + id;
  }

  private deleteUrl(id: number) {
    return this.base + id;
  }

  private enableThreadsUrl(id: number) {
    return this.base + id + '/enable-threads';
  }

  private disableThreadsUrl(id: number) {
    return this.base + id + '/disable-threads';
  }


  constructor(private bbh: BingBinHttpProvider) { }


  index(): Observable<any> {
    return this.bbh.httpGet(this.base);
  }

  store(title: string, description: string, weight: number, enable_threads: boolean,
    isPrivate: boolean, category_id: number): Observable<any> {
    return this.bbh.httpPost(this.base, {
      title: title, description: description, weight: weight,
      enable_threads: enable_threads, private: isPrivate, category_id: category_id
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.bbh.httpDelete(this.deleteUrl(id));
  }

  getCategory(id: number): Observable<any> {
    return this.bbh.httpGet(this.fetchUrl(id));
  }

  enableThreads(id): Observable<any> {
    return this.bbh.httpPatch(this.enableThreadsUrl(id), {});
  }

  disableThreads(id): Observable<any> {
    return this.bbh.httpPatch(this.disableThreadsUrl(id), {});
  }

}
