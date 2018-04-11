import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  picToViewG:string="assets/imgs/etiquette-green-clear.png";
  picToViewR:string="assets/imgs/etiquette-red-clear.png";
  picToViewB:string="assets/imgs/etiquette-brown-clear.png";
  txt:string='Recherche';

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  changeViewG(){
    if(this.picToViewG=="assets/imgs/etiquette-green-clear.png"){
      this.picToViewG ="assets/imgs/etiquette-green-full.png";
      this.txt='#Recyclage';
    }else{
      this.picToViewG ="assets/imgs/etiquette-green-clear.png";
      this.txt='Recherche';
    }
}

  changeViewR(){
    if(this.picToViewR=="assets/imgs/etiquette-red-clear.png"){
      this.picToViewR ="assets/imgs/etiquette-red-full.png";
      this.txt='#Échange';
    }else{
      this.picToViewR ="assets/imgs/etiquette-red-clear.png";
      this.txt='Recherche';
    }
}
  changeViewB(){
    if(this.picToViewB=="assets/imgs/etiquette-brown-clear.png"){
      this.picToViewB ="assets/imgs/etiquette-brown-full.png";
      this.txt='#Blabla';
    }else{
      this.picToViewB ="assets/imgs/etiquette-brown-clear.png";
      this.txt='Recherche';
    }
}

}
