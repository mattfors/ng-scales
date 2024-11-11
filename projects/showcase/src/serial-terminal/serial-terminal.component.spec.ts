import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialTerminalComponent } from './serial-terminal.component';

describe('SerialTerminalComponent', () => {
  let component: SerialTerminalComponent;
  let fixture: ComponentFixture<SerialTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerialTerminalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SerialTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
