import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { NgScalesService } from 'ng-scales';
import { HardwareScaleReportEvent } from '../../../ng-scales/src/lib/hardware/hardware-scale.interface';

@Component({
  selector: 'app-scale-display',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './scale-display.component.html',
  styleUrl: './scale-display.component.scss'
})
export class ScaleDisplayComponent {

  zeroed: Observable<boolean> = this.scale.zeroed;
  reading: Observable<boolean> = this.scale.reading;
  read: Observable<HardwareScaleReportEvent> = this.scale.reportEvent();

  constructor(private scale: NgScalesService) {
  }

}
