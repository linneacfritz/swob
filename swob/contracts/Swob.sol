pragma solidity ^0.4.4;

contract Swob {

mapping (uint => Match) matches ;

struct Match {
uint node;
uint hardware;
uint software;
uint timestamp;
}

address public caller;
address public leader;
address public winner;
uint public nodeId;
Match bestMatch;
Match originalMatch;



uint[2] tuple;

function Swob(){
//  balances[msg.sender] = 10000;

//nodeId= 70;
  //balances[0xbd936510b0b7ec16ec5c13b7c9af316de5986c97]= 500;

}

modifier onlyCaller(){
if (msg.sender != caller) throw;
_;
}

function createMatch(uint n, uint s, uint h, uint t){
matches[0] = Match(n, s, h, t);
}

  function sendCall (uint n, uint s, uint h, uint t) {
    caller = msg.sender;

    nodeId =n;
    uint myId=this.nodeId();
    createMatch(n, s, h, t);

    //bestMatch.software = s;

//uint myS = this.bestMatch.software();
//    bestMatch.hardware = h;
//    bestMatch.timestamp = t;

  //  originalMatch.software = s;
  //  originalMatch.hardware = h;
  //  originalMatch.timestamp = t;


    //  return nodeId+1;

}

//function getBalance(address a) returns (uint){
//return balances[a];
//}

function setNodeId(uint n){
 Swob.nodeId = n;
}

function getNodeId() constant returns (uint){
  return nodeId;
}

function foundMatch (uint sw, uint hw, uint ts){
  if (sw != bestMatch.software || hw != bestMatch.hardware){
    if (ts > bestMatch.timestamp){
    bestMatch.software= sw;
    bestMatch.hardware = hw;
    bestMatch.timestamp = ts;
    leader = msg.sender;
    }
  }
}

function sameMatch () returns (bool) {
  if (bestMatch.software == originalMatch.software &&
  bestMatch.hardware == originalMatch.hardware){
    return true;
  }
  else return false;
}

function endCall() onlyCaller {
winner=leader;
//Because a contract cannot return a struct to an outside call, it can maybe
//return the address of the winner, and perhaps get the new information to the
//database through another medium than the blockchain.
//caller.send(bestMatch);
}

function getBestMatch () returns (uint[2]){
  tuple[0]=bestMatch.hardware;
  tuple[1]=bestMatch.software;
  return tuple;
}

}
