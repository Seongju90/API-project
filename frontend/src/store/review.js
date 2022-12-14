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

//added user info to action, reducer, and thunk to dynamically update create review
export const actionCreateReview = (review, user, spot) => {
    return {
        type: CREATE,
        review,
        user,
        spot
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

export const createReviewOfSpot = (review, user, spotId) => async(dispatch) => {
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
        // console.log('newreview in thunk', newReview)
        dispatch(actionCreateReview(newReview, user, spotId));
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
            newState = {...state, spot: {...state.spot}, user: {...state.user}}
            newState.spot[action.review.id] = action.review
            // console.log('reducer', action)
            newState.user = action.user
            return newState
        case DELETE:
            // just {...state} will change outer reference of memory,
            // we explicity spread the nested object, to change the 2nd level inner reference of memory
            // so that redux can catch the change of state, which leads our useSelector in react to cause a re-render if its selecting a nested object
            // newState ={...state} // will not work only changing outer reference
            newState = {...state, spot: {...state.spot}}
            // because newState.spot is specifically looking for nested spot key, we need to make sure that oldstate we spread
            // has a change in reference memory.
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
