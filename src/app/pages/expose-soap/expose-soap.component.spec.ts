import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposeSoapComponent } from './expose-soap.component';

describe('ExposeSoapComponent', () => {
  let component: ExposeSoapComponent;
  let fixture: ComponentFixture<ExposeSoapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExposeSoapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposeSoapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
