const PredictionMarket = artifacts.require("PredictionMarket.sol");

const Side = {
  Biden: 0,
  Trump: 1,
};

// deploy to the local blockchain, ignore network, 10 addresses from the local network

module.exports = async function (deployer, _network, addresses) {
  // extract couple of addresses
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  // use the deployer object to deploy the smart contract
  await deployer.deploy(PredictionMarket, oracle);

  // it's always a two step process. deploy then wait for it to be deployed
  const predictionMarket = await PredictionMarket.deployed();

  // want to see something in the front end
  await predictionMarket.placeBets(Side.Biden, {
    from: gambler1,
    value: web3.utils.toWei("1"),
  });
  await predictionMarket.placeBets(Side.Biden, {
    from: gambler2,
    value: web3.utils.toWei("1"),
  });
  await predictionMarket.placeBets(Side.Biden, {
    from: gambler3,
    value: web3.utils.toWei("2"),
  });
  await predictionMarket.placeBets(Side.Trump, {
    from: gambler4,
    value: web3.utils.toWei("1"),
  });
};
