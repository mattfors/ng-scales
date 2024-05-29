import { NgScalesConnectionButtonDirective } from './ng-scales-connection-button.directive';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockScaleService, provideNgScalesForTest } from '../hardware/mock-scale.service';


describe('NgScalesConnectionButtonDirective', () => {

  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let scale: MockScaleService;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [
        NgScalesConnectionButtonDirective,
        TestComponent
      ],
      providers: [provideNgScalesForTest()]
    }).createComponent(TestComponent);
    fixture.detectChanges();
    de = fixture.debugElement.queryAll(By.directive(NgScalesConnectionButtonDirective))[0];
    scale = TestBed.inject(MockScaleService);
  });

  it('should set text to Connect when waiting to connect', () => {
    expect(de.nativeElement.textContent).toEqual('Connect');
  });

  it('should set text to Disconnect when connected', () => {
    de.nativeElement.click();
    expect(de.nativeElement.textContent).toEqual('Disconnect');
  });

  it('should set text to Reconnect when connected and then disconnected',() => {
    de.nativeElement.click();
    de.nativeElement.click();
    expect(de.nativeElement.textContent).toEqual('Reconnect');
  });
});

@Component({
  standalone: true,
  template: `<button libNgScalesConnectionButton></button>`,
  imports: [NgScalesConnectionButtonDirective]
})
class TestComponent {}
