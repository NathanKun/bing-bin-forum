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
          var rabbitImg = new Image();
          var leafImg = new Image();

          rabbitImg.onload = function() {
            // Make it visually fill the positioned parent
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            // ...then set the internal size to match
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const x1 = canvas.width;
            let y1 = canvas.height;
            const x2 = rabbitImg.width;
            const y2 = rabbitImg.height;

            if(x1 / y1 < 1) { // if avatar 'thinner' than rabbit image
              y1 = x1;
            }

            const posX = (x1 * y2 - x2 * y1) / 2 / y2;
            const posY = 0;
            const drawWitdh = x2 * y1 / y2;

            ctx.drawImage(rabbitImg, posX, posY, drawWitdh, y1);
          }
          leafImg.onload = function() {
            const x1 = canvas.width;
            let y1 = canvas.height;
            const x2 = leafImg.width;
            const y2 = leafImg.height;

            if(x1 / y1 < 1) { // if avatar 'thinner' than rabbit image
              y1 = x1;
            }

            const drawHeight = y1 / 2.3;
            const drawWitdh = drawHeight * x2 / y2;
            const posX = (x1 - drawWitdh) / 2;
            const posY = y1 / 7;

            ctx.drawImage(leafImg, posX, posY, drawWitdh, drawHeight);
          }

          rabbitImg.src = URL.createObjectURL(rabbit);
          leafImg.src = URL.createObjectURL(leaf);
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
