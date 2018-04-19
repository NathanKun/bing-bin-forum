import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class AvatarProvider {

  public userId: string;
  public userFirstname: number;
  public userEcoPoint: number;
  public userSunPoint: number;
  public userRabbitId: number;
  public userLeafId: number;

  constructor(public http: HttpClient) {
  }

  public draw(idRabbit: number, idLeaf: number, canvas: HTMLCanvasElement) {
    Observable
      .forkJoin(
        this.idToRabbit(idRabbit),
        this.idToLeaf(idLeaf),
    )
      .subscribe(
        function handleValue(values) {
          let rabbit: Blob = values[0];
          let leaf: Blob = values[1];

          var ctx = canvas.getContext('2d');
          var rabbitImg: any = new Image();
          var leafImg: any = new Image();

          var canvasWidth = 0;
          var canvasHeight = 0;

          rabbitImg.onload = function() {
            // Make it visually fill the positioned parent
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            // ...then set the internal size to match
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const x1 = canvas.width;
            let y1 = canvas.height;
            let x2 = rabbitImg.width;
            let y2 = rabbitImg.height;

            if (x1 / y1 < x2 / y2) {
              y1 = x1;
            }
            canvasWidth = x1;
            canvasHeight = y1;

            while (x2 > 2 * x1 && y2 > 2 * y1) {
              var oc = document.createElement('canvas');
              var octx = oc.getContext('2d');

              oc.width = x2 * 0.5;
              oc.height = y2 * 0.5;

              octx.drawImage(rabbitImg, 0, 0, oc.width, oc.height);

              x2 = oc.width
              y2 = oc.height
              rabbitImg = oc
            }

            const posX = (x1 * y2 - x2 * y1) / 2 / y2;
            const posY = 0;
            const drawWitdh = x2 * y1 / y2;

            ctx.drawImage(rabbitImg, posX, posY, drawWitdh, y1);
            leafImg.src = URL.createObjectURL(leaf);
          }

          leafImg.onload = function() {
            const x1 = canvasWidth;
            const y1 = canvasHeight;
            let x2 = leafImg.width;
            let y2 = leafImg.height;

            while (x2 > 2 * x1 && y2 > 2 * y1) {
              var oc = document.createElement('canvas');
              var octx = oc.getContext('2d');

              oc.width = x2 * 0.5;
              oc.height = y2 * 0.5;

              octx.drawImage(leafImg, 0, 0, oc.width, oc.height);

              x2 = oc.width
              y2 = oc.height
              leafImg = oc
            }

            const drawHeight = y1 / 2.3;
            const drawWitdh = drawHeight * x2 / y2;
            const posX = (x1 - drawWitdh) / 2;
            const posY = y1 / 7;

            ctx.drawImage(leafImg, posX, posY, drawWitdh, drawHeight);
          }

          rabbitImg.src = URL.createObjectURL(rabbit);
        }
      )
      ;
  }

  private idToRabbit(id: number): Observable<Blob> {
    return this.http
      .get('../../assets/imgs/avatar/rabbit_' + id + '.png', { responseType: 'blob' });
  }

  private idToLeaf(id: number): Observable<Blob> {
    return this.http
      .get('../../assets/imgs/avatar/leaf_' + id + '.png', { responseType: 'blob' });
  }

}
