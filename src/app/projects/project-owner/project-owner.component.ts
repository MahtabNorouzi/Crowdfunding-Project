import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import Web3 from 'web3';

declare let require: any;
const project_artifacts = require('../../../../build/contracts/Project.json');
const crowdfunding_artifacts = require('../../../../build/contracts/Crowdfunding.json');
import {MatDialog} from '@angular/material/dialog';
import { InvestmentContractDialogComponent } from '../../investment-contract-dialog/investment-contract-dialog.component';
import { RequireMoneyDialogComponent } from '../../require-money-dialog/require-money-dialog.component';


@Component({
  selector: 'app-project-owner',
  templateUrl: './project-owner.component.html',
  styleUrls: ['./project-owner.component.css']
})
export class ProjectOwnerComponent implements OnInit {
  projectName=''
   projectDescription=''
   duration=0;
   goal=0;

   crowdData: any;
   accounts: string[];
   account: string;
   projectContractList = [];
   projectData = [];
  constructor(private web3Service: Web3Service, public dialog: MatDialog) { }

  ngOnInit() {
    //this.watchAccount();
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
      //Web3.eth.defaultAccount = '0xaE70248aEDf893cFA1363C9A1488f7622bC84CB7'
      console.log('account[0]..:', this.account)
     
  
    this.web3Service.artifactsToContract(crowdfunding_artifacts)
    .then((CrowdfundingAbstraction) => {
     
      this.crowdData = CrowdfundingAbstraction;
      this.getProjects();
    });
  });
  }

  async getProjects() {
    let projectsList=[];
    var now = new Date().getTime();
    var timeleft;
    // Operations for retrieving all existing projects will be here!
    console.log('Get projects!');

    const deployedCrowdContract = await this.crowdData.deployed();

  
    deployedCrowdContract.returnMyOwnProjects( {from: this.account}).then((projects) => {
      console.log('Despues....!');  
      

      this.web3Service.artifactsToContract(project_artifacts)
      .then((ProjectAbstraction) => {
        console.log('projects..:', projects.length);
        this.projectContractList = projects
        projects.forEach((projectAddress) => {
        ProjectAbstraction.at(projectAddress).then((data) => {
          console.log('data....:', data)
          data.getDetails()
          .then((res) => {
            res.requestValue =  Web3.utils.fromWei(res.requestValue, 'ether'),
            res.goalAmount = Web3.utils.fromWei(res.goalAmount, 'ether'),
            res.currentAmount = Web3.utils.fromWei(res.currentAmount, 'ether'),
            console.log('res.goalAmount.:', res.goalAmount),
            console.log('res.currentAmount.:', res.currentAmount),
            res.raised = (res.currentAmount * 100) / res.goalAmount,
            timeleft = (new Date(res.deadline* 1000)).getTime()  - now,
            res.day = Math.floor(timeleft / (1000 * 60 * 60 * 24));
            res.hour = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            res.minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            //var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
            res.deadline = (new Date(res.deadline* 1000)).getDate(),
            res.state = res.currentState.toString(10),
            res.sentToOwner = res.goalAmount - res.currentAmount,
            this.projectData.push(res);

          });
         });
        });
       });
      
    });

  }

  openDialog(data: any, index) {

      const dialogRef = this.dialog.open(RequireMoneyDialogComponent, {
        width: '250px',
        backdropClass: 'custom-dialog-backdrop-class',
        panelClass: 'custom-dialog-panel-class',
        data: { projectTitle: data.projectTitle}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.requestMoney(data, result.data, index)

        }
        console.log('data received...:', result.data); 

      });

   
  }

async requestMoney(data, amount, index) {
    // Operations for requesting funding transfer is here
    console.log('Fund project!');
     if (!amount) {
  return;
    }
  console.log('Amount..!', amount);
  console.log('account..:', this.account)
  console.log('this.projectContractList...:', this.projectContractList)
  const projectContract = this.projectContractList[index];   
  console.log('projectContract..:', projectContract)
  this.web3Service.artifactsToContract(project_artifacts)
    .then((ProjectAbstraction) => {
  ProjectAbstraction.at(projectContract).then((data) => {
    console.log('ins..:', projectContract)
    data.createRequest(
      'money request',
      Web3.utils.toWei(amount, 'ether'),
      { from: this.account}
   ).then((res) => {
    console.log('request created:')
    console.log('res ...:', res)
   
});
  });
})


}

watchAccount() {
  this.web3Service.accountsObservable.subscribe((accounts) => {
    this.accounts = accounts;
    this.account = accounts[0];
    //Web3.eth.defaultAccount = '0xaE70248aEDf893cFA1363C9A1488f7622bC84CB7'
    console.log('account[0]..:', this.account)
   
  });
}

}
