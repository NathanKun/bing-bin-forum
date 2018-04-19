import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx'

import { BingBinHttpProvider } from '../../providers/bing-bin-http/bing-bin-http';
import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
import { AvatarProvider } from '../../providers/avatar/avatar';

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
    private threadProvider: ThreadProvider, private avatarProvider: AvatarProvider) {

        super(l);

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
                this.avatarProvider.userId = data.id;
                this.avatarProvider.userFirstname = data.firstname;
                this.avatarProvider.userEcoPoint = data.eco_point;
                this.avatarProvider.userSunPoint = data.sun_point;
                this.avatarProvider.userRabbitId = data.id_usagi;
                this.avatarProvider.userLeafId = data.id_leaf;

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

  private loginCheck(): Observable<any>{
    return this.bbh.httpGet('http://localhost:8000/api/user/logincheck');
  }

}
