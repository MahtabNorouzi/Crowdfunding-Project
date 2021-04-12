import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMoneyDialogComponent } from './require-money-dialog.component';

describe('RequireMoneyDialogComponent', () => {
  let component: RequireMoneyDialogComponent;
  let fixture: ComponentFixture<RequireMoneyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMoneyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMoneyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
