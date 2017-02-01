  var accounts = web3.eth.accounts;

  var workbook;
  var sheet_name_list;
  var swob;
  var match1={node:123, hardW:55, softW:89, timeS:1};
  var match2={node:123, hardW:55, softW:89, timeS:1};
  var match3={node:123, hardW:55, softW:3333, timeS:1};
  var match4={node:123, hardW:55, softW:4, timeS:1};
  var match5={node:123, hardW:55, softW:4, timeS:1};
  //var matches=[];
  var matches=[match1, match2, match3, match4, match5];
  //var Web3 = require("/usr/lib/node_modules/truffle/node_modules/web3-provider-engine/node_modules/web3");
  //var web3 = new Web3();
  var node_exists = false;
console.log("Balance of account 0 is: " + web3.eth.getBalance(accounts[0]));
console.log("peer count: " + web3.net.peerCount);
console.log("version node: " + web3.version.node);
console.log("network: " + web3.version.network);
  module.exports = function(callback) {}

  setProvider();
  createWorkBook();
  makeStaticChecks(123);
  swob.bubbleSortAllMatches();
  swob.findBestMatch();
  getInfo();
console.log(web3.net.listening);

  function setProvider(){
    if(!web3.currentProvider){
      web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
    };
  }

  function makeFiveChecks(nodeId){
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

  function makeStaticChecks(nodeId){
    swob=Swob.deployed();
    swob.startCall(nodeId);
    for(var i=0; i<5; i++){
      web3.eth.defaultAccount=accounts[i];
      swob.createMatch(matches[i].hardW, matches[i].softW, matches[i].timeS, {from: accounts[i]});
    }
  }

  function createWorkBook(){
    //if(typeof require !== 'undefined') XLSX = require('/usr/lib/node_modules/truffle/node_modules/xlsx');
    if(typeof require !== 'undefined') XLSX = require('/usr/lib/node_modules/xlsx');
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

  function getInfo(){

    swob.getBestMatch.call().then(function(val1){
    console.log("Best match: " + val1);
    });

    swob.getResult.call().then(function (value){
    console.log(value);
    });

    for(var i=0; i<5; i++){
      swob.getMatchFromList.call(i).then(function(value){
      console.log("Match number: " +i + " is: " + value);
});
}
    //swob.getAMatch.call().then(function(value){
    //console.log("Current match is: " + value);
    //});
  };
