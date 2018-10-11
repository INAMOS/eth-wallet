pragma solidity ^0.4.23;

import "./Erc20.sol";
//import "../../math/SafeMath.sol";


contract Standar is Erc20
{
    
    string  name;
    uint256 decimals;
    uint256 totalSupply;
    string symbol;
    
    mapping(address=>uint256) balances;
    mapping(address=> mapping(address=>uint256 ))allowed;
    
    constructor(uint256 _initialAmount,string _tokenName,uint8 _decimalUnits,string _tokenSymbol) public {
        
        name=_tokenName;
        symbol=_tokenSymbol;
        totalSupply=_initialAmount;
        decimals=_decimalUnits;
        
        balances[msg.sender]=_initialAmount;
    
    }
    
    function transfer(address _to,uint256 _value)public returns(bool success){
        
        require(balances[msg.sender]>=_value && _value>0);
        
        balances[msg.sender]-=_value;
        balances[_to]+=_value;
        emit Transfer(msg.sender,_to,_value);
            
        return true;
        /*if(balances[msg.sender]>=_value && _value>0){
            
            balances[msg.sender]-=_value;
            balances[_to]+=_value;
            
            emit Transfer(msg.sender,_to,_value);
            
            return true;
        }*/
        
    }
    
    function balanceOf(address _owner) public constant returns(uint256 balance){
        return balances[_owner];
    }
    
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }
    
     function approve(address _spender, uint256 _value) public returns (bool success) {
        
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;

    }
    
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}