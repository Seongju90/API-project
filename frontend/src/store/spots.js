// csrfFetch is a custom fetch that will apply your CSRF Token to all your fetch requests
import  { csrfFetch } from "./csrf";

/* ---------- TYPE VARIABLES ---------- */
const LOAD = 'spots/loadSpots';
const LOADONESPOT = 'spots/loadOneSpot'
// const LOADOWNERSPOTS = 'spots/loadOwnerSpots'
const CREATE = 'spots/createSpots';
const EDIT = 'spots/editSpots';
const ADDIMG = '/spots/addImg'
// const DELETE ='spots/deleteSpots';

/* ---------- ACTION CREATORS ---------- */
const actionLoadSpots = (spots) => {
    return {
        type: LOAD,
        spots
    }
}

const actionLoadOneSpot = (spot) => {
    return {
        type: LOADONESPOT,
        spot
    }
}

// const actionLoadOwnerSpots = (spots) => {
//     return {
//         type: LOADOWNERSPOTS,
//         spots
//     }
// }

export const actionCreateASpot = (spot) => {
    return {
        type: CREATE,
        spot
    }
}

export const actionEditASpot = (spot) => {
    return {
        type: EDIT,
        spot
    }
}

const actionAddImg = (spot) => {
    return {
        type: ADDIMG,
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
        dispatch(actionLoadOneSpot(spot))
    }
    return response
}

// export const getOwnerSpots = () => async(dispatch) => {
//     const response = await csrfFetch(`/api/spots/current`)

//     if(response.ok) {
//         const spots = await response.json()
//         dispatch(actionLoadOwnerSpots(spots))
//     }
//     return response
// }

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
        // return the newspot to extract ID in component
        return newSpot
    }
}

export const editASpot = (spot, spotId) => async (dispatch) => {
    // adding the id to find the spot to edit
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })

    if(response.ok) {
        const edittedSpot = await response.json()
        dispatch(actionEditASpot(edittedSpot))
        // return the edittedSpot to extract ID in component
        return edittedSpot
    }
}

// thunk takes two arguments, spot / img body
export const addImgToSpot = (newSpot, spotImgBody) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spotImgBody)
    })

    if(response.ok) {
        const newSpotImg = await response.json()
        // console.log('newSpotImg from thunk', newSpotImg)
        dispatch(actionAddImg(newSpotImg))
        return newSpotImg
    }
}

/* ---------- SESSION REDUCERS W/ INITIAL STATE ---------- */

// set initial state to the structure of the documents
const spotReducer = (state = {allSpots: {}, singleSpot: {}}, action) => {
    let newState = {}
    switch(action.type) {
        case LOAD:
            newState = {...state}
            // action.spots returns an obj, key into Spots to get the array
            newState.allSpots = normalizeArray(action.spots.Spots)
            return newState
        case LOADONESPOT:
            newState = {...state, allSpots: {...state.allSpots}, singleSpot: {...state.singleSpot}}
            newState.singleSpot = action.spot
            return newState;
        // case LOADOWNERSPOTS:
        //     newState = {...state}
        //     // made a new state for owner's spots
        //     newState.ownerSpots = normalizeArray(action.spots.Spots)
        //     return newState;
        case CREATE:
            // don't need singleSpot prev state, because we arn't using it in create component
            newState = {...state, allSpots: {...state.allSpots}}
            // key into allspots add a key of new spotid to the value of new spot
            newState.allSpots[action.spot.id] = action.spot
            return newState;
        case EDIT:
            // don't need allSpots slice prev state because we arn't using it in edit component
            // changing state causes re-render, overriding old spot information(...state.singleSpot) with new spot(action.spot)
            newState = {...state, singleSpot: {...state.singleSpot, ...action.spot}}
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
