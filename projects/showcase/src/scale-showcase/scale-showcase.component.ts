import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  HardwareScaleReportEvent,
  NgScalesConnectionButtonDirective,
  NgScalesService,
  ScaleOutputDisplayComponent
} from '../../../ng-scales/src';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scale-showcase',
  standalone: true,
  imports: [NgScalesConnectionButtonDirective, ScaleOutputDisplayComponent, AsyncPipe],
  templateUrl: './scale-showcase.component.html',
  styleUrl: './scale-showcase.component.scss'
})
export class ScaleShowcaseComponent {
  zeroed$: Observable<boolean> = this.scale.zeroed;
  reading$: Observable<boolean> = this.scale.reading;
  report$: Observable<HardwareScaleReportEvent> = this.scale.reportEvent();

  constructor(private scale: NgScalesService) {
  }
}
