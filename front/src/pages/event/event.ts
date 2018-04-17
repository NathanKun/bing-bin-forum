import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventOpenPage } from '../event-open/event-open';
import { BbcerclePage } from  '../bbcercle/bbcercle';
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
export class EventPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }
  
  openCardPage(){
    this.navCtrl.push(EventOpenPage);
  }



}
