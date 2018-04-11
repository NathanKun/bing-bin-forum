import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { BingBinHttpProvider } from '../bing-bin-http/bing-bin-http';

@Injectable()
export class ThreadProvider {

  private base: string = 'https://api.bingbin.io/api/thread/';
  private countNotReadUrl: string = this.base + 'not-read';
  private myThreadsUrl: string = this.base + 'my-threads';
  private myFavoriteUrl: string = this.base + 'my-favorite';

  private fetchUrl(id: number) {
    return this.base + id;
  }
  
  private deleteUrl(id: number) {
    return this.base + id;
  }
  
  private markReadUrl(id: number) {
    return this.base + id + '/mark-read';
  }
  
  private favoriteUrl(id: number) {
    return this.base + id + '/favorite';
  }
  
  private unfavoriteUrl(id: number) {
    return this.base + id + '/unfavorite';
  }
  

  constructor(private bbh: BingBinHttpProvider) {
  }
  

  index(page: number): Observable<any> {
    return this.bbh.httpGet(this.base + '?page=' + page);
  }

  store(category_id: number, title: string, content: string): Observable<any> {
    return this.bbh.httpPost(this.base, { category_id: category_id, title: title, content: content });
  }
  
  deleteThread(id: number): Observable<any> {
    return this.bbh.httpDelete(this.deleteUrl(id));
  }

  getThread(id: number): Observable<any> {
    return this.bbh.httpGet(this.fetchUrl(id));
  }

  countNotRead(): Observable<any> {
    return this.bbh.httpGet(this.countNotReadUrl);
  }

  myThreads(): Observable<any> {
    return this.bbh.httpGet(this.myThreadsUrl);
  }

  myFavorite(): Observable<any> {
    return this.bbh.httpGet(this.myFavoriteUrl);
  }
  
  marlRead(id): Observable<any> {
    return this.bbh.httpPatch(this.markReadUrl(id), {});
  }
  
  favorite(id): Observable<any> {
    return this.bbh.httpPatch(this.favoriteUrl(id), {});
  }
  
  unfavorite(id): Observable<any> {
    return this.bbh.httpPatch(this.unfavoriteUrl(id), {});
  }

}
