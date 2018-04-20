import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { BingBinHttpProvider } from '../bing-bin-http/bing-bin-http';

@Injectable()
export class PostProvider {

  private base: string = 'https://api.bingbin.io/api/post/';
  //private base: string = 'http://localhost:8000/api/post/';

  private fetchUrl(id: number) {
    return this.base + id;
  }

  private deleteUrl(id: number) {
    return this.base + id;
  }

  private restoreUrl(id: number) {
    return this.base + id + '/restore';
  }

  private likeUrl(id: number) {
    return this.base + id + '/like';
  }

  private unlikeUrl(id: number) {
    return this.base + id + '/unlike';
  }


  constructor(private bbh: BingBinHttpProvider) { }


  index(): Observable<any> {
    return this.bbh.httpGet(this.base);
  }

  store(thread_id: string, content: string, post_id: number, author_id: string)
    : Observable<any> {
    var params = { thread_id: thread_id, content: content, author_id: author_id }
    if (post_id != 0) {
      params['post_id'] = post_id;
    }
    return this.bbh.httpPost(this.base, params);
  }

  deletePost(id: number): Observable<any> {
    return this.bbh.httpDelete(this.deleteUrl(id));
  }

  getPost(id: number): Observable<any> {
    return this.bbh.httpGet(this.fetchUrl(id));
  }

  restorePost(id): Observable<any> {
    return this.bbh.httpPatch(this.restoreUrl(id), {});
  }

  likePost(id): Observable<any> {
    return this.bbh.httpPatch(this.likeUrl(id), {});
  }

  unlikePost(id): Observable<any> {
    return this.bbh.httpPatch(this.unlikeUrl(id), {});
  }

}
