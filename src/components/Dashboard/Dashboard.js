import React from "react";

import { Skeleton, Typography, Card, Button, Space } from "antd";

import { FulfillAntReview } from "../FulfillAntReview";
import getWeb3 from "../../utils/getWeb3";
import AntsReview from "../../contracts/AntsReview.json";
import weiToEth from "../../utils/weiToEth";
import IssueAntReview from "../IssueAntReview/IssueAntReview";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      antsReviewInstance: null,
      antReviews: [],
      fulfilledAntReviews: [],
      displayFulfillAntReviewView: false,
      cancelledAntReviews: [],
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
      this.listenAntReviewCancelledEvent(this);
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

  listenAntReviewCancelledEvent = (component) => {
    this.state.antsReviewInstance.events
      .AntReviewCancelled({ fromBlock: 0 })
      .on("data", async (event) => {
        let cancelledAntReviewArray = component.state.cancelledAntReviews.slice();
        cancelledAntReviewArray.push(event.returnValues);
        component.setState({ cancelledAntReviews: cancelledAntReviewArray });
      })
      .on("error", console.error);
  };

  render() {
    const { Title } = Typography;
    const { displayIssueAntReviewView } = this.props;

    const {
      web3,
      antsReviewInstance,
      antReviews,
      displayFulfillAntReviewView,
      clickedAntReviewID,
      accounts,
      fulfilledAntReviews,
      cancelledAntReviews,
    } = this.state;
    // console.log('new phone who dis', cancelledAntReviews)

    // an ant review can only be displayed if it has not yet been cancelled

    // fulfill workflow
    const handleFulfillClick = (e, antReviewID) => {
      setClickedAntReviewID(antReviewID);
      openFulfillAntReview();
    };

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

    // cancel workflow
    const handleCancelClick = (e, antReviewID) => {
      // Later, add a 'Are you sure you want to cancel' modal, etc...
      cancelAntReview(antReviewID);
    };

    const cancelAntReview = async (antReviewID) => {
      await antsReviewInstance.methods
        .cancelAntReview(antReviewID)
        .send({ from: accounts });
    };

    // accept workflow
    const acceptAntReview = async (antReviewID, fulfillmentID) => {
      await antsReviewInstance.methods
        .acceptFulfillment(antReviewID, fulfillmentID)
        .send({ from: accounts });
    };

    const handleAcceptClick = (e, antReviewID, fulfillmentID) => {
      // Later, when a view likely pops up to confirm details prior to approval
      // this may be the best point of extension
      acceptAntReview(antReviewID, fulfillmentID);
    };

    const displayOpenAntReviews = (antReviews) => {
      // TODO  - only display / return open ant reviews that are 'fulfillable' (e.g. the author of an ant review should not be able to see it under the `Open AntReviews` list)
      // Also, not expired (cannot currently do this with the contract design)
      return antReviews.map((antReview, index) => {
        // Currently the most recent antReview shows up at the bottom of the list
        const {
          antReview_id: antReviewID,
          amount: rewardAmount,
          issuer,
        } = antReview;

        // If the ant review has been cancelled, then do not display it
        const skipDisplayingAntReview = cancelledAntReviews.find(
          (cancelledReview) => cancelledReview.antReview_id === antReviewID
        );
        if (skipDisplayingAntReview) {
          return null;
        }

        const userIsAuthor = accounts === issuer;
        return (
          <Card
            key={index}
            title={antReview.data}
            style={{ width: 500, marginBottom: "2rem" }}
          >
            <p>Reward - {weiToEth(rewardAmount)} ETH</p>
            <p>Author - {issuer}</p>
            <Space>
              <Button onClick={(e) => handleFulfillClick(e, antReviewID)}>
                Fulfill
              </Button>
              {/* only the author of an antreview can cancel it */}
              {userIsAuthor ? (
                <Button onClick={(e) => handleCancelClick(e, antReviewID)}>
                  Cancel
                </Button>
              ) : null}
            </Space>
          </Card>
        );
      });
    };

    const displayFulfilledAntReviews = (fulfilledAntReviews) => {
      // TODO - only display / return fulfillments that are still available (e.g. the (entire?) reward has not been paid out yet)
      return fulfilledAntReviews.map((fulfilledAntReview, index) => {
        const { antReview_id: antReviewID } = fulfilledAntReview;

        // ONLY if the antReviewID of the current fulfillment maps to an antReview in the antReviews state variable where the issuer of that antReview is the current user
        // THEN we display the card block
        const isCurrentUsersFulfilledAntReview = (antReviewID) =>
          antReviews.filter((review) => {
            const matchingReviewIDs = review.antReview_id === antReviewID;
            const issuerAndCurrentUserMatch = review.issuer === accounts;
            return matchingReviewIDs && issuerAndCurrentUserMatch;
          }).length;

        if (!isCurrentUsersFulfilledAntReview(antReviewID)) {
          return null;
        }

        const {
          data: ipfsHash,
          fulfiller,
          fulfillment_id: fulfillmentID,
        } = fulfilledAntReview;

        return (
          <Card
            key={index}
            title={ipfsHash}
            style={{ width: 500, marginBottom: "2rem" }}
          >
            <p>Peer Reviewer - {fulfiller}</p>
            <Button
              onClick={(e) => handleAcceptClick(e, antReviewID, fulfillmentID)}
            >
              Accept
            </Button>
          </Card>
        );
      });
    };

    const displaySkeleton = () => (
      <Card style={{ width: 500, marginBottom: "2rem" }}>
        <Skeleton active />
      </Card>
    );

    const displayMainContent = () => {
      // display issue ant review modal
      if (displayIssueAntReviewView) {
        return (
          <IssueAntReview
            antReviewID={clickedAntReviewID}
            accounts={accounts}
            web3={web3}
            antsReviewInstance={antsReviewInstance}
          />
        );
      }

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
