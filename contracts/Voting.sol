pragma solidity ^0.4.11;

contract Voting {

  mapping (bytes32 => uint8) public votesReceived;
  bytes32[] public candidateList;

  function Voting(bytes32[] candidateNames) {
    candidateList = candidateNames;
  }

  function getCandidates() returns(bytes32[]) {
    return candidateList;
  }

  function addCandidate(bytes32 candidateName) {
    candidateList.push(candidateName);
  }

  function removeCandidate(bytes32 candidateName)  returns(bytes32[]) {
      require(validCandidate(candidateName));
      var index = indexOf(candidateList, candidateName);
      if (index >= 0) {
        candidateList = removeCandidateByIndex(index);
      }
      return candidateList;
  }

  function removeCandidateByIndex(uint index)  returns(bytes32[]) {
      if (index >= candidateList.length) {
        return candidateList;
      }
      for (uint i = index; i < candidateList.length-1; i++) {
          candidateList[i] = candidateList[i+1];
      }
      delete candidateList[candidateList.length-1];
      candidateList.length--;
      return candidateList;
  }

  function totalVotesFor(bytes32 candidate) returns (uint8) {
    require(validCandidate(candidate));
    return votesReceived[candidate];
  }

  function voteForCandidate(bytes32 candidate) returns (uint8) {
    require(validCandidate(candidate));
    return votesReceived[candidate] += 1;
  }

  
  function indexOf(bytes32[] values, bytes32 value) returns(uint) {
    uint i = 0;
    while (values[i] != value) {
      i++;
    }
    return i;
  }

  function validCandidate(bytes32 candidate) returns (bool) {
    for (uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
   }

}