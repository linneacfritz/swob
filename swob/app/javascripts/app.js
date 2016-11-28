/*var accounts;
var account;
//var receiver;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function printNodeId() {
  var swob = Swob.deployed();

  swob.printNodeId.call({from: account}).then(function(value) {
    var nood = document.getElementById("node");
    nood.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting car node id; see log.");
  });
};


function sendCall(){
  var swob = Swob.deployed();
  var nodeId = parseInt(document.getElementById("nodeId").value);
  var software = parseInt(document.getElementById("software").value);
  var hardware = parseInt(document.getElementById("hardware").value);
  var timestamp = parseInt(document.getElementById("timestamp").value);
  /*var softwareN = 1234567890;
  var hardwareN = 1111111111;
  var timestampN = 2222222222;

  swob.sendCall(nodeId, software, hardware, timestamp).then(function(){
    setStatus("Query placed!");
    refreshMatch();
  }).catch(function(e){
    console.log(e);
    setStatus("Error sending call, see log.");
  });
/*make a call to database

  swob.foundMatch(softwareN, hardwareN, timestampN).then(function(){
    setStatus("Match found!");
    refreshMatch();
  }).catch(function(e){
    console.console.log(e);
  setStatus("Error setting match, see log.");
});
  }
};


window.onload = function() {
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
    //sendCall();
    //printNodeId();


  });
}*/
var accounts;
var account;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};





function printNodeId(){
  var swob = Swob.deployed();
    document.getElementById("something").innerHTML = "There was an attempt!";
  swob.getNodeId().then(function(value){

    document.getElementById("node").innerHTML = value;
  }).catch(function(e){
    console.log(e);
    setStatus("Error printing node id; see log.");
  });
};

function sendCall(){

  var swob = Swob.deployed();
  var nodeId = parseInt(document.getElementById("nodeId").value);
  var software = parseInt(document.getElementById("software").value);
  var hardware = parseInt(document.getElementById("hardware").value);
  var timestamp = parseInt(document.getElementById("timestamp").value);

//document.getElementById("node").innerHTML = nodeId;

  //swob.sendCall.call(nodeId, software, hardware, timestamp, {from: account}).then(function(){


    //setStatus("Query placed!");
    //printNodeId();
    //refreshMatch();
  //}).catch(function(e){
  //  console.log(e);
  //  setStatus("Error sending call, see log.");
//  });
//  document.getElementById("something").innerHTML = "There was an attempt!";
//  swob.printNodeId(nodeId).then(function(value){
//document.getElementById("node2").innerHTML = value;
//});

};

window.onload = function() {
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
    printNodeId();
  });
}
