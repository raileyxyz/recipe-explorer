import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinWheelPage } from './spin-wheel.page';

describe('SpinWheelPage', () => {
  let component: SpinWheelPage;
  let fixture: ComponentFixture<SpinWheelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinWheelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
