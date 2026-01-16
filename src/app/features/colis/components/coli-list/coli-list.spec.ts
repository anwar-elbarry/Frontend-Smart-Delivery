import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColiList } from './coli-list';

describe('ColiList', () => {
  let component: ColiList;
  let fixture: ComponentFixture<ColiList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColiList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColiList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
