/* ---------- TYPE VARIABLES ---------- */
const LOAD = 'spots/loadSpots';
const LOADONESPOT = 'spots/loadOneSpot'
// const CREATE = 'spots/createSpots';
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



/* ---------- THUNK ACTION CREATORS ---------- */
export const getAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots/')
    // console.log('response', response)
    if (response.ok) {
        const spots = await response.json()
        // console.log('spots', spots)
        dispatch(actionLoadSpots(spots))
    }
    return response
}

export const getOneSpot = (id) => async(dispatch) => {
    const response = await fetch(`/api/spots/${id}`)

    if(response.ok) {
        const spot = await response.json()
        dispatch(actionloadOneSpot(spot))
    }
    return response
}

/* ---------- SESSION REDUCERS W/ INITIAL STATE ---------- */

const spotReducer = (state = {}, action) => {
    let newState = {...state}
    switch(action.type) {
        case LOAD:
            // console.log('spots', action.spots.Spots)
            // action.spots returns an obj, key into Spots to get the array
            let normalizeData = normalizeArray(action.spots.Spots)
            newState = {...normalizeData}
            return newState
        case LOADONESPOT:
            newState = {...action.spot}
            // console.log('state', newState)
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
