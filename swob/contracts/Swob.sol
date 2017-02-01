pragma solidity ^0.4.7;
import "BigInt.sol";

contract Swob {

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
  address quarantine;
  string result = "hej";


  function Swob(){
  }

  function startCall(uint n){
    nodeId=n;
    number_of_checks=0;
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

  function findBestMatch(){
    if (allMatches[0].software == allMatches[1].software){
      setBestMatch(allMatches[0].hardware, allMatches[0].software, allMatches[0].timestamp, allMatches[0].sender);
    }
    else{
      if (allMatches[2].software == allMatches[1].software){
        setBestMatch(allMatches[1].hardware, allMatches[1].software, allMatches[1].timestamp, allMatches[1].sender);
      }
      if (allMatches[2].software == allMatches[0].software)
        setBestMatch(allMatches[0].hardware, allMatches[0].software, allMatches[0].timestamp, allMatches[0].sender);

      else result = "No concisive answer. Please make call again.";
    }
  }

  function setBestMatch(uint h, uint s, uint t, address a){
    bestie = Match(nodeId, h, s, t, a);
  }

  function createMatch (uint h, uint s, uint t) onlyFive{
    caller=msg.sender;
    Match memory aMatch = Match(nodeId, h, s, t, msg.sender);
    allMatches.push(aMatch);
    //if(allMatches[number_of_checks].timestamp>bestie.timestamp){
      //setBestMatch(allMatches[number_of_checks].hardware, allMatches[number_of_checks].software, allMatches[number_of_checks].timestamp, allMatches[number_of_checks].sender);
    //}
    number_of_checks++;
  }

  function bubbleSortAllMatches(){
    for(uint i = 0; i<4; i++){
      if (allMatches[i].software>allMatches[i+1].software){
        swap(i, i+1);
      }
    }
  }

  function swap (uint first, uint second){
    Match memory temp = Match(allMatches[first].node, allMatches[first].hardware, allMatches[first].software, allMatches[first].timestamp, allMatches[first].sender);
    allMatches[first] = Match(allMatches[second].node, allMatches[second].hardware, allMatches[second].software, allMatches[second].timestamp, allMatches[second].sender);
    allMatches[second]=temp;
  }


  function getNumberOfChecks() returns (uint){
    return Swob.number_of_checks;
  }

 function getMatchFromList (uint i) returns (uint, uint, uint, uint, address){
    return (allMatches[i].node, allMatches[i].hardware, allMatches[i].software, allMatches[i].timestamp, allMatches[i].sender);
  }

  function getBestMatch() returns (uint, uint, uint, uint, address){
    return (bestie.node, bestie.hardware, bestie.software, bestie.timestamp, bestie.sender);
  }

  function getResult() returns (string){
    return result;
  }

  function endCall() onlyCaller {
    winner=leader;
  }

}
