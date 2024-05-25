import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleDisplayComponent } from './scale-display.component';

describe('ScaleDisplayComponent', () => {
  let component: ScaleDisplayComponent;
  let fixture: ComponentFixture<ScaleDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaleDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScaleDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
