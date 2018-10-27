const ABI=require('./src/contracts/abi');
var fromA="0xC46dEe054036aaa5Da7BC60973a3eac6631b9b7F";
var to="0x58ad3cb28d5dB9c15BBCa9A84E3f246A4020BA88";
var PK="c3a2bbc64d13d271ccd4a89f0c8388f61ddc00457eb26283181c45f074ae963a";
var tokenA="0x52e81483D03FdfAA89Cdd73Baf163D462e898bd9";

const web3=require('./src/config/web3');
const TX=require('ethereumjs-tx');

const receipt=null;

const token=new web3.eth.Contract(ABI,tokenA);

web3.eth.accounts.wallet.add('0x'+PK);

token.methods.transfer(to,10).send({from:fromA,gasPrice:'10000',gas:'100000'}).on('transactionHash', function(hash){
    console.log(hash);
});