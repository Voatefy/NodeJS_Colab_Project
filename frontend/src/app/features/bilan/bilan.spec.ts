import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bilan } from './bilan';

describe('Bilan', () => {
  let component: Bilan;
  let fixture: ComponentFixture<Bilan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bilan],
    }).compileComponents();

    fixture = TestBed.createComponent(Bilan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
