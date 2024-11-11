import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleShowcaseComponent } from './scale-showcase.component';

describe('ScaleShowcaseComponent', () => {
  let component: ScaleShowcaseComponent;
  let fixture: ComponentFixture<ScaleShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaleShowcaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScaleShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
