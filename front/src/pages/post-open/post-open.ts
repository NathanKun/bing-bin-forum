import { Component, ViewChildren } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CommentPage } from '../comment/comment';

import { ThreadProvider } from '../../providers/thread/thread';
import { PostProvider } from '../../providers/post/post';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';
import { CommonProvider } from '../../providers/common/common';

/**
 * Generated class for the PostOpenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-post-open',
  templateUrl: 'post-open.html',
})
export class PostOpenPage extends BasepageProvider {

  @ViewChildren('commentrow') commentrows;
  loading: any;
  thread: any;
  commentInput: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public l: LogProvider, private threadProvider: ThreadProvider,
    private commonProvider: CommonProvider, private postProvider: PostProvider,
    public loadingCtrl: LoadingController, private alertCtrl: AlertController
  ) {

    super(l);

    this.loadPage();
  }

  private loadPage() {

    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();

    this.threadProvider.getThread(this.navParams.get('threadId')).subscribe((res) => {
      this.doSubscribe(res,
        () => {
          this.loading.dismiss();
          this.thread = res.data;

          // calculate time since
          this.thread['timeSince'] = this.timeSince(new Date(this.thread.created_at));
          // complete image urls
          if (this.thread.main_image && !(this.thread.main_image.original.url as string).startsWith('http')) {
            this.thread.main_image.original.url = this.imgBaseUrl + this.thread.main_image.original.url;
          }
        }, () => {

        }, () => {

        });
    });
  }

  ngAfterViewInit() {
    this.commentrows.changes.subscribe(
      () => {
        // author avatars
        this.commonProvider.draw(this.thread.author.id_usagi, this.thread.author.id_leaf,
          <HTMLCanvasElement>document.getElementById("canvas-author"));

        // leave comment avatar
        this.commonProvider.draw(
          this.commonProvider.userRabbitId, this.commonProvider.userLeafId,
          <HTMLCanvasElement>document.getElementById("canvas-user"));

        // comment avatars
        this.thread.posts.forEach((p, index) => {
          if (index === 0) return;
          this.commonProvider.draw(p.author.id_usagi, p.author.id_leaf,
            <HTMLCanvasElement>document.getElementById("canvas-comment-" + p.id));
        });
      }
    );
  }

  openCommentPage() {
    this.navCtrl.push(CommentPage);
  }

  visible = false;
  visible1 = false;
  visible2 = false;
  visible3 = false;

  doComment() {
    // limit-to directive not working perfectly, check long again
    if (this.commentInput.length > 255) {
      let alert = this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'Votre commentaire est trop long',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.commentInput.length < 3) {
      let alert = this.alertCtrl.create({
        title: 'Oops',
        subTitle: 'Votre commentaire est trop court',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.postProvider.store(this.thread.id, this.commentInput, 0,
        this.commonProvider.userId).subscribe((res) => {
          loading.dismiss();
          this.doSubscribe(res, () => {
            this.commentInput = '';
            this.loadPage();
          }, () => {

          }, () => {

          })
        });
    }
  }

  // like thread = like first post
  // so like thread and like post use the same method
  // if is like/unlike a thread, need to pass the thread object in
  // for changing the like counter
  togglePostLike(post: any, thread?: any) {
    if (post.is_current_user_like) {
      this.postProvider.unlikePost(post.id).subscribe();
      if (thread) thread.like_count--;

    } else {
      this.postProvider.likePost(post.id).subscribe();
      if (thread) thread.like_count++;
    }
    post.is_current_user_like = !post.is_current_user_like;
  }

  toggleThreadFavorite(thread: any) {
    if (thread.favorite) {
      this.threadProvider.unfavorite(thread.id).subscribe();
      thread.favorite_count--;
    } else {
      this.threadProvider.favorite(thread.id).subscribe();
      thread.favorite_count++;
    }
    thread.favorite = !thread.favorite;
  }

}
