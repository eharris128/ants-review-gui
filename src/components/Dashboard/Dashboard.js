import React from "react";

import { Skeleton, Typography, Card, Button } from "antd";

import getWeb3 from "../../utils/getWeb3";
import AntsReview from "../../contracts/AntsReview.json";
import weiToEth from "../../utils/weiToEth";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      antsReviewInstance: null,
      antReviews: [],
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
        let newAntReviewArray = component.state.antReviews.slice();
        newAntReviewArray.push(event.returnValues);
        component.setState({ antReviews: newAntReviewArray });
      })
      .on("error", console.error);
  };
  render() {
    const { Title } = Typography;

    const { antReviews } = this.state;

    const displayAntReviews = (antReviews) => {
      return antReviews.map((antReview) => {
        return (
          <Card
            title={antReview.data}
            style={{ width: 500, "margin-bottom": "2rem" }}
          >
            <p>Reward - {weiToEth(antReview.amount)} ETH</p>
            <p>Author - {antReview.issuer}</p>
            <Button>Fulfill</Button>
          </Card>
        );
      });
    };
    const displaySkeleton = () => {
      // To be removed as soon as possible...
      const mockCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      return mockCards.map((_) => {
        return (
          <Card
            loading={true}
            style={{ width: 500, "margin-bottom": "2rem" }}
          ></Card>
        );
      });
    };
    return (
      <>
        <Title level={2}>Open AntReviews</Title>
        {antReviews.length ? displayAntReviews(antReviews) : displaySkeleton()}
      </>
    );
  }
}

export default Dashboard;
