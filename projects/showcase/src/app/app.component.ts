import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScaleDisplayComponent } from '../scale-display/scale-display.component';
import { NgScalesConnectionButtonDirective } from 'ng-scales';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScaleDisplayComponent, NgScalesConnectionButtonDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'showcase';
}
