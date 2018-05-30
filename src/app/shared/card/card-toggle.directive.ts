import {Directive, ElementRef, HostListener, Input} from '@angular/core';



@Directive({
    selector: '[cardToggleEvent]'
})

export class CardToggleDirective {
    constructor(private el: ElementRef) { }

    // tslint:disable-next-line:no-input-rename
    @Input('appHighlight') highlightColor: string;

    @HostListener('click', ['$event'])
    onToggle($event: any) {
        $event.preventDefault();
        this.el.nativeElement.classList.toggle('icon-up');
    }
}
