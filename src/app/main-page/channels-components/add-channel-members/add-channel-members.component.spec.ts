import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelMembersComponent } from './add-channel-members.component';

describe('AddChannelMembersComponent', () => {
  let component: AddChannelMembersComponent;
  let fixture: ComponentFixture<AddChannelMembersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddChannelMembersComponent]
    });
    fixture = TestBed.createComponent(AddChannelMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
