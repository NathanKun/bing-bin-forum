import { Component } from '@angular/core';
import {
  NavController, NavParams, LoadingController,
  AlertController, PopoverController
} from 'ionic-angular';

import { PopoverComponent } from '../../components/popover/popover';

import { NewPostPage } from '../new-post/new-post';
import { PostOpenPage } from '../post-open/post-open';

import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
import { CommonProvider } from '../../providers/common/common';
import { LoaderProvider } from '../../providers/loader/loader';

@Component({
  selector: 'page-publication',
  templateUrl: 'publication.html',
})
export class PublicationPage extends BasepageProvider implements PublicationPageBase{

  type: string = 'PublicationPage';

  loading: any;
  threads: any = [];
  page: number = 1;


  private options: {} = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public popoverCtrl: PopoverController, private commonProvider: CommonProvider,
    public l: LogProvider, private threadProvider: ThreadProvider,
    private loaderProvider: LoaderProvider) {

    super(l);

  }

  ionViewDidLoad() {
    this.drawAvatar();
  }

  ionViewWillEnter() {
    if (this.page === 1) {
      this.loading = this.loaderProvider.getLoader(this.loadingCtrl);
      this.loading.present();

      this.loadPage(() => this.loading.dismiss());
    }
  }

  doInfinite(infiniteScroll) {
    if (this.page != 0) {
      this.page++;
      this.threadProvider.myThreads(this.page).subscribe((res) => {
        this.doSubscribe(res, () => {
          if (res.data.length == 0) {
            this.page = 0;
          } else {

            res.data.forEach((t, index) => {
              // complete image urls
              if (t.main_image && !(t.main_image.original.url as string).startsWith('http')) {
                res.data[index].main_image.original.url = this.imgBaseUrl + t.main_image.original.url;
              }

              // locale date string
              res.data[index].localeDateString =
                (new Date(t.created_at)).toLocaleDateString("fr", this.options);
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

  private drawAvatar() {
    this.commonProvider.draw(this.commonProvider.userRabbitId,
      this.commonProvider.userRabbitId,
      document.getElementById('publication-avatar') as HTMLCanvasElement);
  }

  private loadPage(doAfter: Function) {
    this.threadProvider.myThreads(1).subscribe(
      (res) => {
        this.doSubscribe(res, () => {
          this.page = 1;
          this.threads = res.data;

          this.threads.forEach((t, index) => {
            // complete image urls
            if (t.main_image && !(t.main_image.original.url as string).startsWith('http')) {
              this.threads[index].main_image.original.url = this.imgBaseUrl + t.main_image.original.url;
            }

            // locale date string
            this.threads[index].localeDateString =
              (new Date(t.created_at)).toLocaleDateString("fr", this.options);
          });

          doAfter();
        }, () => {

        }, () => {

        });
      });
  }



  goback() {
    this.navCtrl.pop({ animate: true, direction: 'forward' });
  }

  openNewPostPage() {
    this.navCtrl.push(NewPostPage);
  }

  openPostPage(threadId: number) {
    this.navCtrl.push(PostOpenPage, { threadId: threadId });
  }

  presentPopover(myEvent, threadId: number) {
    let popover = this.popoverCtrl.create(PopoverComponent, {threadId: threadId, threads: this.threads});
    popover.present({ ev: myEvent });
  }
}

interface PublicationPageBase {
    type: string;
}
