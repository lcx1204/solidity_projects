// import the artifacts object,
// an object created by the truffle framework and injected in our file
// to interact with the smart contract

const PredictionMarket = artifacts.require("PredictionMarket.sol");

const SIDE = {
  BIDEN: 0,
  TRUMP: 1,
};

// the call back function is a list of 10 addresses created in the truffle env
// with fake ethers
contract("PredictionMarket", (addresses) => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  it("should work", async () => {
    // create a new instance of the prediction market
    const predictionMarket = await PredictionMarket.new(oracle);

    // use web3.utils.toWei to more easily write
    // use {} to specifiy the function call
    await predictionMarket.placeBets(SIDE.BIDEN, {
      from: gambler1,
      value: web3.utils.toWei("1"),
    });

    await predictionMarket.placeBets(SIDE.BIDEN, {
      from: gambler2,
      value: web3.utils.toWei("1"),
    });

    await predictionMarket.placeBets(SIDE.BIDEN, {
      from: gambler3,
      value: web3.utils.toWei("2"),
    });

    await predictionMarket.placeBets(SIDE.TRUMP, {
      from: gambler4,
      value: web3.utils.toWei("4"),
    });

    await predictionMarket.reportResult(SIDE.BIDEN, SIDE.TRUMP, {
      from: oracle,
    });

    // array of balances of each of the gambler
    // numbers are returned as strings
    // if you need to do operations on those numbers
    // you need to call the big number library BN.js
    const balancesBefore = (
      await Promise.all(
        [gambler1, gambler2, gambler3, gambler4].map((gambler) =>
          web3.eth.getBalance(gambler)
        )
      )
    ).map((balance) => web3.utils.toBN(balance));

    await Promise.all(
      [gambler1, gambler2, gambler3].map((gambler) =>
        predictionMarket.withdrawGain({ from: gambler })
      )
    );

    const balancesAfter = (
      await Promise.all(
        [gambler1, gambler2, gambler3, gambler4].map((gambler) =>
          web3.eth.getBalance(gambler)
        )
      )
    ).map((balance) => web3.utils.toBN(balance));

    // gambler 1 should have 2 ethers, 1 + 4 / 4 = 2. minus some gas
    assert(
      // trick, use toString().slice(0, 3) to check on the first 3 characters
      balancesAfter[0].sub(balancesBefore[0]).toString().slice(0, 3) === "199"
    );

    assert(
      balancesAfter[1].sub(balancesBefore[1]).toString().slice(0, 3) === "199"
    );

    assert(
      balancesAfter[2].sub(balancesBefore[2]).toString().slice(0, 3) === "399"
    );

    assert(balancesAfter[3].sub(balancesBefore[3]).isZero());
  });
});
