import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { ThreadProvider } from '../../providers/thread/thread';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  threadId: number;
  private threads: [any];

  constructor(public viewCtrl: ViewController, public navParams: NavParams,
    private threadProvider: ThreadProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    this.threadId = navParams.get('threadId');
    this.threads = navParams.get('threads');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  share(event) {
    console.log("share on click");
    console.log(event);
    console.log(this.threadId);
    this.close();
  }

  delete(event) {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Supprimer ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.close();

            let loading = this.loadingCtrl.create();
            loading.present();

            this.threadProvider.deleteThread(this.threadId).subscribe((res) => {
              if (res.valid) {
                this.threads.forEach((t, index) => {
                  if (t.id === this.threadId) {
                    this.threads.splice(index, 1);
                  }
                });

                loading.dismiss();
              } else {
                let alert = this.alertCtrl.create({
                  title: 'Oops',
                  subTitle: res.error ? res.error : 'Erreur',
                  buttons: ['OK']
                });
                alert.present();
              }
            })
          }
        }
      ]
    });
    alert.present();


  }
}
