import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColiCreate } from './coli-create';

describe('ColiCreate', () => {
  let component: ColiCreate;
  let fixture: ComponentFixture<ColiCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColiCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColiCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
