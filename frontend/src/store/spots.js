// csrfFetch is a custom fetch that will apply your CSRF Token to all your fetch requests
import  { csrfFetch } from "./csrf";

/* ---------- TYPE VARIABLES ---------- */
const LOAD = 'spots/loadSpots';
const LOADONESPOT = 'spots/loadOneSpot'
const CREATE = 'spots/createSpots';
// const EDIT = 'spots/editSpots';
// const DELETE ='spots/deleteSpots';



/* ---------- ACTION CREATORS ---------- */
const actionLoadSpots = (spots) => {
    return {
        type: LOAD,
        spots
    }
}

const actionloadOneSpot = (spot) => {
    return {
        type: LOADONESPOT,
        spot
    }
}

export const actionCreateASpot = (spot) => {

    return {
        type: CREATE,
        spot
    }
}


/* ---------- THUNK ACTION CREATORS ---------- */
export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/')
    // console.log('response', response)
    if (response.ok) {
        const spots = await response.json()
        // console.log('spots', spots)
        dispatch(actionLoadSpots(spots))
    }
    return response
}

export const getOneSpot = (id) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`)

    if(response.ok) {
        const spot = await response.json()
        dispatch(actionloadOneSpot(spot))
    }
    return response
}

export const createASpot = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })

    if(response.ok) {
        const newSpot = await response.json()
        dispatch(actionCreateASpot(newSpot))
    }
}
/* ---------- SESSION REDUCERS W/ INITIAL STATE ---------- */

// set initial state to the structure of the documents
const spotReducer = (state = {allSpots: {}, singleSpot: {}}, action) => {
    let newState = {}
    switch(action.type) {
        case LOAD:
            // console.log('spots', action.spots.Spots)
            newState = {...state}
            // action.spots returns an obj, key into Spots to get the array
            newState.allSpots = normalizeArray(action.spots.Spots)
            return newState
        case LOADONESPOT:
            newState = {...state}
            newState.singleSpot = action.spot
            return newState;
        case CREATE:
            newState = {...state}
            console.log('state', state.allSpots)
            console.log('create spot', action.spot)
            newState[state.allSpots] = action.spot
            return newState;
        default:
            return state
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
export default spotReducer
