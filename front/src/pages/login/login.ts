import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx'
import { CookieService } from 'ngx-cookie-service';

import { BingBinHttpProvider } from '../../providers/bing-bin-http/bing-bin-http';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
import { CommonProvider } from '../../providers/common/common';

import { EventPage } from '../event/event';
import { BbcerclePage } from '../bbcercle/bbcercle';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BasepageProvider {

  hint: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public l: LogProvider, private bbh: BingBinHttpProvider,
    private commonProvider: CommonProvider, private cookieService: CookieService) {

    super(l);

    // check front version
    bbh.httpGetBasic('/assets/version.json').subscribe((res: any) => {
      if ((!this.cookieService.check('version')) ||
        (this.cookieService.check('version') && this.cookieService.get('version') != res.version)) {
        this.l.log('version outdated, old version = ' + this.cookieService.get('version'));
        if('android' in window) {
          this.l.log("Cached site is out dated, calling window['android'].clearCache()");
          this.cookieService.set('version', res.version, 7);
          window['android'].clearCache();
        } else {
          this.l.log('Cached site is out dated, calling window.location.reload(true)');
          this.cookieService.set('version', res.version, 7);
          window.location.reload(true);
        }
      } else {
        this.l.log('version up to date, version = ' + res.version);
      }
    });

    const params = new URLSearchParams(window.location.search.slice(1));
    const token = params.get('bbt');
    const toPage = params.get('toPage');

    this.l.log("token: " + token);
    this.l.log("toPage: " + toPage);

    if (token != null && toPage != null) {
      this.bbh.setToken(token);

      this.loginCheck().subscribe(
        (res) => {
          this.doSubscribe(res, () => {
            const data = res.data;
            this.commonProvider.userId = data.id;
            this.commonProvider.userFirstname = data.firstname;
            this.commonProvider.userEcoPoint = data.eco_point;
            this.commonProvider.userSunPoint = data.sun_point;
            this.commonProvider.userRabbitId = data.id_usagi;
            this.commonProvider.userLeafId = data.id_leaf;

            if (toPage === "event") {
              navCtrl.setRoot(EventPage);
            } else if (toPage === "forum") {
              navCtrl.setRoot(BbcerclePage);
            } else {
              this.hint = 'page incorrect';
            }
          }, () => {
            this.hint = res.error;
          }, () => {
            this.hint = 'Server response error';
          });
        });
    } else {
      this.hint = 'Missing param';
      this.l.log('Missing param');
    }
  }

  private loginCheck(): Observable<any> {
    return this.bbh.httpGet(this.bbh.baseUrl + 'user/logincheck');
  }

}
