var accounts = web3.eth.accounts;
var workbook
var sheet_name_list;
var date = new Date();
var timestamp1= 1234567;
var timestamp2=2222222;
var swob ;
var match ={node:null, hardW:null, softW:null, timeS:null};

var match1 = {node:123, hardW:44, softW:33, timeS:789};
var match2 = {node:123, hardW:44, softW:33, timeS:789};
var match3 = {node:123, hardW:784, softW:33, timeS:989};
var match4 = {node:123, hardW:44, softW:33, timeS:789};
var match5 = {node:123, hardW:55, softW:33, timeS:1890};
var matchy =[match1, match2, match3, match4, match5];
var Web3 = require("/usr/lib/node_modules/truffle/node_modules/web3-provider-engine/node_modules/web3");
var web3 = new Web3();


module.exports = function(callback) {}

setProvider();
createWorkBook();
makeStaticChecks();


  function setProvider(){
    if(!web3.currentProvider){
      web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"))
    };
  }

  function makeFiveChecks(nodeId){
    matchingAlgo(nodeId);
    for(i=0; i<5; i++){
      web3.eth.defaultAccount=accounts[i];
      swob = Swob.deployed();
      //swob.startCall(nodeId)
      createMatch(accounts[i]);
      getTimestamp();

    }
  }

  function makeStaticChecks(){
    swob = Swob.deployed();
    swob.startCall(123);
    for(i=0; i<5; i++){
      web3.eth.defaultAccount=accounts[i];
      swob.createMatch(matchy[i].hardW, matchy[i].softW, matchy[i].timeS, {from: accounts[i]});
      getTimestamp(i);
    }
  }

  function createWorkBook(){
    if(typeof require !== 'undefined') XLSX = require('/usr/lib/node_modules/truffle/node_modules/xlsx');
    //workbook = XLSX.readFile('/home/linnea/swob/app/javascripts/out.xlsx');
    workbook = XLSX.readFile('/home/theuser/swob/out.xlsx');
    sheet_name_list = workbook.SheetNames;
  }

  function startCall(nodeId) {
    swob.startCall(nodeId).then(function(value){
    console.log("message sender: " + value);
    });
  }

  function table(id, sheet_number){
    var worksheet = workbook.Sheets[sheet_name_list[sheet_number]];
    var range = worksheet['!ref'];
    var end = range[range.length-1];
    var answer;
    for(i=1; i<=end; i++){
      var row = 'A'+i;
      var value = worksheet[row].v;
      if(value == id){
        return (worksheet['B'+i].v);
      }
    }
    return 0;
  }

  function matchingAlgo(number){
    var answer1 = table(number, 0);
    var answer2=0;

    if (answer1!=0){
      match.node=number;
      match.hardW=answer1;
      answer2=table(answer1, 1);
    }

    if (answer2!=0){
      match.softW=answer2;
      match.timeS = date.getTime();
    }
  };

  function createMatch(a){
    //web3.eth.defaultAccount = a;
    //console.log("the sending account is now: " + a);
    swob.createMatch(match.hardW, match.softW, match.timeS, {from: a}).then(function (value) {
      console.log("the sender this time was: " + value);
    });
  }

  function getNodeId(){
    swob.nodeId.call({from: account}).then(function(value){
    console.log("Node is: " + value);
    });
  };

  function getTimestamp(j){
    /*swob.getBestHardware.call(j).then(function(value){
    console.log("Hardware of best match is: " + value);
    });

    swob.number_of_checks.call().then(function(value){
    console.log("number_of_checks: " + value);
    });

    swob.caller.call().then(function(value){
    console.log("message sender: " + value);
    });*/

    swob.getBestMatch.call().then(function(val1){
    console.log("BESTIE! " + val1);
    });

    /*swob.getBestSoftware.call(j).then(function(value){
    console.log("Software of best match is: " + value);
    });

    swob.getLeader.call(j).then(function(value){
    console.log("The leader is: " + value);
    });

    swob.getHardware.call(j).then(function(value){
    console.log("Hardware of current match is: " + value);
    });

    swob.getSoftware.call(j).then(function(value){
    console.log("Software of current match is: " + value);
    });

    swob.getSender.call(j).then(function(value){
    console.log("Address of current match is: " + value);
    });

    swob.bestMatchLength.call().then(function(value){
    console.log("The best match array is this long: " + value);
    });*/
  };
