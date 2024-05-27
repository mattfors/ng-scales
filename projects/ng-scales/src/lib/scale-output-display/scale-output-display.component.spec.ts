import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleOutputDisplayComponent } from './scale-output-display.component';

describe('ScaleOutputDisplayComponent', () => {
  let component: ScaleOutputDisplayComponent;
  let fixture: ComponentFixture<ScaleOutputDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaleOutputDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScaleOutputDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
