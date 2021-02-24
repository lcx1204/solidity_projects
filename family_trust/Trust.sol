pragma solidity = 0.8.1;

/*
use in remix editor
javaScript VM for local environment
accounts are prefunded with 100 ethers

*/

contract Trust {
    // anyone can get a wallet with address, free of charge
    // address public kid;
    
    // public keyword means the variables can be accessed outside of the cotract
    // maturity is a date in unix timestamp format
    // uint public maturity;
    
    // by default 0
    // mapping(address => uint) public amounts;
    // mapping(address => uint) public maturities;
    // by default false
    // mapping(address => bool) public paid;
    
    // use a mapping of struct, instead of multiple mappings for
    // gas optimization, like the withdraw function, only query the
    // blockchain once
    
    struct Kid {
        uint amount;
        uint maturity;
        bool paid;
    }
    mapping(address => Kid) public kids;
    // restrict "addkid" only to the parents, so define a admin role
    address public admin;
    
    constructor() {
        // person who deploy the contract is the parent
        admin = msg.sender;
    }
    
    function addKid(address _kid, uint _timeToMaturity) external payable {
        require(msg.sender == admin, 'only admin');
        require(kids[_kid].amount == 0, 'the kid is already added');
        kids[_kid] = Kid(msg.value, block.timestamp + _timeToMaturity, false);
    }
    
    // "external" keyword  means the function can be called outside of the contract
    function withdraw() external {
        // storage keyword means a local variable
        Kid storage kid = kids[msg.sender];
        
        // require xx, otherwise error message
        require(kid.maturity <= block.timestamp, 'too early');
        require(kid.amount > 0, 'only kid can withdraw');
        require(kid.paid == false, 'paid already');
        
        kid.paid = true;
        // transfer from "this address" to "msg.sender"
        // need to cast address to "address payable" for solidity 0.8.1
        payable(msg.sender).transfer(kid.amount);
    }
}