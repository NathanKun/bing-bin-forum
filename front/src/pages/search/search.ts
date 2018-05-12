import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { PostOpenPage } from '../post-open/post-open';

import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';

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
export class SearchPage extends BasepageProvider {

  private catg2: boolean = true;
  private catg3: boolean = true;
  private catg4: boolean = true;
  private page: number;
  private threads: any = [];

  greenFlagImg: string;
  redFlagImg: string;
  brownFlagImg: string;
  searchInput: string = '';


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public l: LogProvider, private threadProvider: ThreadProvider,
    private alertCtrl: AlertController) {

    super(l);

    this.changeFlag('green');
    this.changeFlag('red');
    this.changeFlag('brown');
  }

  doSearch() {
    this.l.log("searchInput = " + this.searchInput);

    if (this.searchInput.trim() != '') {
      this.searchInput = this.searchInput.trim();
      this.page = 1;

      this.threadProvider.search(this.searchInput, this.page,
        this.catg2, this.catg3, this.catg4).subscribe((res) => {
          this.doSubscribe(res, () => {
            this.page = 1;

            this.threads = res.data;

            this.threads.forEach((t, index) => {
              // complete image urls
              if (t.main_image && !(t.main_image.original.url as string).startsWith('http')) {
                this.threads[index].main_image.original.url = this.imgBaseUrl + t.main_image.original.url;
              }
            });

          }, () => { }, () => { })
        }
        );
    } else {
      let alert = this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'Veuillez entrer un mot clé ou un message pour effectuer la recherche',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  doInfinite(infiniteScroll) {
    if (this.page != 0) {
      this.page++;
      this.threadProvider.search(this.searchInput, this.page,
        this.catg2, this.catg3, this.catg4).subscribe((res) => {
          this.doSubscribe(res, () => {
            if (res.data.length == 0) {
              this.page = 0;
            } else {

              res.data.forEach((t, index) => {
                // complete image urls
                if (t.main_image && !(t.main_image.original.url as string).startsWith('http')) {
                  res.data[index].main_image.original.url = this.imgBaseUrl + t.main_image.original.url;
                }
              });

              this.threads = this.threads.concat(res.data);
              this.l.log(this.threads);
            }
          }, () => { }, () => { }
          );

          setTimeout(() => infiniteScroll.complete(), 1000);
        });
    } else {

    }
  }

  openPostPage(threadId: number) {
    this.navCtrl.push(PostOpenPage, { threadId: threadId });
  }

  changeFlag(color: string) {
    switch (color) {
      case 'green':
        this.catg2 = !this.catg2;
        if (this.catg2) {
          this.greenFlagImg = "assets/imgs/etiquette-green-full.png"
        } else {
          this.greenFlagImg = "assets/imgs/etiquette-green-clear.png"
        }
        break;

      case 'red':
        this.catg3 = !this.catg3;
        if (this.catg3) {
          this.redFlagImg = "assets/imgs/etiquette-red-full.png"
        } else {
          this.redFlagImg = "assets/imgs/etiquette-red-clear.png"
        }
        break;

      case 'brown':
        this.catg4 = !this.catg4;
        if (this.catg4) {
          this.brownFlagImg = "assets/imgs/etiquette-brown-full.png"
        } else {
          this.brownFlagImg = "assets/imgs/etiquette-brown-clear.png"
        }
        break;

      default:
        break;
    }
  }

}
