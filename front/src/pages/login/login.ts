import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';

import { BingBinHttpProvider } from '../../providers/bing-bin-http/bing-bin-http';
import { ThreadProvider } from '../../providers/thread/thread';
import { LogProvider } from '../../providers/log/log';
import { BasepageProvider } from '../../providers/basepage/basepage';

import { EventPage } from '../event/event';
import { BbcerclePage } from '../bbcercle/bbcercle';

import * as geolocator from '../../assets/js/geolocator.min.js';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BasepageProvider {

  hint: string;
  GOOGLE_API_KEY: string = '***REMOVED***';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public l: LogProvider, private bbh: BingBinHttpProvider, private threadProvider: ThreadProvider) {
    /*
        super(l);
    
        const params = new URLSearchParams(window.location.search.slice(1));
        const token = params.get('bbt');
        const toPage = params.get('toPage');
    
        this.l.log(token);
        this.l.log(toPage);
    
        if (token != null && toPage != null) {
          this.bbh.setToken(token);
    
          this.threadProvider.myThreads(1).subscribe(
            (res) => {
              this.doSubscribe(res, () => {
                if (toPage === "event") {
                  navCtrl.setRoot(EventPage);
                } else if (toPage === "forum") {
                  navCtrl.setRoot(BbcerclePage);
                } else {
                  this.hint = 'page incorrect';
                }
              }, () => {
                this.hint = res.error;
              }, () => {
                this.hint = 'Server response error';
              });
            });
        } else {
          this.hint = 'Missing param';
          this.l.log('Missing param');
        }
    */
    geolocator.config({
      language: "en",
      google: {
        version: "3",
        key: this.GOOGLE_API_KEY
      }
    });

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumWait: 10000,     // max wait time for desired accuracy
      maximumAge: 0,          // disable cache
      desiredAccuracy: 30,    // meters
      fallbackToIP: true,     // fallback to IP if Geolocation fails or rejected
      addressLookup: true,    // requires Google API key if true
      timezone: true,         // requires Google API key if true
      map: "map-canvas",      // interactive map element id (or options object)
      staticMap: true         // get a static map image URL (boolean or options object)
    };
    
    geolocator.locate(options, function(err, location) {
      if (err) return console.log(err);
      console.log(location);
    });
  }
}
