import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react"
import { deleteASpot, getOneSpot } from "../../store/spots";
import { getReviewsOfSpot } from "../../store/review";
import { useParams, useHistory } from "react-router-dom";

import CustomModal from "../CustomModal";
import EditSpotForm from "../EditSpotForm";
import SpotReviews from "../SpotReviews";
import CreateReviewForm from "../CreateReviewForm";
import './SpotDetail.css';


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
    //reviews selector
    const reviewsObj = useSelector(state => state.reviews.spot)
    // turn list of review obj into an array to iterate
    const reviews = Object.values(reviewsObj)
    const existingReview = reviews.find(review => review.userId === userId)

    // Originally spot.SpotImages === undefined, can't use find method on undefined errors out
    // change reducer so that spot has an intial state with they key SpotImages: [],
    // Can use find method on empty array but will be undefined.
    const spotImageArray = spot.SpotImages

    const previewImage = spotImageArray.find(spot => spot.preview === true)

    const nonPreviewImages = spotImageArray.filter(spot => spot.preview === false)

    while (nonPreviewImages.length < 4) {
        nonPreviewImages.push({url: 'https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found-300x169.jpg'})
    }

    useEffect(() => {
        const getData = async() => {
            await dispatch(getOneSpot(spotId))
            await dispatch(getReviewsOfSpot(spotId))
        }
        getData();
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
        <div className="center-spot-container">
            <div className="spot-detail-main-container">
                <h1 className="name-of-spot">{spot.name}</h1>
                <div className="reviews-address-info">
                    <i className="fa-solid fa-star"></i>
                    <span className="avgrating-spotdetails-">{spot.avgStarRating}</span>
                    <i className="fa-solid fa-ellipsis"></i>
                    <span className="numreview-spotdetails">{spot.numReview} reviews</span>
                    <i className="fa-solid fa-ellipsis"></i>
                    <span className="address-spotdetails">{spot.city}, {spot.state}, {spot.country}</span>
                </div>
                <div className="spotdetail-image-main-container">
                    <div className="left-image-container">
                        <img
                            className="previewImage-spotdetail"
                            // add optional chaining because until useEffect fires previewImage === undefined, can't key into undefined
                            src={previewImage?.url}
                            alt="left-preview"
                        />
                    </div>
                    <div className="right-image-container">
                        {nonPreviewImages.map(image => (
                            <img
                                key={image.id}
                                className="nonPreviewImage-spotdetail"
                                src={image?.url}
                                alt='right-preview'
                            />
                        ))}
                    </div>
                </div>
                {/* conditional render a modal if user is here */}
                {/* when passing a component must be Capitalized for react to know it is a component. */}
                <div className="edit-delete-container">
                    { userId === ownerId && <CustomModal buttontext="Edit" Content={EditSpotForm}/>}
                    { userId === ownerId && <button className="delete-button-spot" onClick={deleteSpot}>Delete</button>}
                </div>
                <h2>Reviews</h2>
                <div className="reviews-container">
                    {reviews.map(review => (
                        <SpotReviews key={review.id} review={review} userId={userId}/>
                    ))}
                </div>
                {/* conditionally render the create review */}
                {!existingReview &&
                    <CustomModal buttontext="Write a Review" Content={CreateReviewForm} spotId={spotId}/>
                }
            </div>
        </div>
    );
}

export default SpotDetails
