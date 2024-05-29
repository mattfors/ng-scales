import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { NgScalesService } from '../ng-scales.service';

const NOT_SUPPORTED: string = 'Not Supported';
const DISCONNECT: string = 'Disconnect';
const CONNECT: string = 'Connect';
const RECONNECT: string = 'Reconnect';

@Directive({
  selector: '[libNgScalesConnectionButton]',
  standalone: true,
})
export class NgScalesConnectionButtonDirective implements OnInit, OnDestroy {
  private sub!: Subscription;
  private previouslyConnected: boolean = false;
  constructor(
    private el: ElementRef,
    private scale: NgScalesService,
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.scale.connected,
      this.scale.supported,
    ]).subscribe(([connected, supported]) => {
      this.text = this.getDisplayText(
        connected,
        supported,
        this.previouslyConnected,
      );
      if (!supported) {
        this.el.nativeElement.disabled = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  @HostListener('click') onClick() {
    if (this.text === DISCONNECT) {
      this.scale.close().subscribe();
    } else {
      this.scale.open().subscribe(() => (this.previouslyConnected = true));
    }
  }

  private getDisplayText(
    connected: boolean,
    supported: boolean,
    previously: boolean,
  ): string {
    switch (true) {
      case !supported:
        return NOT_SUPPORTED;
      case connected:
        return DISCONNECT;
      case previously && !connected:
        return RECONNECT;
      default:
        return CONNECT;
    }
  }

  private set text(text: string) {
    this.el.nativeElement.textContent = text;
  }

  private get text(): string {
    return this.el.nativeElement.textContent;
  }
}
