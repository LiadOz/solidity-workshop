//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;

contract SafeMath {

    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }

    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
}

//-------------------------------------------------------------------------------------------------

interface ERC20Interface {
    function totalSupply() external returns (uint);
    function balanceOf(address tokenOwner) external returns (uint balance);
    function allowance(address tokenOwner, address spender) external returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

//-------------------------------------------------------------------------------------------------

contract Tags is ERC20Interface, SafeMath {
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;


    // Constructor
    constructor() {
        symbol = "Tags";
        name = "Tags";
        decimals = 2;
        _totalSupply = 100000;
        balances[0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199] = 50000;
        balances[0xdD2FD4581271e230360230F9337D5c0430Bf44C0] = 50000;
    }

    function totalSupply() public view override returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public view override returns (uint balance) {
        return balances[tokenOwner];
    }

    function transfer(address to, uint tokensAmount) public override returns (bool success) {
        require(tokensAmount <= balances[msg.sender]);
        balances[msg.sender] = safeSub(balances[msg.sender], tokensAmount);
        balances[to] = safeAdd(balances[to], tokensAmount);
        emit Transfer(msg.sender, to, tokensAmount);
        return true;
    }

    function approve(address delegate, uint tokensAmount) public override returns (bool success) {
        allowed[msg.sender][delegate] = tokensAmount;
        emit Approval(msg.sender, delegate,tokensAmount);
        return true;
    }

    function transferFrom(address owner, address to, uint tokensAmount) public override returns (bool success) {
        require(tokensAmount <= balances[owner]);
        require(tokensAmount <= allowed[owner][msg.sender]);
        balances[owner] = safeSub(balances[owner], tokensAmount);
        allowed[owner][msg.sender] = safeSub(allowed[owner][msg.sender], tokensAmount);
        balances[to] = safeAdd(balances[to], tokensAmount);
        emit Transfer(owner, to, tokensAmount);
        return true;
    }

    function allowance(address owner, address delegate) public view override returns (uint remaining) {
        return allowed[owner][delegate];
    }

}
