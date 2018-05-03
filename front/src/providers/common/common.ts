import { Injectable, NgZone } from '@angular/core';
import { App, NavControllerBase } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, Subject } from 'rxjs/Rx';

import Hermite_class from 'hermite-resize';

@Injectable()
export class CommonProvider {

  public userId: string;
  public userFirstname: number;
  public userEcoPoint: number;
  public userSunPoint: number;
  public userRabbitId: number;
  public userLeafId: number;

  private location: string = "";

  private rabbits: { [key: number]: Blob } = {};
  private leaves: { [key: number]: Blob } = {};
  private avatars: {
    rabbitId: number,
    leafId: number,
    data: ImageData,
    width: number,
    height: number
  }[] = [];
  private toMonitorIdsSubject = new Subject();

  private maxRabbitId: number = 9;
  private maxLeafId: number = 12;



  constructor(public http: HttpClient, private ngZone: NgZone, public app: App) {
    window['common-provider'] = { component: this, zone: ngZone };

    this.cacheAllImages();

    this.toMonitorIdsSubject
      .map((item: { rabbitId: number, leafId: number, canvas: HTMLCanvasElement }) => {
        this.doDraw(item.rabbitId, item.leafId, item.canvas);
      }).subscribe();
  }



  // call from outside
  //window['common-provider'].zone.run(() => {window['common-provider'].component.outsideSetLocation('loc');})
  public outsideSetLocation(loc: string): string {
    this.ngZone.run(() => this.setLocation(loc));
    return this.getLocation();
  }

  // call from outside
  //window['common-provider'].zone.run(() => {window['common-provider'].component.outsideBackPress();})
  public outsideBackPress() {
    let nav: NavControllerBase = this.app.getActiveNavs()[0];
    if (nav.canGoBack()) { //Can we go back?
      if ('type' in nav.getActive().instance && nav.getActive().instance.type === 'PublicationPage') { // PublicationPage should pop with direction forward, or page will be blank
        nav.pop({ animate: true, direction: 'forward' });
      } else {
        nav.pop();
      }
    } else {
    }
  }

  public getLocation() {
    return this.location;
  }

  private setLocation(loc: string) {
    this.location = loc;
  }

  public draw(rabbitId: number, leafId: number, canvas: HTMLCanvasElement) {
    this.drawFromArray([{rabbitId: rabbitId, leafId: leafId, canvas: canvas}]);
  }

  public drawFromArray(array: [{ rabbitId: number, leafId: number, canvas: HTMLCanvasElement }]) {
    Observable
      .from(array)
      .mergeMap((item: { rabbitId: number, leafId: number, canvas: HTMLCanvasElement }) => {
        return this.doDraw(item.rabbitId, item.leafId, item.canvas);
      }, null, 1)
      .subscribe();
  }

  private doDraw(rabbitId: number, leafId: number, canvas: HTMLCanvasElement) {

    var ctx = canvas.getContext('2d');

    // check cache
    let foundCache = false;
    this.avatars.forEach((item) => {
      if (item.rabbitId === rabbitId && item.leafId === leafId) {
        canvas.width = item.width;
        canvas.height = item.height;
        ctx.putImageData(item.data, 0, 0);
        canvas.setAttribute('style', 'display: block;');
        foundCache = true;
      }
    });
    if(foundCache) {
      return Observable.of(canvas);
    }

    // draw new
    return Observable.create((observer: Observer<HTMLCanvasElement>) => {

      let rabbit: Blob = this.rabbits[rabbitId];
      let leaf: Blob = this.leaves[leafId];

      // draw imgs
      var rabbitImg: any = new Image();
      var leafImg: any = new Image();

      rabbitImg.onload = () => {
        // set canvas size
        canvas.width = rabbitImg.height;
        canvas.height = rabbitImg.height;

        ctx.drawImage(rabbitImg, (canvas.width - rabbitImg.width) / 2, 0);
        leafImg.src = URL.createObjectURL(leaf);
      }

      leafImg.onload = () => {
        ctx.drawImage(leafImg, (canvas.width - leafImg.width) / 2, canvas.height / 7);
        const sevenVhToPx = document.documentElement.clientHeight * 0.08;
        let HERMITE = new Hermite_class();
        HERMITE.resample(canvas, sevenVhToPx, sevenVhToPx, true, () => {
          this.cropImageFromCanvas(ctx, canvas); // chop empty pixels of two side
          canvas.setAttribute('style', 'display: block;');

          // cache
          this.avatars.push({
            rabbitId: rabbitId,
            leafId: leafId,
            data: ctx.getImageData(0, 0, canvas.width, canvas.height),
            width: canvas.width,
            height: canvas.height
          });

          observer.next(canvas);
          observer.complete();
        });
      }


      // use cached image data
      rabbitImg.src = URL.createObjectURL(rabbit);
    });
  }

  private idToRabbit(id: number): Observable<Blob> {
    if (this.rabbits.hasOwnProperty(id)) {
      return Observable.of(this.rabbits[id]);
    } else {
      return this.http
        .get('../../assets/imgs/avatar/rabbit_' + id + '.png', { responseType: 'blob' });
    }
  }

  private idToLeaf(id: number): Observable<Blob> {
    if (this.leaves.hasOwnProperty(id)) {
      return Observable.of(this.leaves[id]);
    } else {
      return this.http
        .get('../../assets/imgs/avatar/leaf_' + id + '.png', { responseType: 'blob' });
    }
  }

  private cacheAllImages() {

    var cacheRabbit = (rabbitId, rabbit) => {
      this.rabbits[rabbitId] = rabbit;
    };

    var cacheLeaf = (leafId, leaf) => {
      this.leaves[leafId] = leaf;
    };

    for (let i = 1; i <= this.maxRabbitId; i++) {
      this.idToRabbit(i).subscribe(img => cacheRabbit(i, img));
    }
    for (let i = 1; i <= this.maxLeafId; i++) {
      this.idToLeaf(i).subscribe(img => cacheLeaf(i, img));
    }
  }

  private cropImageFromCanvas(ctx, canvas) {

    var w = canvas.width,
      h = canvas.height,
      pix = { x: [], y: [] },
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
      x, y, index;

    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        index = (y * w + x) * 4;
        if (imageData.data[index + 3] > 0) {

          pix.x.push(x);
          pix.y.push(y);

        }
      }
    }
    pix.x.sort(function(a, b) { return a - b });
    pix.y.sort(function(a, b) { return a - b });
    var n = pix.x.length - 1;
    w = pix.x[n] - pix.x[0];
    h = pix.y[n] - pix.y[0];
    var cut = ctx.getImageData(pix.x[0], pix.y[0], w + 2, h + 2);

    canvas.width = w + 2;
    //canvas.height = h + 2;

    // keep original clientHeight
    // but make chopped image vertical center
    ctx.putImageData(cut, 0, (canvas.height - (h + 2)) / 2);
  }

}
