var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("Swob error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("Swob error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("Swob contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of Swob: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to Swob.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: Swob not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "h",
            "type": "uint256"
          },
          {
            "name": "s",
            "type": "uint256"
          },
          {
            "name": "t",
            "type": "uint256"
          }
        ],
        "name": "createMatch",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "nodeId",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "n",
            "type": "uint256"
          }
        ],
        "name": "startCall",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "number_of_checks",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "endCall",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "leader",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "bubbleSortAllMatches",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "h",
            "type": "uint256"
          },
          {
            "name": "s",
            "type": "uint256"
          },
          {
            "name": "t",
            "type": "uint256"
          },
          {
            "name": "a",
            "type": "address"
          }
        ],
        "name": "setBestMatch",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getBestMatch",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "findBestMatch",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "first",
            "type": "uint256"
          },
          {
            "name": "second",
            "type": "uint256"
          }
        ],
        "name": "swap",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getResult",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "winner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "i",
            "type": "uint256"
          }
        ],
        "name": "getMatchFromList",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getNumberOfChecks",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "caller",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "type": "constructor"
      }
    ],
    "unlinked_binary": "0x60a0604052600360608190527f68656a000000000000000000000000000000000000000000000000000000000060809081526011805460008290527f68656a0000000000000000000000000000000000000000000000000000000006825590927f31ecc21a745e3968a04e9570e4425bc18fa8019c68028196b546d1669c200c68602060026001851615610100026000190190941693909304601f01929092048201929091906100d7565b828001600101855582156100d7579182015b828111156100d75782518255916020019190600101906100bc565b5b506100f89291505b808211156100f457600081556001016100e0565b5090565b505034610000575b5b5b610e76806101116000396000f300606060405236156100ca5763ffffffff60e060020a600035041663099a354881146100cf578063139d7fed146100e757806329245dd1146101065780632e0fb6fc1461011857806338e45c651461013757806340eedabb146101465780636077759c1461016f57806379d10ce81461017e5780639c09bb4e146101a2578063ce4e5aa4146101e3578063d96073cf146101f2578063de29278914610207578063dfbf53ae14610294578063ec99c60c146102bd578063f9b8332314610301578063fc9c8d3914610320575b610000565b34610000576100e5600435602435604435610349565b005b34610000576100f46104c1565b60408051918252519081900360200190f35b34610000576100e56004356104c7565b005b34610000576100f46104e1565b60408051918252519081900360200190f35b34610000576100e56104e7565b005b3461000057610153610528565b60408051600160a060020a039092168252519081900360200190f35b34610000576100e5610537565b005b34610000576100e5600435602435604435600160a060020a03606435166105ab565b005b34610000576101af610610565b604080519586526020860194909452848401929092526060840152600160a060020a03166080830152519081900360a00190f35b34610000576100e5610630565b005b34610000576100e56004356024356109f3565b005b3461000057610214610cb6565b60408051602080825283518183015283519192839290830191850190808383821561025a575b80518252602083111561025a57601f19909201916020918201910161023a565b505050905090810190601f1680156102865780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3461000057610153610d54565b60408051600160a060020a039092168252519081900360200190f35b34610000576101af600435610d63565b604080519586526020860194909452848401929092526060840152600160a060020a03166080830152519081900360a00190f35b34610000576100f4610e34565b60408051918252519081900360200190f35b3461000057610153610e3b565b60408051600160a060020a039092168252519081900360200190f35b60a060405190810160405280600081526020016000815260200160008152602001600081526020016000600160a060020a03168152506004600054111561038f57610000565b5060018054600160a060020a03191633600160a060020a031690811782556040805160a0810182526004548152602081018790529081018590526060810184905260808101919091526005805492830180825591929091828183801582901161044b5760050281600502836000526020600020918201910161044b91905b8082111561044757600080825560018201819055600282018190556003820155600481018054600160a060020a031916905560050161040d565b5090565b5b505050916000526020600020906005020160005b508251815560208301516001808301919091556040840151600283015560608401516003830155608084015160049092018054600160a060020a031916600160a060020a0390931692909217909155600080549091019055505b5b50505050565b60045481565b600481905560008080556104dd908080806105ab565b5b50565b60005481565b60015433600160a060020a0390811691161461050257610000565b60025460038054600160a060020a031916600160a060020a039092169190911790555b5b565b600254600160a060020a031681565b60005b60048110156104dd57600581600101815481101561000057906000526020600020906005020160005b5060020154600582815481101561000057906000526020600020906005020160005b5060020154111561059d5761059d81826001016109f3565b5b5b60010161053a565b5b50565b6040805160a0810182526004548082526020820187905291810185905260608101849052600160a060020a0383166080909101819052600b91909155600c859055600d849055600e839055600f8054600160a060020a03191690911790555b50505050565b600b54600c54600d54600e54600f54600160a060020a03165b9091929394565b60056001815481101561000057906000526020600020906005020160005b506002015460056000815481101561000057906000526020600020906005020160005b5060020154141561071e5761071960056000815481101561000057906000526020600020906005020160005b506001015460056000815481101561000057906000526020600020906005020160005b506002015460056000815481101561000057906000526020600020906005020160005b506003015460056000815481101561000057906000526020600020906005020160005b5060040154600160a060020a03166105ab565b610525565b60056001815481101561000057906000526020600020906005020160005b506002015460056002815481101561000057906000526020600020906005020160005b506002015414156108075761080760056001815481101561000057906000526020600020906005020160005b506001015460056001815481101561000057906000526020600020906005020160005b506002015460056001815481101561000057906000526020600020906005020160005b506003015460056001815481101561000057906000526020600020906005020160005b5060040154600160a060020a03166105ab565b5b60056000815481101561000057906000526020600020906005020160005b506002015460056002815481101561000057906000526020600020906005020160005b506002015414156108f65761071960056000815481101561000057906000526020600020906005020160005b506001015460056000815481101561000057906000526020600020906005020160005b506002015460056000815481101561000057906000526020600020906005020160005b506003015460056000815481101561000057906000526020600020906005020160005b5060040154600160a060020a03166105ab565b610525565b606060405190810160405280602c81526020017f4e6f20636f6e63697369766520616e737765722e20506c65617365206d616b6581526020017f2063616c6c20616761696e2e000000000000000000000000000000000000000081525060119080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061099e57805160ff19168380011785556109cb565b828001600101855582156109cb579182015b828111156109cb5782518255916020019190600101906109b0565b5b506109ec9291505b8082111561044757600081556001016109d4565b5090565b50505b5b5b565b60a060405190810160405280600081526020016000815260200160008152602001600081526020016000600160a060020a031681525060a060405190810160405280600585815481101561000057906000526020600020906005020160005b50600001548152602001600585815481101561000057906000526020600020906005020160005b50600101548152602001600585815481101561000057906000526020600020906005020160005b50600201548152602001600585815481101561000057906000526020600020906005020160005b50600301548152602001600585815481101561000057906000526020600020906005020160005b5060040154600160a060020a031690526040805160a08101909152600580549293509091829190859081101561000057906000526020600020906005020160005b50600001548152602001600584815481101561000057906000526020600020906005020160005b50600101548152602001600584815481101561000057906000526020600020906005020160005b50600201548152602001600584815481101561000057906000526020600020906005020160005b50600301548152602001600584815481101561000057906000526020600020906005020160005b5060040154600160a060020a0316905260058054859081101561000057906000526020600020906005020160005b508151815560208201516001820155604082015160028201556060820151600382015560809091015160049091018054600160a060020a031916600160a060020a0390921691909117905560058054829190849081101561000057906000526020600020906005020160005b508151815560208201516001820155604082015160028201556060820151600382015560809091015160049091018054600160a060020a031916600160a060020a039092169190911790555b505050565b60408051602080820183526000825260118054845160026001831615610100026000190190921691909104601f810184900484028201840190955284815292939091830182828015610d495780601f10610d1e57610100808354040283529160200191610d49565b820191906000526020600020905b815481529060010190602001808311610d2c57829003601f168201915b505050505090505b90565b600354600160a060020a031681565b60006000600060006000600586815481101561000057906000526020600020906005020160005b505460058054889081101561000057906000526020600020906005020160005b5060010154600588815481101561000057906000526020600020906005020160005b5060020154600589815481101561000057906000526020600020906005020160005b506003015460058a815481101561000057906000526020600020906005020160005b506004015493985091965094509250600160a060020a031690505b91939590929450565b6000545b90565b600154600160a060020a0316815600a165627a7a72305820ee67e557504b4d38235667165019c14d5ed3b8b07557dd22c37699601cadc4450029",
    "events": {},
    "updated_at": 1485960654059,
    "links": {},
    "address": "0x2bed4aa526625070a1d909dba13975f1cc5bb995"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "Swob";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.Swob = Contract;
  }
})();
