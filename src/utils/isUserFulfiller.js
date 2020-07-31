const isUserFulfiller = (acceptedAntReviews, account) => {
    return acceptedAntReviews.filter(fulfillment => fulfillment.fulfiller === account)
}

export default isUserFulfiller