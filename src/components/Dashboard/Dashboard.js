import React from "react";

import getWeb3 from "../../utils/getWeb3";
import AntsReview from "../../contracts/AntsReview.json";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      antsReviewInstance: null,
      antreviews: [],
    };
  }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AntsReview.networks[networkId];
      const instance = new web3.eth.Contract(
        AntsReview.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set contract to the state
      this.setState({
        antsReviewInstance: instance,
      });
      this.listenAntReviewIssuedEvent(this);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  listenAntReviewIssuedEvent = (component) => {
    this.state.antsReviewInstance.events
      .AntReviewIssued({ fromBlock: 0 })
      .on("data", async (event) => {
        var newAntReviewArray = component.state.antreviews.slice();
        newAntReviewArray.push(event.returnValues);
        component.setState({ antreviews: newAntReviewArray });
      })
      .on("error", console.error);
  };
  render() {
    const { antreviews } = this.state;
    console.log(" antreviews", antreviews);
    // 
    return <div>Dashboard</div>;
  }
}

export default Dashboard;
