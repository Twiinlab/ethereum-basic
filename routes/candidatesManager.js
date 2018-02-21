const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.99.102:8545/"));
// web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// web3.eth.accounts
// ['0x5c252a0c0475f9711b56ab160a1999729eccce97',
// '0x353d310bed379b2d1df3b727645e200997016ba3',
// '0xa3ddc09b5e49d654a43e161cae3f865261cabd23',
// '0xa8a188c6d97ec8cf905cc1dd1cd318e887249ec5',
// '0xc0aa5f8b79db71335dacc7cd116f357d7ecd2798',
// '0xda695959ff85f0581ca924e549567390a0034058',
// '0xd4ee63452555a87048dcfe2a039208d113323790',
// '0xc60c8a7b752d38e35e0359e25a2e0f6692b10d14',
// '0xba7ec95286334e8634e89760fab8d2ec1226bf42',
// '0x208e02303fe29be3698732e92ca32b88d80a2d36'];

const code = fs.readFileSync('./contracts/Voting.sol').toString();
const compiledCode = solc.compile(code);

var abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);

var byteCode = compiledCode.contracts[':Voting'].bytecode;

var VotingContract = web3.eth.contract(abiDefinition);

const deployedContract = VotingContract.new(['Rama','Nick','Jose'], {
    data: byteCode,
    from: web3.eth.accounts[0], gas: 4712388
  });

//const deployedContract = { address: "0xb499843a110e8eda3e1c3ad7d7d5cf4b8d59eec1"  };


exports.getHello = function(req, res) {
    res.json({ message: 'hooray! welcome to our api!'});
};

exports.getCandidatesList = function(req, res) {
    console.log('GET /candidates');
    var contractInstance = VotingContract.at(deployedContract.address);

    var candidates = contractInstance.getCandidates.call().map(parseHexToStr);
    var result = candidates.map(can => {
        return { 
        candidate: can,
        votes: contractInstance.totalVotesFor.call(can)
        }
    })
    res.json({ message: result });
}

exports.addCandidate = function(req, res) {
    console.log('POST /candidates/:candidate_name Body:' + req.body.toString());
    var contractInstance = VotingContract.at(deployedContract.address);
    contractInstance.addCandidate(req.body.candidateName, {from: web3.eth.accounts[0]})
    res.json({ message: 'candidate created' });
}

exports.getVotesByCandidate = function(req, res) {
    console.log('GET /candidates Params:' + req.params);
    var contractInstance = VotingContract.at(deployedContract.address);
    var candidateVotes = contractInstance.totalVotesFor(req.body.candidate_name, {from: web3.eth.accounts[0]})
    res.json({ message: candidateVotes });
}


exports.addVoteByCandidate = function(req, res) {
    console.log('PUT /candidates/:candidate_name Params:' + req.params.toString() );
    var contractInstance = VotingContract.at(deployedContract.address);
    var candidateVotes = contractInstance.voteForCandidate(req.params.candidate_name, {from: web3.eth.accounts[0]})
    res.json({ message: candidateVotes });
}

exports.deleteByCandidate = function(req, res) {
    console.log('DELETE /candidates/:candidate_name Params:' + req.params.toString());
    var contractInstance = VotingContract.at(deployedContract.address);
    var candidateVotes = contractInstance.removeCandidate(req.params.candidate_name, {from: web3.eth.accounts[0]})
    res.json({ message: 'candidate deleted' });
}
  
  function parseStrToHex (str) {
    return Buffer.from(str).toString('hex');
  }
  
  function parseHexToStr (hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
  }