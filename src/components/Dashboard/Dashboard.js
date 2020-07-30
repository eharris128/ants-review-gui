import React from "react";

import { Skeleton, Typography, Card, Button } from "antd";

import { FulfillAntReview } from "../FulfillAntReview";
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
      displayFulfillAntReviewView: false,
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

    const { antReviews, displayFulfillAntReviewView, clickedAntReviewID } = this.state;

    const setClickedAntReviewID = (antReviewID) => {
      this.setState((prevState) => {
        return {
          ...prevState,
          clickedAntReviewID: antReviewID
        };
      });
    }
    
    const openFulfillAntReview = () => {
      this.setState((prevState) => {
        return {
          ...prevState,
          displayFulfillAntReviewView: true,
        };
      });
    };

    const handleFulfillClick = (e, antReviewID) => {
      setClickedAntReviewID(antReviewID)
      openFulfillAntReview();
    };

    const displayAntReviews = (antReviews) => {
      return antReviews.map((antReview) => {
        // Currently the most recent antReview shows up at the bottom of the list
        const {
          antReview_id: antReviewID,
          amount: rewardAmount,
          issuer,
        } = antReview;
        return (
          <Card
            title={antReview.data}
            style={{ width: 500, "margin-bottom": "2rem" }}
          >
            <p>Reward - {weiToEth(rewardAmount)} ETH</p>
            <p>Author - {issuer}</p>
            <Button onClick={(e) => handleFulfillClick(e, antReviewID)}>
              Fulfill
            </Button>
          </Card>
        );
      });
    };

    const displaySkeleton = () => {
      // To be removed as soon as possible...
      const mockCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      return mockCards.map((_) => {
        return (
          <Card style={{ width: 500, "margin-bottom": "2rem" }}>
            <Skeleton active />
          </Card>
        );
      });
    };

    const displayMainContent = () => {
      // fulfill antReview has not been clicked
      if (!displayFulfillAntReviewView) {
        return (
          <>
            <Title level={2}>Open AntReviews</Title>
            {antReviews.length
              ? displayAntReviews(antReviews)
              : displaySkeleton()}
          </>
        );
      }

      // display fulfill antReview modal
      return <FulfillAntReview antReviewID={clickedAntReviewID}/>;
    };

    return displayMainContent();
  }
}

export default Dashboard;
