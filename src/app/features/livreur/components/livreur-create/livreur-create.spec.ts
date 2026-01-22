import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurCreate } from './livreur-create';

describe('LivreurCreate', () => {
  let component: LivreurCreate;
  let fixture: ComponentFixture<LivreurCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreurCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreurCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
