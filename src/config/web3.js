var Web3=require('web3');
var web3Key=process.env.INFURA_KEY;

const ropsten=`https://ropsten.infura.io/${web3Key}`;
//const localhost='https://localhost:8545';

var web3=new Web3(ropsten); 


module.exports=web3;