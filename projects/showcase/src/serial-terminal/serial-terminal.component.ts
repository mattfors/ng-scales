import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { WebSerialService } from '../../../ng-scales/src/lib/hardware/web-serial.service';
import { NgScalesConnectionButtonDirective } from '../../../ng-scales/src';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-serial-terminal',
  standalone: true,
  imports: [
    NgScalesConnectionButtonDirective,
    FormsModule,
    CommonModule
  ],
  templateUrl: './serial-terminal.component.html',
  styleUrl: './serial-terminal.component.scss'
})
export class SerialTerminalComponent implements OnDestroy {

  serialCommand: string = '';
  accumulatedData: string = '';
  connected: boolean = false;
  @ViewChild('dataTextarea') dataTextarea!: ElementRef<HTMLTextAreaElement>;


  constructor(private webSerialService: WebSerialService) {
  }

  connect(): void {
    this.webSerialService.connect().subscribe({
      next: () => {
        this.connected = true;
        this.read()
      },
      error: (error) => this.addData(error)
    });
  }

  close(): void {
    this.webSerialService.close().subscribe({
      next: () => {
        this.addData('Serial port closed')
        this.connected = false;
        },
      error: (error) => {console.log(error);this.addData('Error closing serial port', error);}
    });
  }

  write(): void {
    this.webSerialService.write(this.serialCommand + '\r').subscribe({
      next: () => this.serialCommand = '',
      error: (error) => this.addData(error)
    });
  }

  private read(): void {
    this.webSerialService.read().pipe(map((value) => new TextDecoder().decode(value)),).subscribe({
      next: (value) => this.addData(value, false),
      error: (error) => this.addData(error)
    });
  }

  private addData(value: string, newline: boolean = true): void {
    this.accumulatedData += value + (newline ? '\n' : '');
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.dataTextarea.nativeElement.scrollTop = this.dataTextarea.nativeElement.scrollHeight;
    }, 0);
  }

  ngOnDestroy(): void {
    this.close();
  }
}
