
// Uncomment this line to use console.log
// import "hardhat/console.sol";

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Crowdfunding{
    mapping(address => uint) public contributors;
    address public admin;
    uint public noOfContributors;
    uint public minimumContribution;
    uint public deadline;//timestamp
    uint public goal;
    uint public raisedAmount;
    uint g;

    struct Request{
        string description;
        address payable recipient;
        uint value;
        bool completed;
        uint noOfVoters;
        mapping(address => bool) voters;
    }
    mapping(uint => Request) public requests;
    uint public numRequests;
    constructor(uint _goal , uint _deadline ){
        goal = _goal;
        deadline = block.timestamp + _deadline;
        minimumContribution = 100 wei;
        admin = msg.sender;
    }

    event ContributeEvent(address _sender , uint _value);
    event CreateRequestEvent(string _description , address _recipient , uint _value);
    event MakePaymentEvent(address _recipient , uint _value);


    function contribute() public payable{
        require(block.timestamp < deadline,"campaign has ended!!!");
        require(msg.value >= minimumContribution,"minimum contribution is 100 wei!!!");
        if(contributors[msg.sender] ==0){
            noOfContributors = noOfContributors+1;
        }
        contributors[msg.sender] += msg.value;
        raisedAmount += msg.value;

        emit ContributeEvent(msg.sender, msg.value);


    }

    receive() payable external {
        contribute();
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function getRefund() public {
        require(block.timestamp > deadline && raisedAmount<goal ,"cannot do refund");
        require(contributors[msg.sender]>0,"you didn't contribute money");
        address payable recipient = payable(msg.sender);
        uint value = contributors[msg.sender];
        recipient.transfer(value); 
        contributors[msg.sender] = 0;  
     }

     modifier onlyAdmin(){
        require(msg.sender == admin, "only admin can do this function");
        _;
     }

     function createRequest(string memory _description, address payable _recipient , uint _value) public onlyAdmin{
        Request storage newRequest = requests[numRequests];
        numRequests++;

        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.completed = false;
        newRequest.noOfVoters = 0;

        emit CreateRequestEvent(_description, _recipient, _value);

     }

     function voteRequest(uint _requestNo) public{
        require(contributors[msg.sender] >0 , "you're not a contributor,mind your own business");
        Request storage thisRequest = requests[_requestNo];
        require(thisRequest.voters[msg.sender] == false,"you've already voted");
        thisRequest.voters[msg.sender] = true;
        thisRequest.noOfVoters++;
     }

     function makePayment(uint _requestNo) public onlyAdmin{
        require(raisedAmount >= goal,"haven't reached the goal");
        Request storage thisRequest = requests[_requestNo];
        require(thisRequest.completed == false , "request is complete");
        require(thisRequest.noOfVoters > noOfContributors /2,"there are less voters");
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed = true;

        emit MakePaymentEvent(thisRequest.recipient, thisRequest.value);
     
}
}
