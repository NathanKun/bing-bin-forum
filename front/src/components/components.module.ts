import { NgModule } from '@angular/core';
import { PopoverCardComponent } from './popover-card/popover-card';
import { PopoverComponent } from './popover/popover';
import { PopSearchComponent } from './popsearch/popsearch';
@NgModule({
	declarations: [PopoverCardComponent,
    PopoverComponent,
    PopSearchComponent],
	imports: [],
	exports: [PopoverCardComponent,
    PopoverComponent,
    PopSearchComponent]
})
export class ComponentsModule {}
