import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PostOpenPage } from '../post-open/post-open';
import { PopoverComponent } from '../../components/popover/popover';

/**
 * Generated class for the CollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionPage');
  }

  openPostPage(){
    this.navCtrl.push(PostOpenPage);
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
