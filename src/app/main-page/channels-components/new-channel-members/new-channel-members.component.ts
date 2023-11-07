import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { UserService } from '../../../services/user.service';
import { ChannelErstellenComponent } from '../channel-erstellen/channel-erstellen.component';

@Component({
  selector: 'app-new-channel-members',
  templateUrl: './new-channel-members.component.html',
  styleUrls: ['./new-channel-members.component.scss'],
  standalone: true,
  imports: [
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    CommonModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewChannelMembersComponent implements OnInit {
  membersAdded = false;
  checked: boolean = false;
  showCheckbox: boolean = false;
  disabled = false;
  labelPosition: string;
  indeterminate = false;
  isButtonDisabled: boolean = false;
  buttonColor: string = '#444df2';
  channel: any;
  memberName: string = '';
  userName: string = '';
  memberMatches: any[] = [];
  allMatches: any[] = [];
  userMatches: any[] = [];
  selectedMembers: any[] = [];
  selectedMember: any = null;
  userFound = false;
  searchInput: string = '';

  public user = {
    id: this.sharedService.getID(),
    name: this.userService.getName() + '(Du)',
    imgProfil: this.userService.getPhoto(),
    type: 'user',
    channels: ['Office-team'],
    chat: [],
  };

  constructor(
    public dialogRef: MatDialogRef<NewChannelMembersComponent>,
    private sharedService: SharedService,
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.labelPosition = 'after';
    this.channel = data.channel;
  }

  ngOnInit(): void {
    const storedUserData = this.sharedService.getUserData();
    if (storedUserData) {
      this.user = storedUserData;
    }
  }

  /**
   * Close the dialog
   */
  closeAddNewChannelMembers() {
    this.dialogRef.close();
  }

  /**
   * the function is called when the user types in the input field to look for a member
   */
  async searchMembers() {
    this.allMatches = [];

    if (this.searchInput) {
      const members = await this.sharedService.getMembersFS();
      const users = await this.sharedService.getUsersFS();

      this.memberMatches = members.filter((member: any) =>
        member.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );

      this.userMatches = users.filter((user: any) =>
        user.name.toLowerCase().includes(this.searchInput.toLowerCase())
      );

      this.allMatches = this.memberMatches.concat(this.userMatches);
    }
  }

  /**
   * the function takes the foto of the member if it exists, otherwise it takes the default foto
   * @param member the member to get the foto
   */
  getImgProfil(member: any): string {
    if (member.imgProfil && member.imgProfil !== '') {
      return member.imgProfil;
    } else {
      return 'assets/img/avatars/avatar-1.png';
    }
  }

  /**
   * Add members to the channel
   */
  async addNewChannelMembers() {
    if (this.labelPosition === 'after') {
      await this.sharedService.getMembersFS();
      const officeTeamMembers = this.sharedService.members.filter((member) =>
        member.channels.includes('Office-team')
      );
      this.channel.members.push(...officeTeamMembers);
    } else {
      const selectedMembers = this.memberMatches.filter(
        (match) => match.selected
      );
      this.channel.members.push(...this.selectedMembers);

      this.memberMatches = [];
      this.selectedMembers = [];
    }
    if (this.channel.members.length > 0) {
      this.channel.members.push(this.user);
      this.sharedService.addChannelFS(this.channel);
      this.dialogRef.close(true);
    }
    this.dialogRef.close(ChannelErstellenComponent);
  }

  /**
   * Toggle the selection of a member when the user looks for a member
   * @param member the member to toggle the selection
   */
  toggleMemberSelection(member: any) {
    if (this.selectedMembers.includes(member)) {
    } else {
      member.selected = true;
      this.selectedMembers.push(member);
      this.isButtonDisabled = this.selectedMembers.length === 0;
      this.buttonColor = this.isButtonDisabled ? '#686868' : '#444df2';
      this.memberName = '';
      this.userFound = false;
    }
  }

  /**
   * the function removes a member from the selected members
   * @param member the member to remove
   */
  removeSelectedMember(member: any) {
    member.selected = false;
    this.selectedMembers = this.selectedMembers.filter((m) => m !== member);
    this.isButtonDisabled = this.memberMatches.every(
      (match) => !match.selected
    );
    this.isButtonDisabled = this.selectedMembers.length === 0;
    this.buttonColor = this.isButtonDisabled ? '#686868' : '#444df2';
  }

  /**
   * Change the color of the button and enable or disable it
   * @param value
   */
  onChangeRadioButton(value: string) {
    this.labelPosition = value;

    if (value === 'before') {
      this.showCheckbox = true;
      this.isButtonDisabled = true;
      this.buttonColor = '#686868';
    } else {
      this.showCheckbox = false;
      this.isButtonDisabled = false;
      this.buttonColor = '#444df2';
    }
  }

  /**
   * Disable the button if the user finds a member
   */
  lookForMember() {
    this.isButtonDisabled = false;
    this.buttonColor = '#444df2';
  }
}
