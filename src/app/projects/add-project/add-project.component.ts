import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import {ProjectService} from '../project.service';
import {Web3Service} from '../../util/web3.service';




declare let require: any;
const crowdfunding_artifacts = require('../../../../build/contracts/Crowdfunding.json');
const project_artifacts = require('../../../../build/contracts/Project.json');
const Web3 = require('web3');



@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  addActionForm: FormGroup;
   projectName: string;
   projectDescription='';
   duration=0;
   goal=0;

   crowdData: any;
   accounts: string[];
   account: string;
   projectData: any;

   projectContract:any;

  constructor(private projectService: ProjectService, private web3Service: Web3Service) {  }

  ngOnInit() {
    this.watchAccount();
    this.addActionForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      projectDescription: new FormControl('', Validators.required),
      duration: new FormControl(this.duration, Validators.required),
      goal: new FormControl(this.goal, Validators.required),
     });
  };

  

  async addProject() {
    this.web3Service.artifactsToContract(crowdfunding_artifacts)
    .then((CrowdfundingAbstraction) => {
      this.crowdData = CrowdfundingAbstraction;
      this.crowdData.deployed().then(deployed => {
        console.log('deployed');
        deployed.startProject(
          this.addActionForm.value.projectName,
          this.addActionForm.value.projectDescription,
          this.addActionForm.value.duration,
          this.addActionForm.value.goal,
          {from: this.accounts[0]}
        ).then((res) => {
           console.log('added project')
         });
      });

    });
 
  }


  submit(): void {
    console.log('Adding data..:', this.addActionForm.value)
    this.addProject();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
     
    });
  }

}
