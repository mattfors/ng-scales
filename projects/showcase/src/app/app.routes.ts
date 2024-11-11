import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SerialTerminalComponent } from '../serial-terminal/serial-terminal.component';
import { ScaleShowcaseComponent } from '../scale-showcase/scale-showcase.component';
import { LoadstarComponent } from '../loadstar/loadstar.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'serial-terminal', component: SerialTerminalComponent },
  { path: 'scale', component: ScaleShowcaseComponent }
];
