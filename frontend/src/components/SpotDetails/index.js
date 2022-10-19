import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react"
import { deleteASpot, getOneSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import CustomModal from "../CustomModal";
import EditSpotForm from "../EditSpotForm";

const SpotDetails = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    // extract the spotId from the parameter
    const { spotId } = useParams()
    // find userId from session state // type of data = number
    // question mark: optional chaining, checks to see if what before it exists
    // and if it doesn't it stops it from continuing on with the line
    const userId = useSelector(state => state.session.user?.id)

    // find ownerId from spot data // type of data = number
    const ownerId = useSelector(state => state.spots.singleSpot.ownerId)

    //spot selector
    const spot = useSelector(state => state.spots.singleSpot)

    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    const deleteSpot = async (e) => {
        e.preventDefault()
        await dispatch(deleteASpot(spotId)).then(res => {
            const { message } = res
            alert(message)
        })

        history.push("/")
    }

    return (
        <div>
            <h1>Spot Detail Information</h1>
            <ul>
                <li>
                    {spot.address}
                </li>
                <li>
                    {spot.city}
                </li>
                <li>
                    {spot.state}
                </li>
                <li>
                    {spot.country}
                </li>
                <li>
                    {spot.name}
                </li>
                <li>
                    {spot.description}
                </li>
                <li>
                    {spot.price}
                </li>
            </ul>
            {/* conditional render a modal if user is here */}
            {/* when passing a component must be Capitalized for react to know it is a component. */}
            { userId === ownerId && <CustomModal buttontext="Edit" Content={EditSpotForm}/>}
            { userId === ownerId && <button onClick={deleteSpot}>Delete</button>}
        </div>
    );
}

export default SpotDetails
