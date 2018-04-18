import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PostOpenPage } from '../post-open/post-open';
import { PublicationPage } from '../publication/publication';
import { CollectionPage } from '../collection/collection';
import { NewPostPage } from '../new-post/new-post';
import { SearchPage } from '../search/search';

import { PopoverComponent } from '../../components/popover/popover';

import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';


@Component({
  selector: 'page-bbcercle',
  templateUrl: 'bbcercle.html',
})

export class BbcerclePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,
    public l: LogProvider, private threadProvider: ThreadProvider) {
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
