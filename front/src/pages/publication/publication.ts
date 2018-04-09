import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { NewPostPage } from '../new-post/new-post';
import { PostOpenPage } from '../post-open/post-open';
import { PopoverComponent } from '../../components/popover/popover';
/**
 * Generated class for the PublicationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publication',
  templateUrl: 'publication.html',
})
export class PublicationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicationPage');
  }

  goback(){
    this.navCtrl.pop({animate: true, direction: 'forward'});
  }

  openNewPostPage(){
    this.navCtrl.push(NewPostPage);
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
}
