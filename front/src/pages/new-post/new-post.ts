import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
import { CommonProvider } from '../../providers/common/common';


@Component({
  selector: 'page-new-post',
  templateUrl: 'new-post.html',
})
export class NewPostPage extends BasepageProvider {

  private titleInput: string = '';
  private contentInput: string = '';
  private mainImageInput: File;
  private previewUrl: string;
  private locationEnabled: boolean = true;

  private picToViewG: string;
  private picToViewR: string;
  private picToViewB: string;
  private txt: string = 'Etiquette';
  private selectedCategory: number;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public l: LogProvider, private threadProvider: ThreadProvider,
    private commonProvider: CommonProvider, private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

    super(l);

    this.changeFlag('green');
  }


  onFileChanged(event: any) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type.match('image.*')) {

        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed
          this.previewUrl = (event.target as any).result;
        }

        this.mainImageInput = event.target.files[0];
      } else {
        let alert = this.alertCtrl.create({
          title: 'Oops',
          subTitle: 'Veuillez choisir une fichier de format image',
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }

  locationClick() {
    this.locationEnabled = !this.locationEnabled;
    document.getElementById('icon-pin').style.color =
      this.locationEnabled ? '#F6EEDC' : 'grey';
  }

  doPost() {
    this.l.log(this.titleInput);
    this.l.log(this.contentInput);
    this.l.log(this.mainImageInput);
    // limit-to directive not working perfectly, check long again
    if (this.titleInput.length > 255) {
      let alert = this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'La titre est trop long',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.titleInput.length < 5) {
      let alert = this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'La titre est trop court',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.contentInput.length > 60000) {
      let alert = this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'La contenu est trop longue',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.contentInput.length < 10) {
      let alert = this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'La contenu est trop courte',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let loading = this.loadingCtrl.create();
      loading.present();
      let location = this.locationEnabled ? this.commonProvider.getLocation() : "";
      this.threadProvider.store(this.selectedCategory, this.titleInput,
        this.contentInput, this.mainImageInput, location).subscribe((res) => {
          loading.dismiss();
          this.doSubscribe(res, () => {
            this.navCtrl.pop();
          }, () => {

          }, () => {

          })
        });
    }
  }

  changeFlag(color: string) {
    switch (color) {
      case 'green':
        this.picToViewG = "assets/imgs/etiquette-green-full.png"
        this.picToViewR = "assets/imgs/etiquette-red-clear.png"
        this.picToViewB = "assets/imgs/etiquette-brown-clear.png"
        this.txt = '#Recyclage'
        this.selectedCategory = 2;
        break;

      case 'red':
        this.picToViewG = "assets/imgs/etiquette-green-clear.png"
        this.picToViewR = "assets/imgs/etiquette-red-full.png"
        this.picToViewB = "assets/imgs/etiquette-brown-clear.png"
        this.txt = '#Échange'
        this.selectedCategory = 3;
        break;

      case 'brown':
        this.picToViewG = "assets/imgs/etiquette-green-clear.png"
        this.picToViewR = "assets/imgs/etiquette-red-clear.png"
        this.picToViewB = "assets/imgs/etiquette-brown-full.png"
        this.txt = '#Blabla'
        this.selectedCategory = 4;
        break;

      default:
        break;
    }
  }


}
