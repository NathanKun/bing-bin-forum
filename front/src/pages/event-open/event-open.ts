import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams } from 'ionic-angular';

import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';

@Component({
  selector: 'page-event-open',
  templateUrl: 'event-open.html',
})
export class EventOpenPage extends BasepageProvider {

  thread: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sanitizer: DomSanitizer, public l: LogProvider,
    private threadProvider: ThreadProvider) {

    super(l);

    const id = navParams.get('threadId');

    this.threadProvider.getThread(id).subscribe(
      (res) => {
        this.doSubscribe(res, () => {
          this.thread = res.data;
          (this.thread.posts as any[]).forEach((post, index) => {
            this.thread.posts[index].content = this.sanitizer.bypassSecurityTrustHtml(post.content);
          });
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
