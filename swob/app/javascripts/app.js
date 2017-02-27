var rpcHosts=["http://localhost:8545",
"http://localhost:8546",
"http://localhost:8547",
"http://localhost:8548",
"http://localhost:8549",
"http://localhost:8550",
"http://localhost:8551",
"http://localhost:8552",
"http://localhost:8553",
"http://localhost:8554"];

var match1={node:123, hardW:55, softW:89};
var match2={node:123, hardW:55, softW:89};
var match3={node:123, hardW:55, softW:3333};
var match4={node:123, hardW:55, softW:4};
var match5={node:123, hardW:55, softW:4};
var matches=[match1, match2, match3, match4, match5];

var aux = require("/home/theuser/swob/app/javascripts/aux.js");
const readline = require('readline');
const Web3=require("/usr/lib/node_modules/truffle/node_modules/web3-provider-engine/node_modules/web3");
const web3=new Web3();
const fs = require('fs');
var node_exists = true;
var contract;
var swob;
var contractAddress = fs.readFileSync('/home/theuser/swob/app/addressInfo.txt','utf8');
var contractABI = fs.readFileSync('/home/theuser/swob/app/abi.js','utf8');
var contract = web3.eth.contract(JSON.parse(contractABI));
var swob = contract.at(contractAddress);

getClientNumber();

//getInfo();


function getClientNumber(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Which client are you running? ', (answer) => {
    setProv(answer);
    if (answer==1){
      //aux.deployContract().then(function(value){
        //console.log("Success: " + value);
        //console.log("contract address is: " + aux.getAddress());

      //  contract = web3.eth.contract(aux.getABI());
    //    swob = contract.at(value);
  //      var contractAddress = fs.readFileSync('/home/theuser/swob/app/addressInfo.txt','utf8');

          makeACheck(123);
          getInfo();
        //console.log(swob.result.call());
    //  });
//    }).catch(function(reason) {console.log("Error: " + reason)})
}

    else {
      var matchRequested = swob.called({_sender: "0xc9c628422a9a3ddff616cafb187bd6914d4e4da4"});
      matchRequested.watch(function(err, result) {
        if (err) {
          console.log(err)
          return;
        }
        else console.log("account 1 has sent a request for nodeId: " + result.args.n);
        // append details of result.args to UI
      })

    }


    rl.close();

  });
}

function setProv(cN){
  web3.setProvider(new web3.providers.HttpProvider(rpcHosts[cN-1]));
}

function printSomething(){
  console.log(swob.result.call().toString());
  console.log("my account is: " + web3.personal.listAccounts[0]);
  swob.startCall(9999999,{from:web3.personal.listAccounts[0], gas:2000000});
  console.log("Node id: " + swob.nodeId.call());
}

//console.log(contract.result.call());


/*
console.log(web3.currentProvider);
//makeACheck();
//setProvider();
const readline = require('readline');
*/

/*
var workbook;
var sheet_name_list;


var accounts;
module.exports = function(callback) {};


var accounts = web3.eth.accounts;
//web3.eth.defaultAccount=accounts[0]
createWorkBook();
//console.log(accounts[0]);

*/

/*
//makeStaticChecks(123);

//  swob.bubbleSortAllMatches();
//  swob.findBestMatch();
//console.log(accounts[0]);
//makeACheck(123);
//  getInfo();

//var event = Swob.deployed().called( {}, function(error, result) {
*/





/*function makeFiveChecks(nodeId){
swob=Swob.deployed();
swob.startCall(nodeId);
for(var i=0; i<5; i++){
web3.eth.defaultAccount=accounts[i];
matchingAlgo(nodeId, i);
if(node_exists){
swob.createMatch(matches[i].hardW, matches[i].softW, matches[i].timeS, {from: accounts[i]});
}
else console.log("node does not exist!");
}
}
*/
function makeACheck (nodeId){
  //swob = Swob.deployed();
  swob.startCall(nodeId, 2000000, {from: web3.eth.accounts[0]});
  if(node_exists){
    swob.createMatch(matches[0].hardW, matches[0].softW, matches[0].timeS, 2000000, {from: web3.personal.listAccounts[0]});
    //var event = swob.called({}, function(error, result){
    //if (!error) {
    //var msg = "account: " + result.args.caller + "has requested matches for node: " + result.args.n ;
    //  console.log(msg);
    //  }
    //else console.log("error");
    //});
    //var matchRequested = swob.called({_sender: "0xc9c628422a9a3ddff616cafb187bd6914d4e4da4"});
    //matchRequested.watch(function(err, result) {
    //if (err) {
    //console.log(err)
    //return;
    //  }
    //else console.log("account 1 has sent a request!");
    // append details of result.args to UI
    //})
  }
  else console.log("node does not exist!");
}



/*function makeStaticChecks(nodeId){
//swob=Swob.deployed();
swob.startCall(nodeId);
for(var i=0; i<5; i++){
//web3.eth.defaultAccount=accounts[i];
swob.createMatch(matches[i].hardW, matches[i].softW, matches[i].timeS, {from: all_accounts[i]});
}
}

function createWorkBook(){
//if(typeof require !== 'undefined') XLSX = require('/usr/lib/node_modules/truffle/node_modules/xlsx');
if(typeof require !== 'undefined') XLSX = require('/usr/lib/node_modules/xlsx');

//if(typeof require !== 'undefined') XLSX = require('/usr/lib/node_modules/xlsx/bin/xlsx.njs');
//workbook = XLSX.readFile('/home/linnea/swob/app/javascripts/out.xlsx');
workbook = XLSX.readFile('/home/theuser/swob/app/javascripts/out.xlsx');
sheet_name_list = workbook.SheetNames;
}

function table(id, sheet_number){
var worksheet = workbook.Sheets[sheet_name_list[sheet_number]];
var range = worksheet['!ref'];
var myRange = XLSX.utils.decode_range(range);
var end = myRange.e.r;
for(var i=1; i<=end; i++){
var row = 'A'+i;
//console.log("row: " + worksheet[row].v);
var value = worksheet[row].v;
if(value == id){
return (worksheet['B'+i].v);
}
}
return 0;
}

function matchingAlgo(number, t){
var answer1 = table(number, 0);
var answer2=0;

if (answer1!=0){
match.node=number;
match.hardW=answer1;
answer2=table(answer1, 1);
}

if (answer2!=0){
match.softW=answer2;
match.timeS = (t+1);
node_exists=true
}

else console.log("that node does not exist!");

matches.push(match);
};
*/
function getInfo(){

  console.log(swob.getBestMatch.call());
  //then(function(val1){
  //  console.log("Best match: " + val1);
  //  });
swob.getMatchFromList.call(0).then(function(value){
  console.log("Match number 0 "  + " is: " + value);
  //swob.getResult.call().then(function (value){
  //console.log(value);
  });

  console.log(swob.result.call());
}

//for(var i=0; i<5; i++){
//  swob.getMatchFromList.call(i).then(function(value){
//  console.log("Match number: " +i + " is: " + value);
//});
//}
//swob.getAMatch.call().then(function(value){
//console.log("Current match is: " + value);
//});
//  };*/
