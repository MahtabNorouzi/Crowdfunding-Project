import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../../util/web3.service';

declare let require: any;
const project_artifacts = require('../../../../build/contracts/Project.json');
const crowdfunding_artifacts = require('../../../../build/contracts/Crowdfunding.json');


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
   projectData = [];

   projectContract:any;
  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
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
   

    //const projects = await deployedCrowdContract.returnAllProjects();
    projectsList = deployedCrowdContract.returnAllProjects();

    console.log('projectsList..:', projectsList);
    deployedCrowdContract.returnAllProjects().then((projects) => {
      
      

      this.web3Service.artifactsToContract(project_artifacts)
      .then((ProjectAbstraction) => {
        console.log('projects..:', projects.length);
        projects.forEach((projectAddress) => {
        ProjectAbstraction.at(projectAddress).then((data) => {
          console.log('data....:', data)
          data.getDetails()
          .then((res) => {
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



}
