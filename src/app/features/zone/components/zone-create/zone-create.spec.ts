import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneCreate } from './zone-create';

describe('ZoneCreate', () => {
  let component: ZoneCreate;
  let fixture: ComponentFixture<ZoneCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
