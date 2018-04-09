import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommentPage } from '../comment/comment';

/**
 * Generated class for the PostOpenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-open',
  templateUrl: 'post-open.html',
})
export class PostOpenPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostOpenPage');
  }
  openCommentPage(){
    this.navCtrl.push(CommentPage);
  }

  visible = false;
  visible1 = false;
  visible2 = false;
  visible3 = false;

  toggle() {
   this.visible = !this.visible;
  }
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
