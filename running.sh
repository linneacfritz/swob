#!/bin/bash

echo Enter the node number
read node

if [ "$node" = "1" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_1" --networkid 2017 --nodiscover --rpc --rpcport 8545 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30303 --rpcapi "eth,web3,admin" --ipcpath ~/.ethereum/geth.ipc console
fi

if [ "$node" = "2" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_2" --networkid 2017 --nodiscover --rpc --rpcport 8546 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30304 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi


if [ "$node" = "3" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_3" --networkid 2017 --nodiscover --rpc --rpcport 8547 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30305 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi


if [ "$node" = "4" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_4" --networkid 2017 --nodiscover --rpc --rpcport 8548 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30306 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi


if [ "$node" = "5" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_5" --networkid 2017 --nodiscover --rpc --rpcport 8549 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30307 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi

if [ "$node" = "6" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_6" --networkid 2017 --nodiscover --rpc --rpcport 8550 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30308 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi

if [ "$node" = "7" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_7" --networkid 2017 --nodiscover --rpc --rpcport 8551 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30309 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi

if [ "$node" = "8" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_8" --networkid 2017 --nodiscover --rpc --rpcport 8552 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30310 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi

if [ "$node" = "9" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_9" --networkid 2017 --nodiscover --rpc --rpcport 8553 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30311 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi

if [ "$node" = "10" ] 
then
  command geth --unlock 0 --datadir="/home/theuser/eth_cluster/10_nodes/node_10" --networkid 2017 --nodiscover --rpc --rpcport 8554 --rpcaddr 0.0.0.0 --verbosity 0 --rpccorsdomain "*" --port 30312 --rpcapi "eth,web3" --ipcpath ~/.ethereum/geth.ipc console
fi
