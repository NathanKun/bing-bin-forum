import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { LoginPageModule } from '../pages/login/login.module';
import { EventPageModule } from '../pages/event/event.module';
import { EventOpenPageModule } from'../pages/event-open/event-open.module';
import { BbcerclePageModule } from'../pages/bbcercle/bbcercle.module';
import { PublicationPageModule } from '../pages/publication/publication.module';
import { CollectionPageModule } from '../pages/collection/collection.module';
import { PostOpenPageModule } from '../pages/post-open/post-open.module';
import { NewPostPageModule } from '../pages/new-post/new-post.module';
import { CommentPageModule } from '../pages/comment/comment.module';
import { SearchPageModule } from '../pages/search/search.module';

//import { PopoverComponent } from '../components/popover/popover';
//import { PopSearchComponent } from '../components/popsearch/popsearch';
import { ComponentsModule } from '../components/components.module';
import { CategoryProvider } from '../providers/category/category';
import { ThreadProvider } from '../providers/thread/thread';
import { PostProvider } from '../providers/post/post';
import { BingBinHttpProvider } from '../providers/bing-bin-http/bing-bin-http';
import { LogProvider } from '../providers/log/log';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
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
    LogProvider
  ]
})
export class AppModule {}
