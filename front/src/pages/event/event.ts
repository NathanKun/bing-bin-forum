import { Component } from '@angular/core';
import { NavController, NavParams, App, Platform } from 'ionic-angular';
import { EventOpenPage } from '../event-open/event-open';

import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage extends BasepageProvider {

  events: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public app: App, public platform: Platform, public l: LogProvider,
    private threadProvider: ThreadProvider) {

    super(platform, app, l);

    this.threadProvider.index(1, 1).subscribe(
      (res) => {
        this.doSubscribe(res, () => {
          this.events = res.data;
        }, () => {

        }, () => {

        });
      });
  }

  openCardPage(threadId: number) {
    this.navCtrl.push(EventOpenPage, { threadId: threadId });
  }



}
