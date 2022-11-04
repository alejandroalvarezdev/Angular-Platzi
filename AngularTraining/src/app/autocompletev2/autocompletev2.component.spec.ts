import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Autocompletev2Component } from './autocompletev2.component';

describe('Autocompletev2Component', () => {
  let component: Autocompletev2Component;
  let fixture: ComponentFixture<Autocompletev2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Autocompletev2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Autocompletev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
