import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { getOwnerSpots } from "../../store/spots"

const OwnersSpot = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const ownerSpots = useSelector(state => console.log('ownerspots',state.spots.ownerSpots))
    const sessionId = useSelector(state => console.log('sessionID', state.session.user.id))

    useEffect(() => {
        dispatch(getOwnerSpots())
    }, [dispatch])

    return (
        <div>
            <button>
                Edit
            </button>
            <button>
                Delete
            </button>
        </div>
    );
}

export default OwnersSpot
