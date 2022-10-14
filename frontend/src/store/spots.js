/* ---------- TYPE VARIABLES ---------- */
const LOAD = 'spots/loadSpots'




/* ---------- ACTION CREATORS ---------- */
const actionLoadSpots = (spots) => {
    return {
        type: LOAD,
        spots
    }
}




/* ---------- THUNK ACTION CREATORS ---------- */
export const getAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots/')
    console.log('response', response)
    if (response.ok) {
        const spots = await response.json()
        console.log('spots', spots)
        dispatch(actionLoadSpots(spots))
    }
    return response
}



/* ---------- SESSION REDUCERS W/ INITIAL STATE ---------- */

const spotReducer = (state = {}, action) => {
    let newState = {}
    switch(action.type) {
        case LOAD:
            newState = {...state}
            return newState
        default:
            return state
    }
}

export default spotReducer
