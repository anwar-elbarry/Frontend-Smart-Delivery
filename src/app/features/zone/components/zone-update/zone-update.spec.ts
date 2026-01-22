import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneUpdate } from './zone-update';

describe('ZoneUpdate', () => {
  let component: ZoneUpdate;
  let fixture: ComponentFixture<ZoneUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
