# solidity_projects

## setup

npm install -g truffle
truffle init
change version in truffle-config.js

## coding

code the smart contract under contracts/
truffle compile

## testing

code the tests under test/
same name as the smart contract, but .js
truffle test

## frontend

npx create-react-app frontend

front end need to import a json file from /build/

modify truffle-config by adding

contracts_build_directory: "./frontend/src/contracts",

this output the build to the frontend directory

npm install bootstrap ethers

ethers is a javascript library used to interact with ethereum blockchain, like web3

### connect to ethereum blockchain

create src/etheruem.js

## deploy to the blockchain

write the migration file

"truffle develop" (start a local development blockchain)

run "migrate --reset" command

## connect to metamask

use the rpc url and seed phrase to create accounts

click create account to add accounts

settings advanced reset account

## run frontend

cd frontend
npm start
