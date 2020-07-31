const isUserIssuer = (acceptedAntReviews, account) => {
    return acceptedAntReviews.filter(fulfillment => fulfillment.issuer === account)
}

export default isUserIssuer