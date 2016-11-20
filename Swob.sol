pragma solidity ^0.4.4;
contract Swob {

struct Match {
uint hardware;
uint software;
uint timestamp;
}

address caller;
address public leader;
address public winner;
uint public nodeId;
Match originalMatch;
Match bestMatch;
uint[2] tuple;



modifier onlyCaller(){
if (msg.sender != caller) throw;
_;
}

function call (uint n, uint s, uint h, uint t){
caller = msg.sender;
nodeId=n;
bestMatch.software=s;
bestMatch.hardware=h;
bestMatch.timestamp=t;

originalMatch.software=s;
originalMatch.hardware=h;
originalMatch.timestamp=t;
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
