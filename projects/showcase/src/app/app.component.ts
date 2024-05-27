import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import {
  HardwareScaleReportEvent,
  NgScalesConnectionButtonDirective,
  NgScalesService,
  provideNgScalesService,
  ScaleOutputDisplayComponent
} from '../../../ng-scales/src';
import { AsyncPipe } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgScalesConnectionButtonDirective, ScaleOutputDisplayComponent, AsyncPipe],
  providers: [
    provideNgScalesService()
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  zeroed$: Observable<boolean> = this.scale.zeroed;
  reading$: Observable<boolean> = this.scale.reading;
  report$: Observable<HardwareScaleReportEvent> = this.scale.reportEvent();

  constructor(private scale: NgScalesService) {
  }


}
