import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebrtcTestComponent } from './webrtc-test.component';

describe('WebrtcTestComponent', () => {
  let component: WebrtcTestComponent;
  let fixture: ComponentFixture<WebrtcTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebrtcTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebrtcTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
