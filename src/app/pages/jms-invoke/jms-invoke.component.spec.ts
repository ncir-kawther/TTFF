import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmsInvokeComponent } from './jms-invoke.component';

describe('JmsInvokeComponent', () => {
  let component: JmsInvokeComponent;
  let fixture: ComponentFixture<JmsInvokeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmsInvokeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmsInvokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
