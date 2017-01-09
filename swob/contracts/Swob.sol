pragma solidity ^0.4.7;
import "BigInt.sol";

contract Swob {

//mapping (uint => Match) matches ;

struct Match {
uint node;
uint hardware;
uint software;
uint timestamp;
address sender;
}

uint public number_of_checks;
address public caller;
address public leader;
address public winner;
uint public nodeId;
Match[] allMatches;
Match current;
Match bestie;
//address public current_sender;



uint[2] tuple;

function Swob(){


}

function startCall(uint n){
nodeId=n;
number_of_checks=0;
//current_sender=msg.sender;
setBestMatch(0,0,0,0);
}

modifier onlyCaller(){
if (msg.sender != caller) throw;
_;
}

modifier onlyFive(){
if(number_of_checks>4) throw;
_;
}

function setBestMatch(uint h, uint s, uint t, address a){
bestie = Match(nodeId, h, s, t, a);
}

  function createMatch (uint h, uint s, uint t) onlyFive{
caller=msg.sender;
    Match memory aMatch = Match(nodeId, h, s, t, msg.sender);
    allMatches.push(aMatch);
if(allMatches[number_of_checks].timestamp>bestie.timestamp){
      setBestMatch(allMatches[number_of_checks].hardware, allMatches[number_of_checks].software, allMatches[number_of_checks].timestamp, allMatches[number_of_checks].sender);
    }
    number_of_checks++;
  }


function getNumberOfChecks() returns (uint){
return Swob.number_of_checks;
}

function getBestHardware() returns (uint){
return bestie.hardware;
}

function getBestSoftware() returns (uint){
return bestie.software;
}
function getSoftware(uint i) returns (uint){
return allMatches[i].software;
}
function getHardware(uint i) returns (uint){
return allMatches[i].hardware;
}

function getLeader(uint i) returns (address){
return bestie.sender;
}

function getSender(uint i) returns (address){
return allMatches[i].sender;
}

function getBestMatch() returns (uint, uint, uint, uint, address){
return (bestie.node, bestie.hardware, bestie.software, bestie.timestamp, bestie.sender);
}

function endCall() onlyCaller {
winner=leader;
}

}
