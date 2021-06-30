import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JssipWssConnectComponent } from './jssip-wss-connect.component';

describe('JssipWssConnectComponent', () => {
  let component: JssipWssConnectComponent;
  let fixture: ComponentFixture<JssipWssConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JssipWssConnectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JssipWssConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
