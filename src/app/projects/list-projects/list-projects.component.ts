import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import Web3 from 'web3';

declare let require: any;
const project_artifacts = require('../../../../build/contracts/Project.json');
const crowdfunding_artifacts = require('../../../../build/contracts/Crowdfunding.json');
import {MatDialog} from '@angular/material/dialog';
import { InvestmentContractDialogComponent } from '../../investment-contract-dialog/investment-contract-dialog.component';
import { InvestmentDialogComponent } from '../../investment-dialog/investment-dialog.component';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {

  projectName=''
   projectDescription=''
   duration=0;
   goal=0;

   crowdData: any;
   accounts: string[];
   account: string;
   projectContractList = [];
   projectData = [];

   projectContract:any;
  constructor(private web3Service: Web3Service, public dialog: MatDialog) { }

  ngOnInit() {
    this.watchAccount();
    this.web3Service.artifactsToContract(crowdfunding_artifacts)
    .then((CrowdfundingAbstraction) => {
     
      this.crowdData = CrowdfundingAbstraction;
      this.getProjects();
    });

    
  }

  async getProjects() {
    let projectsList=[];
    // Operations for retrieving all existing projects will be here!
    console.log('Get projects!');

    const deployedCrowdContract = await this.crowdData.deployed();

    //projectsList = deployedCrowdContract.returnAllProjects();

    //console.log('projectsList..:', projectsList);
    deployedCrowdContract.returnAllProjects().then((projects) => {
      
      

      this.web3Service.artifactsToContract(project_artifacts)
      .then((ProjectAbstraction) => {
        console.log('projects..:', projects.length);
        this.projectContractList = projects
        projects.forEach((projectAddress) => {
        ProjectAbstraction.at(projectAddress).then((data) => {
          console.log('data....:', data)
          data.getDetails()
          .then((res) => {
            res.goalAmount = Web3.utils.fromWei(res.goalAmount, 'ether'),
            res.currentAmount = Web3.utils.fromWei(res.currentAmount, 'ether'),
            console.log('res....', res)
            console.log('resdatos....:', res.goalAmount.toString())
            console.log('fundRaisingDeadline....:', res.deadline.toString()) 
            console.log('fundRaisingDeadline....:', res.currentAmount.toString()) 
            console.log('Title....:', res.projectTitle) 
            this.projectData.push(res);

          });
         });
        });
       });
      
    });

  }

  openDialog(data: any, index) {
    const dialogRef = this.dialog.open(InvestmentContractDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result) {
      const dialogRef = this.dialog.open(InvestmentDialogComponent, {
        width: '250px',
        backdropClass: 'custom-dialog-backdrop-class',
        panelClass: 'custom-dialog-panel-class',
        data: { projectTitle: data.projectTitle}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.fundProject(data, result.data, index)
        }
        console.log('data received...:', result.data); 

      });
      }
    });
  }

async fundProject(data, amount, index) {
    // Operations for funding an existing crowdfunding project will be here!
    console.log('Fund project!');
     if (!amount) {
  return;
    }

    console.log('account..:', this.account)
    console.log('this.projectContractList...:', this.projectContractList)
  const projectContract = this.projectContractList[index];   
  console.log('projectContract..:', projectContract)
  this.web3Service.artifactsToContract(project_artifacts)
    .then((ProjectAbstraction) => {
  ProjectAbstraction.at(projectContract).then((data) => {
    data.contribute({ 
      from: this.account,
      value: Web3.utils.toWei(amount, 'ether'),
    }).send()
    .then((res) => {
    console.log('res, event ...:', res)
    console.log('res, 2 ...:', res.receipt)
    const newTotal = parseInt(res.events.FundingReceived.returnValues.currentTotal, 10);
    const projectGoal = parseInt(data.goalAmount, 10);
    data.currentAmount = newTotal
    if (newTotal >= projectGoal) {
      data.currentState = 2;
    }
});
  });
})


}

watchAccount() {
  this.web3Service.accountsObservable.subscribe((accounts) => {
    this.accounts = accounts;
    this.account = accounts[0];
    console.log('account[0]..:', this.account)
   
  });
}
}
