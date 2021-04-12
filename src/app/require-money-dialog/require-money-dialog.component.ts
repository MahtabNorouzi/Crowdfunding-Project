import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-require-money-dialog',
  templateUrl: './require-money-dialog.component.html',
  styleUrls: ['./require-money-dialog.component.css']
})
export class RequireMoneyDialogComponent implements OnInit {

  projectTitle: string;
  investmentAmount: string;
  constructor(public dialogRef: MatDialogRef<RequireMoneyDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.projectTitle = data.projectTitle;
      console.log('this.projectTitle..:', this.projectTitle)
    }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.investmentAmount });
  }

}
