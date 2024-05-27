import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-scale-output-display',
  standalone: true,
  imports: [],
  templateUrl: './scale-output-display.component.html',
  styleUrl: './scale-output-display.component.css'
})
export class ScaleOutputDisplayComponent {

  @Input()
  zeroed!: boolean;

  @Input()
  reading!: boolean;

  @Input()
  weight!: number | undefined;

  @Input()
  units!: string | undefined;


}
