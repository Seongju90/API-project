import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react"
import { getOneSpot } from "../../store/spots";
import { useParams } from "react-router-dom";

const SpotDetails = () => {
    // extract the spotId from the parameter
    const { spotId } = useParams()
    // select the spotDetail action creator thunk
    const spot = useSelector((state) => state.spots.singleSpot)
    // console.log('spot detail', spot)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    return (
        <div>
            Spot Detail Information
        </div>
    );
}

export default SpotDetails
