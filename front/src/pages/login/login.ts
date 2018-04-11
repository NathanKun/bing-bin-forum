import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BingBinHttpProvider } from '../../providers/bing-bin-http/bing-bin-http';
import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';

import { EventPage } from '../event/event';
import { BbcerclePage } from '../bbcercle/bbcercle';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  hint: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bbh: BingBinHttpProvider, private threadProvider: ThreadProvider,
    private l: LogProvider) {
    
    const params = new URLSearchParams(window.location.search.slice(1));
    const token = params.get('bbt');
    const toPage = params.get('toPage');

    this.l.log(token);
    this.l.log(toPage);

    if (token != null && toPage != null) {
      this.bbh.setToken(token);

      this.threadProvider.myThreads().subscribe((res) => {
        this.l.log(res);
        if (res.valid) {
          if (toPage === "event") {
            navCtrl.push(EventPage);
          } else if (toPage === "forum") {
            navCtrl.push(BbcerclePage);
          } else {
            this.hint = 'page incorrect';
          }
        } else if(res.hasOwnProperty('error')) {
          this.hint = res.error;
        } else {
          this.hint = 'Server response error';
        }
      });
    } else {
      this.hint = 'Missing param';
      this.l.log('Missing param');
    }

  }

}
