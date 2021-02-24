import { ethers, Contract } from "ethers";
import PredictionMarket from "./contracts/PredictionMarket.json";

const getBlockchain = () =>
  // callback method with two methods: resolve and reject
  // call resolve when you have everything you need from the network
  // if there's an error, call reject
  new Promise((resolve, reject) => {
    // wait for everything to be loaded in the browswer
    // then execute the callback function
    window.addEventListener("load", async () => {
      // test if metamask is injected
      if (window.ethereum) {
        // wait for ethereum to approve our dApp
        await window.ethereum.enable();
        // provider represents a connection to the ethereum blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // signer is specific to the ethereum library
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        // instantiate an ethereum contract js object to interact with the
        // first argument is the address of the smart contract (get from json)
        // second argument is the interface of the smart object
        const predictionMarket = new Contract(
          PredictionMarket.networks[window.ethereum.networkVersion].address,
          PredictionMarket.abi,
          signer
        );

        resolve({ signerAddress, predictionMarket });
      }
      resolve({ signerAddress: undefined, predictionMarket: undefined });
    });
  });

export default getBlockchain;
