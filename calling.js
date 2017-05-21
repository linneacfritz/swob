const Web3 = require("/usr/lib/node_modules/web3");
const web3 = new Web3();
const fs = require('fs');
const readline = require('readline');
const ports=["http://localhost:8545",
"http://localhost:8546",
"http://localhost:8547",
"http://localhost:8548",
"http://localhost:8549",
"http://localhost:8550",
"http://localhost:8551",
"http://localhost:8552",
"http://localhost:8553",
"http://localhost:8554"];


var contractAddress = fs.readFileSync('/home/linnea/matchings/addressInfo.txt','utf8');
var contractABI = fs.readFileSync('/home/linnea/matchings/abi.txt','utf8');
var contract = web3.eth.contract(JSON.parse(contractABI));
var myContract = contract.at(contractAddress);
var workbook;
var sheet_name_list;
var node_exists = true;
var counter =0;
var res;

module.exports = function(callback) {};
getClientNumber();

function sendQuery(){
  //counter=0;
  var nodeIdToAskAbout=199;
  console.log("asking about node: " + nodeIdToAskAbout);
  var hash = myContract.askForMatch(nodeIdToAskAbout, 2000000, {from: web3.eth.accounts[0]});
  var ans = web3.eth.getBlock("latest");
  console.log("Difficulty: " + ans.difficulty);
}

function getClientNumber(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Which client are you running? ', (answer) => {
    setProv(answer);

    if (answer==1){

      sendQuery();
      var matchAddedToList = myContract.matchAdded();
      //for(var j=0; j<3; j++){

      matchAddedToList.watch(function(err, result){
        console.log("This account has added a match: " + result.args.sender);
        counter++;
        console.log("counter: " + counter);
        if (counter==1){
          for (var g=0; g<3; g++){
            var bub = myContract.getRes(g, 2000000, {from: web3.eth.accounts[0]});
            console.log("bubben: " + bub);
          }
            counter=0;
          sendQuery();

        }
        return;

      })
    }

    else {
      var matchRequested = myContract.query();
      matchRequested.watch(function(err, result) {
        if (err) {
          console.log(err)
          return;
        }
        else {

          console.log("Account: " + result.args.sender + " just asked about node: " + result.args.node);
           promise().then(function(){
            console.log("Promise Resolved");
          }).catch(function () {
            console.log("Promise Rejected");
          });
          //addingAMatch();

        }
      });
    }
    rl.close();
  });
}

function setProv(cN){
  web3.setProvider(new web3.providers.HttpProvider(ports[cN-1]));
}



//var PTest = function () {
//    return new Promise(function (resolve, reject) {
//    if (somevar === true)
//      resolve();
//    else
//        reject();
//});
//}




function addingAMatch() {

  myContract.getLast.call({from: web3.eth.accounts[0]}).then(function(value) {
    console.log(value);
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });
};

var promise = function (){
  return new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
  //console.log("Value: " + val);
  var val = myContract.addMatch(4444, 44444, 1000000, {from: web3.eth.accounts[0]})
  console.log("Value: " + val);
  if (true) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
}
