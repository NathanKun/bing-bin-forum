import { Component, AfterViewInit, ViewChildren } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PostOpenPage } from '../post-open/post-open';
import { PublicationPage } from '../publication/publication';
import { CollectionPage } from '../collection/collection';
import { NewPostPage } from '../new-post/new-post';
import { SearchPage } from '../search/search';

import { PopoverComponent } from '../../components/popover/popover';
import { BingBinHttpProvider } from '../../providers/bing-bin-http/bing-bin-http';
import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
import { AvatarProvider } from '../../providers/avatar/avatar';


@Component({
  selector: 'page-bbcercle',
  templateUrl: 'bbcercle.html',
})

export class BbcerclePage extends BasepageProvider {
  @ViewChildren('threadcard') cardList;
  threads: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bbh: BingBinHttpProvider, private threadProvider: ThreadProvider,
    private avatarProvider: AvatarProvider, public l: LogProvider,
    public popoverCtrl: PopoverController
  ) {

    super(l);

    this.threadProvider.indexForum(1).subscribe(
      (res) => {
        this.doSubscribe(res, () => {
          this.threads = res.data;

          // calculate post time
          this.threads.forEach((t, index) => {
            this.threads[index]['timeSince'] = this.timeSince(new Date(t.created_at));
          });
        }, () => {

        }, () => {

        });
      });
  }

  ngAfterViewInit() {
    this.cardList.changes.subscribe(
      () => {
        this.threads.forEach((t, index) => {
          this.avatarProvider.draw(t.author.id_usagi, t.author.id_leaf,
            <HTMLCanvasElement>document.getElementById("thread-canvas-" + t.id));
        });
      }
    );
  }

  openPostPage() {
    this.navCtrl.push(PostOpenPage);
  }

  openPublicationPage() {
    this.navCtrl.push(PublicationPage, {}, {
      animate: true,
      direction: 'back',
    });
  }

  openCollectionPage() {
    this.navCtrl.push(CollectionPage);
  }

  openNewPostPage() {
    this.navCtrl.push(NewPostPage);
  }

  openSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }

  visible1 = false;
  visible2 = false;
  visible3 = false;
  toggleCollection() {
    this.visible1 = !this.visible1;
  }
  toggleLike() {
    this.visible2 = !this.visible2;
  }
  toggleComment() {
    this.visible3 = !this.visible3;
  }

}
