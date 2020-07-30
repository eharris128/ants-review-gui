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
      fulfilledAntReviews: [],
      displayFulfillAntReviewView: false,
    };
  }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AntsReview.networks[networkId];
      const instance = new web3.eth.Contract(
        AntsReview.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set contract to the state
      this.setState({
        web3,
        antsReviewInstance: instance,
        accounts: accounts.length ? accounts[0] : accounts,
      });
      this.listenAntReviewIssuedEvent(this);
      this.listenAntReviewFulfilledEvent(this);
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

  listenAntReviewFulfilledEvent = (component) => {
    this.state.antsReviewInstance.events
      .AntReviewFulfilled({ fromBlock: 0 })
      .on("data", async (event) => {
        let fulfilledAntReviewArray = component.state.fulfilledAntReviews.slice();
        fulfilledAntReviewArray.push(event.returnValues);
        component.setState({ fulfilledAntReviews: fulfilledAntReviewArray });
      })
      .on("error", console.error);
  };
  render() {
    const { Title } = Typography;

    const {
      web3,
      antsReviewInstance,
      antReviews,
      displayFulfillAntReviewView,
      clickedAntReviewID,
      accounts,
      fulfilledAntReviews,
    } = this.state;

    const setClickedAntReviewID = (antReviewID) => {
      this.setState((prevState) => {
        return {
          ...prevState,
          clickedAntReviewID: antReviewID,
        };
      });
    };

    const openFulfillAntReview = () => {
      this.setState((prevState) => {
        return {
          ...prevState,
          displayFulfillAntReviewView: true,
        };
      });
    };

    const handleFulfillClick = (e, antReviewID) => {
      setClickedAntReviewID(antReviewID);
      openFulfillAntReview();
    };

    const displayOpenAntReviews = (antReviews) => {
      // TODO (UI or Smart contract?) - only display / return open ant reviews that are 'fulfillable' (e.g. the author of an ant review should not be able to see it under the `Open AntReviews` list)
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

    const isFulfilledAntReviewOwnedByUser = (antReviewID) => {
      // find the open ant review with this id,
      const targetAntReviewArr = antReviews.filter(
        (antReview) => antReview.antReview_id === antReviewID
      );
      if (targetAntReviewArr.length) {
        return targetAntReviewArr[0].issuer === accounts;
      }
      // return false if the issuer of the ant review does not match the current logged in account || if none of the antReviews contain matching ant review ids
      return false;
    };

    const displayFulfilledAntReviews = (fulfilledAntReviews) => {
      return fulfilledAntReviews.map((fulfilledAntReview) => {
        const { antReview_id: antReviewID } = fulfilledAntReview;
        if (!isFulfilledAntReviewOwnedByUser(antReviewID)) {
          const { data: ipfsHash, fulfiller } = fulfilledAntReview;

          return (
            <Card
              title={ipfsHash}
              style={{ width: 500, "margin-bottom": "2rem" }}
            >
              <p>Peer Reviewer - {fulfiller}</p>
              {/* TODO - Update to handleAcceptClick etc.. */}
              {/* <Button onClick={(e) => handleFulfillClick(e, antReviewID)}>
              Fulfill
            </Button> */}
            </Card>
          );
        }
        return null;
      });
    };

    const displaySkeleton = () => (
      <Card style={{ width: 500, "margin-bottom": "2rem" }}>
        <Skeleton active />
      </Card>
    );

    const displayMainContent = () => {
      // fulfill antReview has not been clicked
      if (!displayFulfillAntReviewView) {
        return (
          <>
            <div>
              <Title level={2}>Open AntReviews</Title>
              {antReviews.length
                ? displayOpenAntReviews(antReviews)
                : displaySkeleton()}
            </div>
            <div>
              <Title level={2}>Fulfilled AntReviews</Title>
              {fulfilledAntReviews.length
                ? displayFulfilledAntReviews(fulfilledAntReviews)
                : displaySkeleton()}
            </div>
          </>
        );
      }

      // display fulfill antReview modal
      return (
        <FulfillAntReview
          antReviewID={clickedAntReviewID}
          accounts={accounts}
          web3={web3}
          antsReviewInstance={antsReviewInstance}
        />
      );
    };

    return displayMainContent();
  }
}

export default Dashboard;
