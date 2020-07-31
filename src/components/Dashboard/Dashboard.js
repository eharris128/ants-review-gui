import React from "react";

import { Skeleton, Typography, Card, Button, Space } from "antd";

import { FulfillAntReview } from "../FulfillAntReview";
import getWeb3 from "../../utils/getWeb3";
import isUserFulfiller from "../../utils/isUserFulfiller";
import AntsReview from "../../contracts/AntsReview.json";
import weiToEth from "../../utils/weiToEth";
import IssueAntReview from "../IssueAntReview/IssueAntReview";
import { PeerReviewerProfile } from "../PeerReviewerProfile";
import { AuthorProfile } from "../AuthorProfile";
import { AntReviewDetailView } from "../AntReviewDetailView";
import { FulfillmentDetails } from "../FulfillmentDetails";

import "./index.css";
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
      acceptedAntReviews: [],
      selectedAntReviewDetails: null,
      selectedFulfillmentDetails: null,
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
      this.listenAntReviewAcceptedEvent(this);
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

  listenAntReviewAcceptedEvent = (component) => {
    this.state.antsReviewInstance.events
      .FulfillmentAccepted({ fromBlock: 0 })
      .on("data", async (event) => {
        let acceptedAntReviewArray = component.state.acceptedAntReviews.slice();
        acceptedAntReviewArray.push(event.returnValues);
        component.setState({ acceptedAntReviews: acceptedAntReviewArray });
      })
      .on("error", console.error);
  };

  componentDidUpdate(prevProps) {
    // reset ant review id being sent to the fulfill ant review component
    if (this.props.currentDisplay !== prevProps.currentDisplay) {
      // if the initial 'dashboard' from which a user can click fulfill changes from the 'authorDashboard' display name
      // then the 'authorDashboard' reference here must be updated.
      const changeFromPeerDashToFullfill =
        this.props.currentDisplay === "fulfillAntReview" &&
        (prevProps.currentDisplay === "peerReviewerDashboard" ||
          prevProps.currentDisplay === "authorDashboard");
      if (!changeFromPeerDashToFullfill) {
        this.setState((prevState) => {
          return {
            ...prevState,
            clickedAntReviewID: null,
          };
        });
      }
    }
  }

  render() {
    const { Title, Paragraph } = Typography;
    const {
      currentDisplay,
      setFulfillView,
      setAntReviewDetailsView,
      setFulfillmentDetailsView,
    } = this.props;

    const {
      web3,
      antsReviewInstance,
      antReviews,
      clickedAntReviewID,
      accounts,
      fulfilledAntReviews,
      cancelledAntReviews,
      acceptedAntReviews,
      selectedAntReviewDetails,
      selectedFulfillmentDetails,
    } = this.state;

    // fulfill workflow
    const handleFulfillClick = (e, antReviewID) => {
      setClickedAntReviewID(antReviewID);
      setFulfillView();
    };

    const setClickedAntReviewID = (antReviewID) => {
      this.setState((prevState) => {
        return {
          ...prevState,
          clickedAntReviewID: antReviewID,
        };
      });
    };

    // antReview details workflow
    const handleAntReviewDetailsClick = (e, antReview) => {
      setAntReviewDetailsView();
      this.setState((prevState) => {
        return {
          ...prevState,
          selectedAntReviewDetails: antReview,
        };
      });
    };

    // fulfillment details workflow
    const handleFulfillmentDetailsClick = (e, fulfillment) => {
      setFulfillmentDetailsView();
      this.setState((prevState) => {
        return {
          ...prevState,
          selectedFulfillmentDetails: fulfillment,
        };
      });
    };

    // cancel workflow
    const handleCancelClick = (e, antReviewID) => {
      // Later, add a 'Are you sure you want to cancel' modal, etc...
      // antd Popup -> see antd components space page.
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
        // TODO - this filter logic likely needs to be at a higher level to improve the quality of other views of the ant reviews
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
              <Button
                onClick={(e) => handleAntReviewDetailsClick(e, antReview)}
              >
                View AntReview Details
              </Button>
            </Space>
          </Card>
        );
      });
    };

    const displayFulfilledAntReviews = (fulfilledAntReviews) => {
      // TODO - only display / return fulfillments that are still available (e.g. the (entire?) reward has not been paid out yet)
      return fulfilledAntReviews.map((fulfilledAntReview, index) => {
        const { antReview_id: antReviewID } = fulfilledAntReview;

        // ONLY if the fulfillment has not already been accepted
        // THEN we check to confirm that it is the current user's review
        const skipDisplayingAntReview = acceptedAntReviews.find(
          (acceptedReview) => acceptedReview._antReviewId === antReviewID
        );
        if (skipDisplayingAntReview) {
          return null;
        }
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

    const displayUnpaidReviews = (
      myCompletedReviews,
      acceptedAntReviews,
      accounts
    ) => {
      const myFulfilledReviews = isUserFulfiller(fulfilledAntReviews, accounts);
      const myUnpaidFulfillments = myFulfilledReviews.filter(
        ({ antReview_id: fulfilledAntReviewID }) => {
          // if the antReview_id of my fulfilledReview is not contained as the _antReviewId within the myCompletedReviews array
          // then this is an unpaid (or expired with current design) fulfillment

          const fulfillmentIsUnpaid = () => {
            return !myCompletedReviews.some(
              ({ _antReviewId: completedAntReviewID }) =>
                completedAntReviewID === fulfilledAntReviewID
            );
          };

          return fulfillmentIsUnpaid();
        }
      );
      return myUnpaidFulfillments.length ? (
        // Do we want to display the unpaid fulfillment or the coupled ant review?
        // Could link to the ant review detail view from the fulfillment?
        myUnpaidFulfillments.map((unpaidFulfillment, index) => {
          const { data: peerReviewHash } = unpaidFulfillment;
          return (
            <Card
              key={index}
              title={peerReviewHash}
              style={{ marginBottom: "2rem" }}
            >
              <Button
                onClick={(e) =>
                  handleFulfillmentDetailsClick(e, unpaidFulfillment)
                }
              >
                View Fulfillment Details
              </Button>
            </Card>
          );
        })
      ) : (
        <div>0 reviews currently awaiting payment.</div>
      );
    };

    const displayUnpaidReviewers = (myAntReviews, fulfilledAntReviews) => {
      const unpaidReviewers = fulfilledAntReviews.filter((fulfillment) => {
        return myAntReviews.some(
          ({ antReview_id: myAntReviewID }) =>
            fulfillment.antReview_id === myAntReviewID
        );
      });
      return unpaidReviewers.map((unpaidReviewer, index) => {
        const {
          fulfiller,
          fulfillment_id: fulfillmentID,
          data: reviewHash,
          antReview_id: antReviewID,
        } = unpaidReviewer;
        return (
          <Card key={index} title={reviewHash}>
            <Paragraph> Peer Reviewer - {fulfiller}</Paragraph>
            <Space>
              {/* TODO - Link to Edit View */}
              <Button disabled={true}>Edit AntReview</Button>
              <Button
                onClick={(e) =>
                  handleFulfillmentDetailsClick(e, unpaidReviewer)
                }
              >
                View Fulfillment Details
              </Button>

              <Button
                onClick={(e) =>
                  handleAcceptClick(e, antReviewID, fulfillmentID)
                }
              >
                Accept
              </Button>
            </Space>
          </Card>
        );
      });
    };

    const displayMyUnreviewedReviews = (
      myAntReviews,
      fulfilledAntReviews,
      account
    ) => {
      // TODO - filter out 'completed' antreviews + 'canceled' antreviews.

      // Filter antReviews such that I only have ones where i am the issuer

      // Filter the ^ subset by searching for reviews that have 0 fulfillments against them.
      const myUnfilfilledAntReviews = myAntReviews.filter(
        ({ antReview_id: myAntReviewID }) => {
          return fulfilledAntReviews.some(
            ({ antReview_id: fulfilledAntReviewID }) => {
              return fulfilledAntReviewID === myAntReviewID;
            }
          );
        }
      );

      return myUnfilfilledAntReviews.map((unfilledAntReview, index) => {
        const {
          antReview_id: antReviewID,
          data: paperHash,
          amount: rewardAmount,
        } = unfilledAntReview;
        return (
          <Card key={index} title={paperHash}>
            <p>Reward - {weiToEth(rewardAmount)} ETH</p>
            <Space>
              <Button onClick={(e) => handleCancelClick(e, antReviewID)}>
                Cancel
              </Button>
              {/* TODO - Link to Edit View */}
              <Button disabled={true}>Edit AntReview</Button>
              <Button
                onClick={(e) =>
                  handleAntReviewDetailsClick(e, unfilledAntReview)
                }
              >
                View AntReview Details
              </Button>
            </Space>
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
      // Display management
      // Warning - modification of the Sider menu item key names will need to be coupled with changes to the relevant display control below.
      if (currentDisplay === "peerReviewerDashboard") {
        const myCompletedReviews = isUserFulfiller(
          acceptedAntReviews,
          accounts
        );

        return (
          <>
            <div className="peerReviewDashboardContainer">
              <div>
                <Title level={2}>Open AntReviews</Title>
                {antReviews.length
                  ? displayOpenAntReviews(antReviews)
                  : displaySkeleton()}
              </div>
              <div>
                {/* Completed Reviews == fulfilled && paid out reviews */}
                <Title level={2}>My Reviews Awaiting Payment</Title>
                {myCompletedReviews.length
                  ? displayUnpaidReviews(
                      myCompletedReviews,
                      acceptedAntReviews,
                      accounts
                    )
                  : displaySkeleton()}
              </div>
            </div>
          </>
        );
      }

      if (currentDisplay === "peerReviewerProfile") {
        return (
          <PeerReviewerProfile
            acceptedAntReviews={acceptedAntReviews}
            accounts={accounts}
          />
        );
      }

      if (currentDisplay === "authorDashboard") {
        const isUserAntReviewAuthor = (antReviews, account) => {
          return antReviews.filter(({ issuer }) => {
            return issuer === account;
          });
        };
        const myAntReviews = isUserAntReviewAuthor(antReviews, accounts);

        return (
          <>
            <div className="authorDashboardContainer">
              <div>
                <Title level={2}>AntReviews Awaiting Reviewers</Title>
                {antReviews.length
                  ? displayMyUnreviewedReviews(
                      myAntReviews,
                      fulfilledAntReviews,
                      accounts
                    )
                  : displaySkeleton()}
              </div>
              <div>
                <Title level={2}>Peer Reviewers Awaiting Payout</Title>
                {fulfilledAntReviews.length
                  ? displayUnpaidReviewers(myAntReviews, fulfilledAntReviews)
                  : displaySkeleton()}
              </div>
            </div>
          </>
        );
      }
      if (currentDisplay === "authorProfile") {
        const isUserAntReviewAuthor = (antReviews, account) => {
          return antReviews.filter(({ issuer }) => {
            return issuer === account;
          });
        };
        const myAntReviews = isUserAntReviewAuthor(antReviews, accounts);
        return (
          <AuthorProfile
            myAntReviews={myAntReviews}
            acceptedAntReviews={acceptedAntReviews}
            accounts={accounts}
          />
        );
      }

      if (currentDisplay === "issueAntReview") {
        return (
          <IssueAntReview
            antReviewID={clickedAntReviewID}
            accounts={accounts}
            web3={web3}
            antsReviewInstance={antsReviewInstance}
          />
        );
      }

      if (currentDisplay === "fulfillAntReview") {
        return (
          <FulfillAntReview
            antReviews={antReviews}
            cancelledAntReviews={cancelledAntReviews}
            antReviewID={clickedAntReviewID}
            accounts={accounts}
            web3={web3}
            antsReviewInstance={antsReviewInstance}
          />
        );
      }

      if (currentDisplay === "antReviewDetails") {
        return <AntReviewDetailView antReview={selectedAntReviewDetails} />;
      }

      if (currentDisplay === "fulfillmentDetails") {
        return <FulfillmentDetails fulfillment={selectedFulfillmentDetails} />;
      }

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
    };

    return displayMainContent();
  }
}

export default Dashboard;
