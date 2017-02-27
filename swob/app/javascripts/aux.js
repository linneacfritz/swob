var exports = module.exports = {};

//const readline = require('readline');
const Web3=require("/usr/lib/node_modules/truffle/node_modules/web3-provider-engine/node_modules/web3");
const web3=new Web3();
const fs = require('fs');
const solc = require('/usr/lib/node_modules/truffle/node_modules/solc');
const input = fs.readFileSync('/home/theuser/swob/contracts/Swob.sol');
const output= solc.compile(input.toString(), 1);
const bytecode= output.contracts['Swob'].bytecode;
const abi= JSON.parse(output.contracts['Swob'].interface);
var contractAddress;
var contract;
var swob;




exports.deployContract = function(){
  web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
  var p1 = new Promise(function(resolve, reject) {
    //console.log(web3.eth.accounts);
    contract = web3.eth.contract(abi);
    swob = contract.new({
      data: '0x' + bytecode,
      from: web3.personal.listAccounts[0],
      gas: 100000*15
    }, (err, res) => {
      if (err) {
        console.log(err);
        reject(0);
      }
      // Log the tx, you can explore status with eth.getTransaction()
      //console.log(res.transactionHash);
      // If we have an address property, the contract was deployed
      if (res.address) {
        contractAddress=res.address;
        console.log(swob);
        fs.writeFile("/home/theuser/swob/app/abi.js", JSON.stringify(abi) , function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
  fs.writeFile("/home/theuser/swob/app/addressInfo.txt", contractAddress, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
        //console.log('Contract address: ' + res.address);
        //console.log(swob.transactionHash);
        //console.log("the abi: " + abi[0].toString());
        resolve(res.address);
      }

    });
  });

return p1;
}

exports.getABI = function(){
  return abi;
}

exports.getBytecode = function(){
  return bytecode;
}

exports.getAddress = function(){
  return contractAddress;
}
