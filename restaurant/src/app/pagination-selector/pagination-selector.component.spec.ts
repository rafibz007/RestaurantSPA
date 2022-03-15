import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationSelectorComponent } from './pagination-selector.component';

describe('PaginationSelectorComponent', () => {
  let component: PaginationSelectorComponent;
  let fixture: ComponentFixture<PaginationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
