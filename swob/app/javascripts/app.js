//var accounts;
var account;
//var workbook;
//import "swob/contracts/Swob.sol";
//var Swob = require ("/home/theuser/swob/build/contracts/Swob.sol.js");
//var SimpleNameRegistry = require("example-truffle-library/build/contracts/SimpleNameRegistry.sol.js");
//var Web3 = require('web3');
var Web3 = require("/usr/lib/node_modules/truffle/node_modules/web3-provider-engine/node_modules/web3");
var web3 = new Web3();
//var web3 = require('ethereum.js');
//var Web3 = require('./node_modules/web3');


//function createWorkBook(){
//if(typeof require !== 'undefined') XLSX = require('xlsx');
//workbook = XLSX.readFile('out.xlsx');
//console.log("hej");
//setStatus("Hej");
/* DO SOMETHING WITH workbook HERE */
//}

module.exports = function(callback) {
{
}
console.log("hej");
printNodeId();
//printNodeId();
//setStatus("hello");
// perform actions
}
//var SimpleNameRegistry = require("example-truffle-library/build/contracts/SimpleNameRegistry.sol.js");

//module.exports = function(deployer) {
  // Deploy our contract, then set the address of the registry.
  //deployer.deploy(MyContract).then(function() {
    //MyContract.deployed().setRegistry(SimpleNameRegistry.address);
  //});
//};

//function setStatus(message) {
//  var status = document.getElementById("status");
//  status.innerHTML = message;
//};

function printNodeId(){
  var swob = Swob.deployed();
  swob.getNodeId.call({from: account}).then(function(value){
var nodeId= 87;
    console.log(Swob.deployed());
console.log(nodeId);

//    var node_elem = document.getElementById("node");
  //  node_elem.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    //setStatus("Error printing node id; see log.");
  });
};


function getBalance(){
  var swob=Swob.deployed();

  swob.getBalance.call(account, {from:account}).then(function(value){
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = value.valueOf();
  }).catch(function (e){
    console.log(e);
    setStatus("Error getting balance; see log.");
  });
};



function sendCall(){

  var swob = Swob.deployed();

  var nodeId = parseInt(document.getElementById("nodeId").value);
  var software = parseInt(document.getElementById("software").value);
  var hardware = parseInt(document.getElementById("hardware").value);
  var timestamp = parseInt(document.getElementById("timestamp").value);

  swob.sendCall.call(nodeId, software, hardware, timestamp, {from: account}).then(function(){


    setStatus("Query placed!");
  }).catch(function(e){
    console.log(e);
    //setStatus("Error sending call, see log.");
  });
};
//getBalance();
/*window.onload = function() {
web3.eth.getAccounts(function(err, accs) {
if (err != null) {
alert("There was an error fetching your accounts.");
return;
}

if (accs.length == 0) {
alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
return;
}

accounts = accs;
account = accounts[0];

getBalance();*/
//createWorkBook();
//var balance = web3.eth.getBalance("0xb32d9abb4db676cdadecef0986f8279d9afd5b80");
//console.log(balance.valueOf());

//console.log(accounts[0]);
//  });
//}
