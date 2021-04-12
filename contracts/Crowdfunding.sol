
// We will be using Solidity version 0.5.4
//pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
// Importing OpenZeppelin's SafeMath Implementation
//import 'SafeMath.sol';
import "./SafeMath.sol";


contract Crowdfunding {
    using SafeMath for uint256;

    // List of existing projects
    Project[] private projects;

    // Event that will be emitted whenever a new project is started
    event ProjectStarted(
        address contractAddress,
        address projectStarter,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 goalAmount,
        string projectImage
        //string projectRentability
    );

    /** @dev Function to start a new project.
      * @param title Title of the project to be created
      * @param description Brief description about the project
      * @param durationInDays Project deadline in days
      * @param amountToRaise Project goal in wei
      * @param image Project Image
      * @param rentability Project rentability
      */
    function startProject(
        string calldata title,
        string calldata description,
        uint durationInDays,
        uint amountToRaise,
        string calldata image,
        uint rentability,
        uint minInvestment
    ) external {
        uint raiseUntil = now.add(durationInDays.mul(1 days));
        Project newProject = new Project(msg.sender, title, description, raiseUntil, amountToRaise, image, rentability, minInvestment);
        projects.push(newProject);
        emit ProjectStarted(
            address(newProject),
            msg.sender,
            title,
            description,
            raiseUntil,
            amountToRaise,
            image
            //rentability
        );
    }                                                                                                                                   



    /** @dev Function to get all projects' contract addresses.
      * @return A list of all projects' contract addreses
      */
    function returnAllProjects() external view returns(Project[] memory){
        return projects;
    }

      /** @dev Function to get all projects' contract addresses.
      * @return A list of all projects' contract addreses
      */
    function returnMyOwnProjects() external view returns(Project[] memory){
        //Project[] memory results;
        //uint j = 0;
       
        //for(uint i = 0 ; i<projects.length; i++) {
          //if( msg.sender == projects[i].creator()) {
            //  results[j++] = projects[i];
         //}
        //}
        //return results;
        return projects;
    }
}

contract Project {
    using SafeMath for uint256;
    
    // Data structures
    enum State {
        Fundraising,
        Expired,
        Successful
    }

    struct Request{
        string description;
        uint value;
        //address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] private requests;

    // State variables
    address payable public creator;
    uint public amountGoal; // required to reach at least this much, else everyone gets refund
    uint public completeAt;
    uint256 public currentBalance;
    uint public raiseBy;
    string public title;
    string public description;
    string public image;
    uint public rentability;
    uint public minInvestment;
    State public state = State.Fundraising; // initialize on create
    mapping (address => uint) public contributions;

    // Event that will be emitted whenever funding will be received
    event FundingReceived(address contributor, uint amount, uint currentTotal);
    // Event that will be emitted whenever the project starter has received the funds
    event CreatorPaid(address recipient, uint value);

    // Modifier to check current state
    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    // Modifier to check if the function caller is the project creator
    modifier isCreator() {
        require(msg.sender == creator);
        _;
    }

    constructor
    (
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint fundRaisingDeadline,
        uint goalAmount,
        string memory projectImage,
        uint projectRentability,
        uint minimalInvestment
    ) public {
        creator = projectStarter;
        title = projectTitle;
        description = projectDesc;
        amountGoal = goalAmount;
        raiseBy = fundRaisingDeadline;
        currentBalance = 0;
        image = projectImage;
        rentability = projectRentability;
        minInvestment = minimalInvestment;
    }

    /** @dev Function to fund a certain project.
      */
    function contribute() external inState(State.Fundraising) payable {
        //require(msg.sender != creator);
        contributions[msg.sender] = contributions[msg.sender].add(msg.value);
        currentBalance = currentBalance.add(msg.value);
        emit FundingReceived(msg.sender, msg.value, currentBalance);
        checkIfFundingCompleteOrExpired();
    }

    /** @dev Function to change the project state depending on conditions.
      */
    function checkIfFundingCompleteOrExpired() public {
        if (currentBalance >= amountGoal) {
            state = State.Successful;
            //payOut();
            firstPayOut();
        } else if (block.timestamp > raiseBy)  {
            state = State.Expired;
        }
        completeAt = block.timestamp;
    }

    /** @dev Function to give the received funds to project starter.
      */
    function payOut() internal inState(State.Successful) returns (bool) {
        uint256 totalRaised = currentBalance;
        currentBalance = 0;

        if (creator.send(totalRaised)) {
            emit CreatorPaid(creator, totalRaised);
            return true;
        } else {
            currentBalance = totalRaised;
            state = State.Successful;
        }

        return false;
    }

     /** @dev Function to give the received funds to project starter.
      */
    function firstPayOut() internal inState(State.Successful) returns (bool) {
        uint256 totalRaised = currentBalance;
        uint256 amoutToSend = (totalRaised * 30)/100;

        if (creator.send(amoutToSend)) {
            emit CreatorPaid(creator, amoutToSend);
            currentBalance = totalRaised - amoutToSend;
            return true;
        } else {
            currentBalance = totalRaised;
            state = State.Successful;
        }

        return false;
    }


    /** @dev Function to retrieve donated amount when a project expires.
      */
    function getRefund() public inState(State.Expired) returns (bool) {
        require(contributions[msg.sender] > 0);

        uint amountToRefund = contributions[msg.sender];
        contributions[msg.sender] = 0;

        if (!msg.sender.send(amountToRefund)) {
            contributions[msg.sender] = amountToRefund;
            return false;
        } else {
            currentBalance = currentBalance.sub(amountToRefund);
        }

        return true;
    }


    function isRequestsClosed() public view returns (bool) {
        if(requests.length == 0) {
            return true;
        }

        for(uint i = 0; i<requests.length; i++){
            if(!requests[i].complete){
              return false; //or whatever you want to do if it matches
          }
         else{
               return true;
             }
         }
       
    }

// Modifier to check if the function caller is the project creator
    modifier isAllRequestsClosed() {
        require(isRequestsClosed());
        _;
    }


   //function createRequest(string calldata reqDescription, uint reqValue) external  {
   function createRequest(string memory reqDescription, uint reqValue) public  returns (bool stat){
        Request memory newRequest = Request({
            description : reqDescription,
            value: reqValue,
            //recipient : recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
        return true;
    } 

    function approveRequest() public{
        Request storage request = requests[0];
        
        //require(approvers[msg.sender]);
        //require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

 
    function getDetails() public view returns 
    (
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint256 deadline,
        State currentState,
        uint256 currentAmount,
        uint256 goalAmount,
        string memory projectImage,
        uint256 projectRentability,
        uint256 minimalInvestment,
        uint256 requestValue,
        uint256 approvalsCount
    ) {
        projectStarter = creator;
        projectTitle = title;
        projectDesc = description;
        deadline = raiseBy;
        currentState = state;
        currentAmount = currentBalance;
        goalAmount = amountGoal;
        projectImage = image;
        projectRentability = rentability;
        minimalInvestment = minInvestment;
        requestValue = requests.length >= 1 ? requests[0].value : 0;
        approvalsCount = requests.length >= 1 ? requests[0].approvalCount : 0;

    }

    function getApprovals() public view returns (
         bool approvedRequest
    )
    {
        approvedRequest = false;
        if(requests.length >= 1) {
            if (requests[0].approvals[msg.sender]){
                approvedRequest = true;
            }
        }

    }
}