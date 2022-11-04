import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoV3Component } from './auto-v3.component';

describe('AutoV3Component', () => {
  let component: AutoV3Component;
  let fixture: ComponentFixture<AutoV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoV3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
