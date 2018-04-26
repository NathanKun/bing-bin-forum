import { Injectable, NgZone } from '@angular/core';
import { App, NavControllerBase } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
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
  private nav: NavControllerBase;

  private rabbits: { [key: number]: Blob } = {};
  private leaves: { [key: number]: Blob } = {};

  //private HERMITE = new Hermite_class();

  constructor(public http: HttpClient, private ngZone: NgZone, public app: App) {
    this.nav = app.getActiveNavs()[0];
    window['common-provider'] = { component: this, zone: ngZone };
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
    if (this.nav.canGoBack()) { //Can we go back?
      this.nav.pop();
      console.log("poped");
    } else {
      console.log("can not go back")
    }
  }

  public getLocation() {
    return this.location;
  }

  private setLocation(loc: string) {
    this.location = loc;
  }

  public draw(idRabbit: number, idLeaf: number, canvas: HTMLCanvasElement) {
    Observable
      .forkJoin(
        this.idToRabbit(idRabbit),
        this.idToLeaf(idLeaf),
    )
      .subscribe(
        (values) => {
          let rabbit: Blob = values[0];
          let leaf: Blob = values[1];

          // cache imgs
          if (!(this.rabbits.hasOwnProperty(idRabbit))) {
            this.rabbits[idRabbit] = rabbit;
          }
          if (!(this.leaves.hasOwnProperty(idLeaf))) {
            this.leaves[idLeaf] = leaf;
          }

          // draw imgs
          var ctx = canvas.getContext('2d');
          var rabbitImg: any = new Image();
          var leafImg: any = new Image();

          var on_finish = function() {
            canvas.setAttribute('style', 'display: block;');
          };

          rabbitImg.onload = () => {
            // Make it visually fill the positioned parent
            /*canvas.style.width = '100%';
            canvas.style.height = '100%';*/
            // ...then set the internal size to match
            canvas.width = rabbitImg.height;
            canvas.height = rabbitImg.height;


            ctx.drawImage(rabbitImg, (canvas.width - rabbitImg.width) / 2, 0);
            leafImg.src = URL.createObjectURL(leaf);
          }

          leafImg.onload = () => {
            ctx.drawImage(leafImg, (canvas.width - leafImg.width) / 2, canvas.height / 7);
            const sevenVhToPx = document.documentElement.clientHeight * 0.07;
            let HERMITE = new Hermite_class();
            HERMITE.resample(canvas, sevenVhToPx, sevenVhToPx, true, on_finish);
          }

          rabbitImg.src = URL.createObjectURL(rabbit);
        }
      )
      ;
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


  // ref: https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
  // ref: http://jsfiddle.net/gamealchemist/kpQyE/14/
  // author: gamealchemist
  // scales the image by (float) scale < 1
  // returns a canvas containing the scaled image.
  private downScaleImage(img, scale): HTMLCanvasElement {
    var imgCV = document.createElement('canvas');
    imgCV.width = img.width;
    imgCV.height = img.height;
    var imgCtx = imgCV.getContext('2d');
    imgCtx.drawImage(img, 0, 0);
    return this.downScaleCanvas(imgCV, scale);
  }

  // scales the canvas by (float) scale < 1
  // returns a new canvas containing the scaled image.
  private downScaleCanvas(cv, scale) {
    if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
    var sqScale = scale * scale; // square scale = area of source pixel within target
    var sw = cv.width; // source image width
    var sh = cv.height; // source image height
    var tw = Math.floor(sw * scale); // target image width
    var th = Math.floor(sh * scale); // target image height
    var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
    var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
    var tX = 0, tY = 0; // rounded tx, ty
    var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
    // weight is weight of current source point within target.
    // next weight is weight of current source point within next target's point.
    var crossX = false; // does scaled px cross its current px right border ?
    var crossY = false; // does scaled px cross its current px bottom border ?
    var sBuffer = cv.getContext('2d').
      getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
    var tBuffer = new Float32Array(4 * sw * sh); // target buffer Float32 rgb
    var sR = 0, sG = 0, sB = 0; // source's current point r,g,b
    // untested !
    var sA = 0;  //source alpha

    for (sy = 0; sy < sh; sy++) {
      ty = sy * scale; // y src position within target
      tY = 0 | ty;     // rounded : target pixel's y
      yIndex = 4 * tY * tw;  // line index within target array
      crossY = (tY != (0 | ty + scale));
      if (crossY) { // if pixel is crossing botton target pixel
        wy = (tY + 1 - ty); // weight of point within target pixel
        nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
      }
      for (sx = 0; sx < sw; sx++ , sIndex += 4) {
        tx = sx * scale; // x src position within target
        tX = 0 | tx;    // rounded : target pixel's x
        tIndex = yIndex + tX * 4; // target pixel index within target array
        crossX = (tX != (0 | tx + scale));
        if (crossX) { // if pixel is crossing target pixel's right
          wx = (tX + 1 - tx); // weight of point within target pixel
          nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
        }
        sR = sBuffer[sIndex];   // retrieving r,g,b for curr src px.
        sG = sBuffer[sIndex + 1];
        sB = sBuffer[sIndex + 2];
        sA = sBuffer[sIndex + 3];

        if (!crossX && !crossY) { // pixel does not cross
          // just add components weighted by squared scale.
          tBuffer[tIndex] += sR * sqScale;
          tBuffer[tIndex + 1] += sG * sqScale;
          tBuffer[tIndex + 2] += sB * sqScale;
          tBuffer[tIndex + 3] += sA * sqScale;
        } else if (crossX && !crossY) { // cross on X only
          w = wx * scale;
          // add weighted component for current px
          tBuffer[tIndex] += sR * w;
          tBuffer[tIndex + 1] += sG * w;
          tBuffer[tIndex + 2] += sB * w;
          tBuffer[tIndex + 3] += sA * w;
          // add weighted component for next (tX+1) px
          nw = nwx * scale
          tBuffer[tIndex + 4] += sR * nw; // not 3
          tBuffer[tIndex + 5] += sG * nw; // not 4
          tBuffer[tIndex + 6] += sB * nw; // not 5
          tBuffer[tIndex + 7] += sA * nw; // not 6
        } else if (crossY && !crossX) { // cross on Y only
          w = wy * scale;
          // add weighted component for current px
          tBuffer[tIndex] += sR * w;
          tBuffer[tIndex + 1] += sG * w;
          tBuffer[tIndex + 2] += sB * w;
          tBuffer[tIndex + 3] += sA * w;
          // add weighted component for next (tY+1) px
          nw = nwy * scale
          tBuffer[tIndex + 4 * tw] += sR * nw; // *4, not 3
          tBuffer[tIndex + 4 * tw + 1] += sG * nw; // *4, not 3
          tBuffer[tIndex + 4 * tw + 2] += sB * nw; // *4, not 3
          tBuffer[tIndex + 4 * tw + 3] += sA * nw; // *4, not 3
        } else { // crosses both x and y : four target points involved
          // add weighted component for current px
          w = wx * wy;
          tBuffer[tIndex] += sR * w;
          tBuffer[tIndex + 1] += sG * w;
          tBuffer[tIndex + 2] += sB * w;
          tBuffer[tIndex + 3] += sA * w;
          // for tX + 1; tY px
          nw = nwx * wy;
          tBuffer[tIndex + 4] += sR * nw; // same for x
          tBuffer[tIndex + 5] += sG * nw;
          tBuffer[tIndex + 6] += sB * nw;
          tBuffer[tIndex + 7] += sA * nw;
          // for tX ; tY + 1 px
          nw = wx * nwy;
          tBuffer[tIndex + 4 * tw] += sR * nw; // same for mul
          tBuffer[tIndex + 4 * tw + 1] += sG * nw;
          tBuffer[tIndex + 4 * tw + 2] += sB * nw;
          tBuffer[tIndex + 4 * tw + 3] += sA * nw;
          // for tX + 1 ; tY +1 px
          nw = nwx * nwy;
          tBuffer[tIndex + 4 * tw + 4] += sR * nw; // same for both x and y
          tBuffer[tIndex + 4 * tw + 5] += sG * nw;
          tBuffer[tIndex + 4 * tw + 6] += sB * nw;
          tBuffer[tIndex + 4 * tw + 7] += sA * nw;
        }
      } // end for sx
    } // end for sy

    // create result canvas
    var resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    var resCtx = resCV.getContext('2d');
    var imgRes = resCtx.getImageData(0, 0, tw, th);
    var tByteBuffer = imgRes.data;
    // convert float32 array into a UInt8Clamped Array
    var pxIndex = 0; //
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 4, tIndex += 4, pxIndex++) {
      tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
      tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
      tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
      tByteBuffer[tIndex + 3] = Math.ceil(tBuffer[sIndex + 3]);
    }
    // writing result to canvas.
    resCtx.putImageData(imgRes, 0, 0);
    return resCV;
  }
}
