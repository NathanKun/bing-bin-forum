import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[limit-to]'
})
export class LimitToDirective {
  constructor() { }

  @Input('limit-to') limitTo;

  @HostListener('keypress', ['$event']) blockPress(e) {
    if (e.target.value.length >= +this.limitTo) e.preventDefault();
  }

  @HostListener('paste', ['$event']) blockPaste(e) {
    if (e.target.value.length >= +this.limitTo) {
      e.preventDefault();
    }
  }
}
