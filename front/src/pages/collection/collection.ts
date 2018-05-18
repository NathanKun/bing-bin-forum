import { Component, ViewChildren } from '@angular/core';
import {
  NavController, NavParams, LoadingController,
  PopoverController, Refresher
} from 'ionic-angular';

import { PostOpenPage } from '../post-open/post-open';
import { PopoverComponent } from '../../components/popover/popover';

import { ThreadProvider } from '../../providers/thread/thread';
import { PostProvider } from '../../providers/post/post';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
import { CommonProvider } from '../../providers/common/common';
import { LoaderProvider } from '../../providers/loader/loader';


@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage extends BasepageProvider {

  loading: any;
  @ViewChildren('threadcard') cardList;
  threads: any = [];
  page: number = 1;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public l: LogProvider, private threadProvider: ThreadProvider,
    private commonProvider: CommonProvider, private postProvider: PostProvider,
    public popoverCtrl: PopoverController, public loadingCtrl: LoadingController,
    private loaderProvider: LoaderProvider
  ) {

    super(l);

  }


  ngAfterViewInit() {
    this.cardList.changes.subscribe(
      () => {
        let array: any = [];
        this.threads.forEach((t, index) => {
          if (index >= (10 * this.page - 10) && index < (10 * this.page)) {
            array.push({
              rabbitId: t.author.id_usagi,
              leafId: t.author.id_leaf,
              canvas: <HTMLCanvasElement>document.getElementById("favorite-thread-canvas-" + t.id)
            });
          }
        });
        this.commonProvider.drawFromArray(array);
      }
    );
  }

  // call each time before enter to this page
  ionViewWillEnter() {
    if (this.page === 1) {
      this.loading = this.loaderProvider.getLoader(this.loadingCtrl);
      this.loading.present();

      this.loadPage(() => this.loading.dismiss());
    }
  }


  private loadPage(doAfter: Function) {
    this.threadProvider.myFavorite(1).subscribe(
      (res) => {
        this.doSubscribe(res, () => {
          this.page = 1;
          this.threads = res.data;

          this.threads.forEach((t, index) => {
            // calculate post time
            this.threads[index]['timeSince'] = this.timeSince(new Date(t.created_at));

            // complete image urls
            if (t.main_image && !(t.main_image.original.url as string).startsWith('http')) {
              this.threads[index].main_image.original.url = this.imgBaseUrl + t.main_image.original.url;
            }
          });

          doAfter();
        }, () => {

        }, () => {

        });
      });
  }

  doRefresh(refresher: Refresher) {
    {
      this.loadPage(() => refresher.complete());
    }
  }

  doInfinite(infiniteScroll) {
    if (this.page != 0) {
      this.page++;
      this.threadProvider.myFavorite(this.page).subscribe((res) => {
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

  swipeEvent(e) {
    if (e.direction == 4) {
      this.navCtrl.pop();
    }
  }

  openPostPage(threadId: number) {
    this.navCtrl.push(PostOpenPage, { threadId: threadId });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }

  toggleCollection(thread: any) {
    if (thread.favorite) {
      this.threadProvider.unfavorite(thread.id).subscribe();
      thread.favorite_count--;
    } else {
      this.threadProvider.favorite(thread.id).subscribe();
      thread.favorite_count++;
    }
    thread.favorite = !thread.favorite;
  }

  toggleLike(thread: any) {
    if (thread.like) {
      this.postProvider.unlikePost(thread.post_id).subscribe();
      thread.like_count--;
    } else {
      this.postProvider.likePost(thread.post_id).subscribe();
      thread.like_count++;
    }
    thread.like = !thread.like;
  }

}
