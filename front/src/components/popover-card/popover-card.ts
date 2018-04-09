import { Component } from '@angular/core';

/**
 * Generated class for the PopoverCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover-card',
  templateUrl: 'popover-card.html'
})
export class PopoverCardComponent {

  text: string;

  constructor() {
    console.log('Hello PopoverCardComponent Component');
    this.text = 'Hello World';
  }

}
