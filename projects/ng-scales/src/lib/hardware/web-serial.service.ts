import { Injectable } from '@angular/core';
import { NavigatorService } from './navigator.service';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSerialService {

  readonly supported: boolean;
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  constructor(
    private navigatorService: NavigatorService,
  ) {
    this.supported = this.navigatorService.serialSupported;
  }
  connect(options?: SerialPortRequestOptions, serialOptions: SerialOptions = { baudRate: 9600 }): Observable<void> {
    return new Observable<void>((observer) => {
      if (!this.supported) {
        observer.error('Web serial not supported.');
        return;
      }
      this.navigatorService.requestPort(options).then((port) => {
        this.port = port;
        this.port.open(serialOptions).then(() => {
          observer.next();
          observer.complete();
        }).catch((err) => observer.error(err));
      }).catch((err) => observer.error(err));
    });
  }

  read(): Observable<Uint8Array> {
    return new Observable<Uint8Array>((observer) => {
      this.reader = this.port?.readable?.getReader() || null;
      const reader: ReadableStreamDefaultReader<Uint8Array> | null = this.reader;
      if (!reader) {
        observer.error('Failed to get reader');
        return;
      }

      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            if (value) {
              observer.next(value);
            }
          }
        } catch (error) {
          observer.error(error);
        } finally {
          await reader.cancel().catch(() => {});
          reader.releaseLock();
          observer.complete();
        }
      };

      readLoop().catch((error) => observer.error(error));
    });
  }

  write(data: string): Observable<void> {
    return new Observable<void>((observer) => {
      if (!this.port) {
        observer.error('No port is open');
        return;
      }

      const writer = this.port.writable?.getWriter();
      if (!writer) {
        observer.error('Failed to get writer');
        return;
      }

      const dataToWrite = new TextEncoder().encode(data);
      writer.write(dataToWrite).then(() => {
        writer.releaseLock();
        observer.complete();
      }).catch((err) => {
        writer.releaseLock();
        observer.error(err);
      });
    });
  }

  close(): Observable<void> {
    return from(this.closePort());
  }

  private async closePort(): Promise<void> {
    if (this.port) {
      if (this.reader) {
        await this.reader.cancel();
        this.reader.releaseLock();
      }
      await this.port.close();
      this.port = null;
    }
  }
}
