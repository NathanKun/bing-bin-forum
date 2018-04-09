import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventOpenPage } from './event-open';

@NgModule({
  declarations: [
    EventOpenPage,
  ],
  imports: [
    IonicPageModule.forChild(EventOpenPage),
  ],
})
export class EventOpenPageModule {}
