import { useState, useEffect } from "react";
import AntsReview from "../contracts/AntsReview.json";
import getWeb3 from "./getWeb3";

const useWeb3 = () => {
  const [web3Instance, setWeb3Instance] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [antsReviewInstance, setAntsReviewInstance] = useState(null);
  const [networkID, setNetworkID] = useState(null);
  useEffect(() => {
    async function initializeWeb3() {
      try {
        const web3 = await getWeb3();
        setWeb3Instance(web3);

        // accounts processing
        const availableAccounts = await web3.eth.getAccounts();
        setAccounts(availableAccounts);

        // contract processing
        const currentID = await web3.eth.net.getId();
        setNetworkID(currentID);
        const deployedNetwork = AntsReview.networks[currentID];
        const contractInstance = new web3.eth.Contract(
          AntsReview.abi,
          deployedNetwork && deployedNetwork.address
        );
        setAntsReviewInstance(contractInstance);
      } catch (e) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(e);
      }
    }
    initializeWeb3();
  }, []);
  return {
    web3: web3Instance,
    networkID,
    antsReviewInstance,
    accounts: accounts ? accounts[0] : accounts,
  };
};

export default useWeb3;
