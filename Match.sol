
pragma solidity ^0.4.9;

contract Match {

  struct Comp
  {
    uint hardware;
    uint software;
  }

  Comp[] matches;
  uint numberOfMatches;
  uint public nodeId;

  function Match() payable {
  }

  event query (address sender, uint node);
  event matchAdded (address sender, uint hardware, uint software);
  event matchesFull (address sender);

  function askForMatch(uint n) {
    nodeId=n;

    //clear the array from previous query
    if (matches.length==3){
      //uint i = matches.length;
      for (uint i = 3; i>0; i--){
          delete matches[i-1];
      }
    }
    //while (matches.length>0){
    //  delete matches[matches.length-1];
    //}
    query(msg.sender, n);
  }

  function addMatch(uint h, uint s) constant returns (uint)
  {
    matches.push(Comp(h, s));
    matchAdded(msg.sender, h, s);
    //if (matches.length>2){

      //  matchesFull(msg.sender);
      //bubbleSort();
    //}
   return 15;
  }

  function bubbleSort() constant returns (uint, uint, uint)
  {
    for (uint j=0; j<(matches.length-1); j++)
    {
      for (uint i = j; i<(matches.length-1); i++)
      {
        if (matches[i].software > matches[i+1].software)
        {
          swap(i, i+1);
        }
      }
    }
    return (matches[0].software, matches[1].software, matches[2].software);
  }

  function swap(uint index1, uint index2)
  {
    Comp memory temp = matches[index1];
    matches[index1] = matches[index2];
    matches[index2] = temp;
  }

  function findBest(uint index, uint b) returns (uint){
    if (index >= matches.length-1){
      return b;
    }
    uint tracker=1;
    while (matches[index].software == matches[index+1].software){
      tracker++;
      index++;
    }
    if (tracker > b){
      findBest(index+1, tracker);
    }
    else {
      findBest(index+1, b);
    }
  }


  //function getLast() constant returns (uint, uint){
    function getLast() constant returns (uint){
    //uint last=matches.length-1;
    return 50;
    //return (matches[last].hardware, matches[last].software);
  }

  function getMatch(uint n) constant returns (uint, uint){
    return (matches[n].hardware, matches[n].software);
  }

  function getLengthOfMatches() constant returns (uint){
    return matches.length;
  }

  function getRes(uint i) constant returns (uint, uint){
    return (matches[i].hardware, matches[i].software);
  }
}
