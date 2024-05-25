import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgScalesService } from '../ng-scales.service';

@Directive({
  selector: '[libNgScalesConnectionButton]',
  standalone: true
})
export class NgScalesConnectionButtonDirective implements OnInit, OnDestroy {

  private sub!: Subscription;
  private previouslyConnected: boolean = false;
  constructor(private el: ElementRef, private scale: NgScalesService) {}

  ngOnInit(): void {
    if (this.scale.supported) {
      this.sub = this.scale.connected.subscribe(c =>
        this.text = this.getDisplayText(c, this.previouslyConnected));
    } else {
      this.text = 'Not Supported'
      this.el.nativeElement.disabled = true;
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  @HostListener('click') onClick() {
    if (this.text === 'Disconnect') {
      this.scale.close().subscribe();
    } else if (this.text === 'Connect' || this.text === 'Reconnect') {
      this.scale.open().subscribe(() => this.previouslyConnected = true);
    }
  }

  private getDisplayText(connected: boolean, previously: boolean): string {
    switch (true) {
      case connected:
        return 'Disconnect';
      case previously && !connected:
        return 'Reconnect';
      default:
        return 'Connect';
    }
  }

  private set text(text: string) {
    this.el.nativeElement.textContent = text;
  }

  private get text(): string {
    return this.el.nativeElement.textContent;
  }

}
