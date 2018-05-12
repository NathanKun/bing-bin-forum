import { LoadingController, Loading } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';

/*
  Generated class for the LoaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoaderProvider {

  content: string = `<img id='loader'alt='loader' src='../../assets/imgs/loader.png' />`;
  safeContent;

  constructor(private sanitizer: DomSanitizer) { }

  getLoader(loadingCtrl: LoadingController): Loading {

    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.content);

    return loadingCtrl.create({
      spinner: 'hide',
      content: this.safeContent
    });
  }

}
