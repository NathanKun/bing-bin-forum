import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';

import { BingBinHttpProvider } from '../../providers/bing-bin-http/bing-bin-http';
import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';

import { EventPage } from '../event/event';
import { BbcerclePage } from '../bbcercle/bbcercle';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BasepageProvider {

  hint: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public l: LogProvider,
    private bbh: BingBinHttpProvider, private threadProvider: ThreadProvider) {

    super(l)

    const params = new URLSearchParams(window.location.search.slice(1));
    const token = params.get('bbt');
    const toPage = params.get('toPage');

    this.l.log(token);
    this.l.log(toPage);

    if (token != null && toPage != null) {
      this.bbh.setToken(token);

      this.threadProvider.myThreads().subscribe(
        (res) => {
          this.doSubscribe(res, () => {
            if (toPage === "event") {
              navCtrl.push(EventPage);
            } else if (toPage === "forum") {
              navCtrl.push(BbcerclePage);
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



}
