import  { csrfFetch } from "./csrf";

/* ---------- TYPE VARIABLES ---------- */
const LOAD = 'reviews/loadReviews';
const CREATE = 'reviews/createReviews';
const DELETE = 'reviews/deleteReviews';

/* ---------- ACTION CREATORS ---------- */

const actionLoadReviews = (reviews) => {
    return {
        type: LOAD,
        reviews
    }
}

export const actionCreateReview = (review) => {
    return {
        type: CREATE,
        review
    }
}

const actionDeleteReview = (id) => {
    return {
        type: DELETE,
        id
    }
}

/* ---------- THUNK ACTION CREATORS ---------- */

// Getting all the reviews of each spot
export const getReviewsOfSpot = (id) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`);

    if(response.ok) {
        const reviews = await response.json()
        // console.log('thunk response', reviews)
        dispatch(actionLoadReviews(reviews))
        return response
    };
}

export const createReviewOfSpot = (review, spotId) => async(dispatch) => {
    // console.log('reviewthunk', review)
    // console.log('reviewthunk', spotId)
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    });

    if(response.ok) {
        const newReview = await response.json();
        console.log('newreview in thunk', newReview)
        dispatch(actionCreateReview(newReview));
    };
}

export const deleteAReview = (id) => async(dispatch) => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method: "DELETE",
    })

    if(response.ok) {
        const deleteMessage = await response.json()

        dispatch(actionDeleteReview(id))
        return deleteMessage
    }
}
/* ---------- REVIEWS REDUCERS W/ INITIAL STATE ---------- */

const reviewsReducer = (state = {spot: {}, user:{}}, action) => {
    let newState = {}
    switch(action.type) {
        case LOAD:
            newState = {...state}
            newState.spot = normalizeArray(action.reviews.Reviews)
            return newState;
        case CREATE:
            newState = {...state, spot: {...state.spot}}
            // console.log("action", action.review)
            // console.log("id", action.review.id)
            newState.spot[action.review.id] = action.review
            return newState
        case DELETE:
            newState ={...state, spot: {...state.spot}, user: {}}
            delete newState.spot[action.id]
            return newState;
        default:
            return state;
    }
}

/* ---------- NORMALIZE ARRAY HELPER FUNCTION ----------*/

const normalizeArray = (array) => {
    if (!(array instanceof Array)) throw new Error('Can not normalize data that is not an array')

    // create an empty object to normalize the data array
    const obj = {}
    // for each data we are making setting the id to new in in empty obj to make 0(1) search time.
    array.forEach(data => {
        obj[data.id] = data
    })

    return obj;
}

export default reviewsReducer
