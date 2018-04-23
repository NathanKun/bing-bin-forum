import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { BingBinHttpProvider } from '../bing-bin-http/bing-bin-http';

@Injectable()
export class ThreadProvider {

  private base: string = this.bbh.baseUrl + 'thread/';
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


  constructor(private bbh: BingBinHttpProvider) { }


  index(category_id: number, page: number): Observable<any> {
    return this.bbh.httpGet(this.base + '?page=' + page + '&category_id=' + category_id);
  }

  indexForum(page: number): Observable<any> {
    return this.bbh.httpGet(this.base + '?page=' + page + '&forum=true');
  }

  myThreads(page: number): Observable<any> {
    return this.bbh.httpGet(this.myThreadsUrl + '?page=' + page);
  }

  myFavorite(page: number): Observable<any> {
    return this.bbh.httpGet(this.myFavoriteUrl + '?page=' + page);
  }

  store(category_id: number, title: string, content: string, main_image: File, location: string): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('category_id', category_id.toString());
    formData.append('title', title);
    formData.append('content', content);
    formData.append('location', location);
    if(main_image) {
      formData.append('main_image', main_image, main_image.name);
    }

    return this.bbh.httpPost(this.base, formData);
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

  markRead(id): Observable<any> {
    return this.bbh.httpPatch(this.markReadUrl(id), {});
  }

  favorite(id): Observable<any> {
    return this.bbh.httpPatch(this.favoriteUrl(id), {});
  }

  unfavorite(id): Observable<any> {
    return this.bbh.httpPatch(this.unfavoriteUrl(id), {});
  }

}
