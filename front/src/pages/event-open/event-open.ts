import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BingBinHttpProvider } from '../../providers/bing-bin-http/bing-bin-http';
import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';


/**
 * Generated class for the EventOpenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-open',
  templateUrl: 'event-open.html',
})
export class EventOpenPage extends BasepageProvider {
  
  thread: {} = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public l: LogProvider,
    private bbh: BingBinHttpProvider, private threadProvider: ThreadProvider) {
    
    super(l);
    
    const id = navParams.get('threadId');
    
    this.threadProvider.getThread(id).subscribe(
      (res) => {
        this.doSubscribe(res, () => {
          this.thread = res.data;
          console.log(this.thread);
        }, () => {
          
        }, () => {
          
        });
      });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventOpenPage');
  }


}
