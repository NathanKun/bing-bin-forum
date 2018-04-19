import { Component, AfterViewInit, ViewChildren } from '@angular/core';
import {
  NavController, NavParams, LoadingController,
  PopoverController, Refresher
} from 'ionic-angular';
import { PostOpenPage } from '../post-open/post-open';
import { PublicationPage } from '../publication/publication';
import { CollectionPage } from '../collection/collection';
import { NewPostPage } from '../new-post/new-post';
import { SearchPage } from '../search/search';

import { PopoverComponent } from '../../components/popover/popover';
import { ThreadProvider } from '../../providers/thread/thread';
import { PostProvider } from '../../providers/post/post';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
import { AvatarProvider } from '../../providers/avatar/avatar';


@Component({
  selector: 'page-bbcercle',
  templateUrl: 'bbcercle.html',
})

export class BbcerclePage extends BasepageProvider {

  loading: any;
  @ViewChildren('threadcard') cardList;
  threads: any = [];
  page: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public l: LogProvider, private threadProvider: ThreadProvider,
    private avatarProvider: AvatarProvider, private postProvider: PostProvider,
    public popoverCtrl: PopoverController, public loadingCtrl: LoadingController
  ) {

    super(l);

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.loadPage(() => this.loading.dismiss());
  }

  private loadPage(doAfter: Function) {

    this.threadProvider.indexForum(1).subscribe(
      (res) => {
        this.doSubscribe(res, () => {
          this.threads = res.data;

          // calculate post time
          this.threads.forEach((t, index) => {
            this.threads[index]['timeSince'] = this.timeSince(new Date(t.created_at));
          });

          doAfter();
        }, () => {

        }, () => {

        });
      });
  }

  private doRefresh(refresher: Refresher) {
    {
      this.l.log('doRefresh');
      this.loadPage(() => refresher.complete());
    }
  }

  private doInfinite(infiniteScroll) {
    this.l.log('doInfinite');

    this.threadProvider.indexForum(this.page + 1).subscribe((res) => {
      this.doSubscribe(res, () => {
        this.page++;
        this.threads.concat(res.data);
      }, () => { }, () => { }
      );

      infiniteScroll.complete();
    });
  }

  ngAfterViewInit() {
    this.cardList.changes.subscribe(
      () => {
        this.threads.forEach((t, index) => {
          this.avatarProvider.draw(t.author.id_usagi, t.author.id_leaf,
            <HTMLCanvasElement>document.getElementById("thread-canvas-" + t.id));
        });
      }
    );
  }

  openPostPage(postId: number) {
    this.navCtrl.push(PostOpenPage, { postId: postId });
  }

  openPublicationPage() {
    this.navCtrl.push(PublicationPage, {}, {
      animate: true,
      direction: 'back',
    });
  }

  openCollectionPage() {
    this.navCtrl.push(CollectionPage);
  }

  openNewPostPage() {
    this.navCtrl.push(NewPostPage);
  }

  openSearchPage() {
    this.navCtrl.push(SearchPage);
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
