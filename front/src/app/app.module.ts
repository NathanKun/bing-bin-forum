import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { EventPage } from '../pages/event/event';
import { EventOpenPage } from'../pages/event-open/event-open';
import { BbcerclePage } from'../pages/bbcercle/bbcercle';
import { PublicationPage } from '../pages/publication/publication';
import { CollectionPage } from '../pages/collection/collection';
import { PostOpenPage } from '../pages/post-open/post-open';
import { NewPostPage } from '../pages/new-post/new-post';
import { CommentPage } from '../pages/comment/comment';
import { SearchPage } from '../pages/search/search';

import { ComponentsModule } from '../components/components.module';
import { CategoryProvider } from '../providers/category/category';
import { ThreadProvider } from '../providers/thread/thread';
import { PostProvider } from '../providers/post/post';
import { BingBinHttpProvider } from '../providers/bing-bin-http/bing-bin-http';
import { LogProvider } from '../providers/log/log';
import { BasepageProvider } from '../providers/basepage/basepage';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    EventPage,
    EventOpenPage,
    BbcerclePage,
    PublicationPage,
    CollectionPage,
    PostOpenPage,
    NewPostPage,
    CommentPage,
    SearchPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    EventPage,
    EventOpenPage,
    BbcerclePage,
    PublicationPage,
    CollectionPage,
    PostOpenPage,
    NewPostPage,
    CommentPage,
    SearchPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpClientModule,
    CategoryProvider,
    ThreadProvider,
    PostProvider,
    BingBinHttpProvider,
    LogProvider,
    BasepageProvider
  ]
})
export class AppModule {}
