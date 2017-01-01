//var accounts;
var account;
var workbook;
var sheet_name_list;
var swob = Swob.deployed();
  var match ={node:null, hardW:null, softW:null, timeS:null};
//import "swob/contracts/Swob.sol";
//var Swob = require ("/home/theuser/swob/build/contracts/Swob.sol.js");
//var SimpleNameRegistry = require("example-truffle-library/build/contracts/SimpleNameRegistry.sol.js");
//var Web3 = require('web3');
var Web3 = require("/usr/lib/node_modules/truffle/node_modules/web3-provider-engine/node_modules/web3");
var web3 = new Web3();
//var web3 = require('/usr/lib/node_modules/truffle/node_modules/ethereum.js');
//var Web3 = require('/usr/lib/node_modules/truffle/node_modules/web3');


module.exports = function(callback) {

setProvider();
getAddresses();
createWorkBook();
swob.startCall(123456);
getNodeId();
table1(123456);
swob.foundMatch(match.softW, match.hardW, match.timeS);
getLeader();
}


function setProvider(){
  if(!web3.currentProvider){
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"))};
  console.log(web3.currentProvider);
}

function getAddresses(){
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
console.log("kolla här, adress nummer 5: " + accounts[4]);

  });
}



function createWorkBook(){
  if(typeof require !== 'undefined') XLSX = require('/usr/lib/node_modules/truffle/node_modules/xlsx');
  workbook = XLSX.readFile('/home/linnea/swob/app/javascripts/out.xlsx');
  sheet_name_list = workbook.SheetNames;
}

function table1(id){
  var nodeId=id;
  match.node=nodeId;
  var worksheet = workbook.Sheets[sheet_name_list[0]];
   //FULHACK
  var range = worksheet['!ref'];
  var found=false;
  var end = range[range.length-1];
  var hardware;
  console.log(range);

  for(i=1; i<=end; i++){
    var row = 'A'+i;
    var value = worksheet[row].v;

    if(value == nodeId){
      found=true;
      hardware = worksheet['B'+i];
      match.hardW=hardware.v;
      console.log("hardware: " + hardware.v);
    }

    console.log(value);
  }
    if (found){
      console.log("the value was found");
      table2(hardware.v);
    }
    else{console.log("didnt find value");
    }
}

function table2(hw){
  var hardware=hw;
  var software;
  var worksheet = workbook.Sheets[sheet_name_list[1]];
   //FULHACK
  var range = worksheet['!ref'];
  var found=false;
  var end = range[range.length-1];
  console.log(range);

  for(i=1; i<=end; i++){
    var row = 'A'+i;
    var value = worksheet[row].v;
    console.log("value: " + value + " hardware: " + hardware);
    if(value == hardware){
      found=true;
      software = worksheet['B'+i];
      match.softW=software.v;
      match.timeS=123455666;
      console.log("software: " + software.v);
    }

    console.log(value);
  }
     if (found){
       console.log("the value was found");
     }
     else{console.log("didnt find value");}
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

/*function printNodeId(){
  var swob = Swob.deployed();
  swob.getNodeId.call({from: account}).then(function(value){
var nodeId= 87;
    //console.log(Swob.deployed());
console.log(nodeId);

//    var node_elem = document.getElementById("node");
  //  node_elem.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    //setStatus("Error printing node id; see log.");
  });
};
});*/







function getNodeId(){
swob.getNodeId({from: account}).then(function(value){
  console.log("Node id has been set to:" + value);
})
  };

function getLeader(){
  swob.leader({from: account}).then(function(value){
    console.log("Leader is: " + value);
  })
};

function getBalance(){

  swob.getBalance.call(account, {from:account}).then(function(value){
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = value.valueOf();

  }).catch(function (e){
    console.log(e);
    //setStatus("Error getting balance; see log.");
  });
};



function sendCall(){


  var nodeId = parseInt(document.getElementById("nodeId").value);
  var software = parseInt(document.getElementById("software").value);
  var hardware = parseInt(document.getElementById("hardware").value);
  var timestamp = parseInt(document.getElementById("timestamp").value);

  swob.sendCall.call(nodeId, software, hardware, timestamp, {from: account}).then(function(){


    //setStatus("Query placed!");
  }).catch(function(e){
    console.log(e);
    //setStatus("Error sending call, see log.");
  });
};
//getBalance();
/*window.onload = function() {
//}
